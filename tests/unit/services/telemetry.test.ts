import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchJson } from '../../../src/services/http';
import { configureTelemetrySink, resetTelemetrySink } from '../../../src/services/telemetry';

describe('telemetry correlation', () => {
  afterEach(() => {
    resetTelemetrySink();
    vi.restoreAllMocks();
  });

  it('preserves the caller request ID in HTTP failure events', async () => {
    const events: Array<{ requestId: string; operation: string; category: string }> = [];
    configureTelemetrySink((event) => events.push(event));
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 503 }));

    await expect(
      fetchJson('/test', { operation: 'forecast', requestId: 'correlation-123' }),
    ).rejects.toMatchObject({ code: 'service-unavailable' });

    expect(events).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          category: 'network',
          operation: 'forecast',
          requestId: 'correlation-123',
        }),
      ]),
    );
  });
});
