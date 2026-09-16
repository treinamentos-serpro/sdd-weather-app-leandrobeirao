import { describe, expect, it, vi } from 'vitest';
import { searchLocations } from '../../../src/services/geocodingService';

describe('searchLocations', () => {
  it('maps geocoding results to City values', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        results: [{ id: 1, name: 'São Paulo', latitude: -23, longitude: -46, timezone: 'America/Sao_Paulo', admin1: 'São Paulo', country: 'Brasil' }],
      }),
    }));

    const result = await searchLocations('São Paulo');
    expect(result[0]).toMatchObject({ name: 'São Paulo', country: 'Brasil', region: 'São Paulo' });
  });
});
