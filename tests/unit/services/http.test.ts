import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchJson, isTimeoutError } from '../../../src/services/http';

describe('fetchJson', () => {
  afterEach(() => vi.restoreAllMocks());

  it('returns json data on success', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true }),
    }));

    await expect(fetchJson('/test')).resolves.toMatchObject({ ok: true });
  });

  it('classifies timeout errors', async () => {
    vi.stubGlobal('fetch', vi.fn().mockImplementation(() => Promise.reject(new DOMException('aborted', 'AbortError'))));

    await expect(fetchJson('/test', { timeoutMs: 1 })).rejects.toMatchObject({ code: 'timeout' });
  });

  it('identifies timeout custom errors', () => {
    expect(isTimeoutError({ code: 'timeout' })).toBe(true);
    expect(isTimeoutError({ code: 'service-unavailable' })).toBe(false);
  });
});
