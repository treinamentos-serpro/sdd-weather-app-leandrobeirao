import { describe, expect, it } from 'vitest';
import { normalizeForecast } from '../../../src/utils/forecast';

describe('normalizeForecast', () => {
  it('returns exactly five positions and marks missing fields', () => {
    const result = normalizeForecast(
      {
        time: ['2026-09-16', '2026-09-17'],
        temperature_2m_min: [18, 19],
        temperature_2m_max: [26],
        weather_code: [0, 1, 2, 3, 4],
      },
      'America/Sao_Paulo',
    );

    expect(result).toHaveLength(5);
    expect(result[0].available).toBe(true);
    expect(result[2].missingFields).toContain('maximum');
  });

  it('throws for incompatible daily arrays', () => {
    expect(() => normalizeForecast({ time: 'not-array' as never }, 'America/Sao_Paulo')).toThrow(
      'invalid-response',
    );
  });

  it('marks dates outside YYYY-MM-DD as unavailable', () => {
    const [day] = normalizeForecast(
      {
        time: ['2026-02-30'],
        temperature_2m_min: [18],
        temperature_2m_max: [26],
        weather_code: [0],
      },
      'America/Sao_Paulo',
    );

    expect(day.available).toBe(false);
    expect(day.missingFields).toContain('date');
  });

  it('rejects an invalid timezone', () => {
    expect(() =>
      normalizeForecast(
        { time: [], temperature_2m_min: [], temperature_2m_max: [], weather_code: [] },
        'Not/ATimezone',
      ),
    ).toThrow('invalid-response');
  });
});
