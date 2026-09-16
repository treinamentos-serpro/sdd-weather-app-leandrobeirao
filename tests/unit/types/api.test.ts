import { describe, expectTypeOf, it } from 'vitest';
import type {
  ApiDailyData,
  ForecastApiResponse,
  GeocodingApiResponse,
  GeocodingResult,
} from '../../../src/types/api';

describe('api contracts', () => {
  it('defines the external payloads required by geocoding and forecast', () => {
    const geocoding = {
      results: [
        {
          id: 3448439,
          name: 'São Paulo',
          latitude: -23.55,
          longitude: -46.64,
          timezone: 'America/Sao_Paulo',
          admin1: 'São Paulo',
          country: 'Brasil',
        },
      ],
      generationtime_ms: 12.5,
    } satisfies GeocodingApiResponse;

    const forecast = {
      latitude: -23.55,
      longitude: -46.64,
      timezone: 'America/Sao_Paulo',
      current: {
        time: '2026-09-16T14:00',
        temperature_2m: 22.4,
        weather_code: 2,
      },
      daily: {
        time: ['2026-09-16', '2026-09-17', '2026-09-18'],
        temperature_2m_min: [18, 18.2, 19.4],
        temperature_2m_max: [25.2, 26.4, 27.3],
        weather_code: [1, 2, 3],
      },
    } satisfies ForecastApiResponse;

    expectTypeOf(geocoding.results[0]).toMatchTypeOf<GeocodingResult>();
    expectTypeOf(forecast.daily).toMatchTypeOf<ApiDailyData>();
    expectTypeOf(forecast.current.temperature_2m).toEqualTypeOf<number>();
  });
});
