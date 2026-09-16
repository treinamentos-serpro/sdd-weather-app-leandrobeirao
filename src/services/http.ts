import type { AppError } from '../types/weather';

export type HttpError = AppError & { cause?: unknown };

export function isTimeoutError(error: unknown): boolean {
  if (!error || typeof error !== 'object') {
    return false;
  }

  const candidate = error as { code?: string };
  return candidate.code === 'timeout';
}

export async function fetchJson<T>(
  input: RequestInfo | URL,
  init: RequestInit & { timeoutMs?: number } = {},
): Promise<T> {
  const { timeoutMs = 8000, signal, ...rest } = init;
  const controller = new AbortController();

  if (signal) {
    if (signal.aborted) {
      controller.abort();
    } else {
      signal.addEventListener('abort', () => controller.abort(), { once: true });
    }
  }

  let timedOut = false;
  const timeoutId = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeoutMs);

  try {
    const response = await fetch(input, {
      ...rest,
      signal: controller.signal,
    });

    if (!response.ok) {
      if (response.status === 429) {
        throw {
          code: 'rate-limit',
          message: 'Serviço temporariamente indisponível.',
          retryable: true,
        } satisfies AppError;
      }

      if (response.status >= 500) {
        throw {
          code: 'service-unavailable',
          message: 'Não foi possível consultar o serviço.',
          retryable: true,
        } satisfies AppError;
      }

      throw {
        code: 'service-unavailable',
        message: 'Não foi possível consultar o serviço.',
        retryable: true,
      } satisfies AppError;
    }

    return (await response.json()) as T;
  } catch (error) {
    const candidate = error as { code?: string; name?: string; message?: string };

    if (signal?.aborted) {
      throw error;
    }

    if (candidate.name === 'AbortError' || timedOut) {
      throw {
        code: 'timeout',
        message: 'A consulta demorou mais que o esperado.',
        retryable: true,
      } satisfies AppError;
    }

    if (candidate.code === 'rate-limit' || candidate.code === 'service-unavailable') {
      throw {
        code: candidate.code,
        message: candidate.message ?? 'Não foi possível consultar o serviço.',
        retryable: true,
      } satisfies AppError;
    }

    throw {
      code: 'service-unavailable',
      message: 'Não foi possível consultar o serviço.',
      retryable: true,
    } satisfies AppError;
  } finally {
    clearTimeout(timeoutId);
  }
}
