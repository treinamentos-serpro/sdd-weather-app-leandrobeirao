import { describe, expectTypeOf, it } from 'vitest';
import type {
  AppError,
  City,
  CurrentWeather,
  ForecastDay,
  Unit,
  WeatherData,
} from '../../../src/types/weather';

describe('weather domain contracts', () => {
  it('exposes the expected public domain types', () => {
    const city = {
      id: 3448439,
      name: 'São Paulo',
      latitude: -23.5489,
      longitude: -46.6388,
      timezone: 'America/Sao_Paulo',
      region: 'São Paulo',
      country: 'Brasil',
    } satisfies City;

    const current = {
      temperatureCelsius: 24.5,
      weatherCode: 0,
      condition: 'Céu limpo',
    } satisfies CurrentWeather;

    const forecastDay = {
      date: '2026-09-16',
      minimumCelsius: 18,
      maximumCelsius: 27,
      weatherCode: 1,
      condition: 'Parcialmente nublado',
      available: true,
      missingFields: [],
    } satisfies ForecastDay;

    const weatherData = {
      city,
      current,
      forecast: [forecastDay],
      unit: 'celsius',
    } satisfies WeatherData;

    const error = {
      code: 'timeout',
      message: 'A consulta demorou mais que o esperado',
      retryable: true,
    } satisfies AppError;

    expectTypeOf(city).toMatchTypeOf<City>();
    expectTypeOf(current).toMatchTypeOf<CurrentWeather>();
    expectTypeOf(forecastDay).toMatchTypeOf<ForecastDay>();
    expectTypeOf(weatherData).toMatchTypeOf<WeatherData>();
    expectTypeOf(error).toMatchTypeOf<AppError>();
    expectTypeOf<Unit>('celsius').toEqualTypeOf<Unit>();
  });
});
