import type { ForecastApiResponse } from '../types/api';
import type { City, WeatherData } from '../types/weather';
import { normalizeForecast } from '../utils/forecast';
import { describeWeatherCode } from '../utils/weatherCodes';
import { fetchJson } from './http';
import { createRequestId, recordTelemetry } from './telemetry';

const invalidResponseError = {
  code: 'invalid-response',
  message: 'Não foi possível consultar o serviço.',
  retryable: true,
} as const;

export async function fetchForecast(city: City, signal?: AbortSignal): Promise<WeatherData> {
  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.searchParams.set('latitude', String(city.latitude));
  url.searchParams.set('longitude', String(city.longitude));
  url.searchParams.set('current', 'temperature_2m,weather_code');
  url.searchParams.set('daily', 'temperature_2m_min,temperature_2m_max,weather_code');
  url.searchParams.set('forecast_days', '5');
  url.searchParams.set('timezone', 'auto');

  const payload = await fetchJson<ForecastApiResponse>(url.toString(), {
    signal,
    timeoutMs: 8000,
    operation: 'forecast',
  });

  if (
    !payload ||
    typeof payload !== 'object' ||
    !payload.current ||
    typeof payload.current.temperature_2m !== 'number' ||
    !Number.isFinite(payload.current.temperature_2m) ||
    typeof payload.current.weather_code !== 'number' ||
    !Number.isFinite(payload.current.weather_code) ||
    typeof payload.timezone !== 'string' ||
    payload.timezone !== city.timezone
  ) {
    recordTelemetry({
      category: 'invalid-response',
      operation: 'forecast',
      timestamp: new Date().toISOString(),
      requestId: createRequestId(),
    });
    throw invalidResponseError;
  }

  if (!payload.daily || typeof payload.daily !== 'object') {
    recordTelemetry({
      category: 'invalid-response',
      operation: 'forecast',
      timestamp: new Date().toISOString(),
      requestId: createRequestId(),
    });
    throw invalidResponseError;
  }

  const forecast = normalizeForecast(payload.daily, city.timezone);

  return {
    city,
    current: {
      temperatureCelsius: payload.current.temperature_2m,
      weatherCode: payload.current.weather_code,
      condition: describeWeatherCode(payload.current.weather_code),
    },
    forecast,
    unit: 'celsius',
  };
}
