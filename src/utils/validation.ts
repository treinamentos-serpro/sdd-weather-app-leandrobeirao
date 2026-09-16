import type { AppErrorCode } from '../types/weather';

export type ValidationSuccess = {
  ok: true;
  value: string;
};

export type ValidationFailure = {
  ok: false;
  code: AppErrorCode;
  message: string;
};

export type ValidationResult = ValidationSuccess | ValidationFailure;

export function validateCityQuery(input: string): ValidationResult {
  const normalized = input.trim();

  if (normalized.length === 0) {
    return {
      ok: false,
      code: 'invalid-input',
      message: 'Informe o nome de uma cidade.',
    };
  }

  if (normalized.length > 100) {
    return {
      ok: false,
      code: 'too-long',
      message: 'O nome da cidade deve ter até 100 caracteres.',
    };
  }

  return {
    ok: true,
    value: normalized,
  };
}
