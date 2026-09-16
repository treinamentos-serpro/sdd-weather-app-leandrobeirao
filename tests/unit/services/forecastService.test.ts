import { describe, expect, it, vi } from 'vitest';
import { fetchForecast } from '../../../src/services/forecastService';

describe('fetchForecast', () => {
  it('returns forecast data for a selected city', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          latitude: -23,
          longitude: -46,
          timezone: 'America/Sao_Paulo',
          current: { temperature_2m: 22.5, weather_code: 2 },
          daily: {
            time: ['2026-09-16', '2026-09-17', '2026-09-18', '2026-09-19', '2026-09-20'],
            temperature_2m_min: [18, 19, 20, 21, 22],
            temperature_2m_max: [25, 26, 27, 28, 29],
            weather_code: [2, 2, 3, 1, 0],
          },
        }),
      }),
    );

    const result = await fetchForecast({
      name: 'São Paulo',
      latitude: -23,
      longitude: -46,
      timezone: 'America/Sao_Paulo',
    });
    expect(result.forecast).toHaveLength(5);
    expect(result.current.condition).toBe('Parcialmente nublado');
  });

  it('rejects a forecast from a different timezone', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          timezone: 'UTC',
          current: { temperature_2m: 22, weather_code: 0 },
          daily: { time: [], temperature_2m_min: [], temperature_2m_max: [], weather_code: [] },
        }),
      }),
    );

    await expect(
      fetchForecast({
        name: 'São Paulo',
        latitude: -23,
        longitude: -46,
        timezone: 'America/Sao_Paulo',
      }),
    ).rejects.toMatchObject({ code: 'invalid-response' });
  });
});
