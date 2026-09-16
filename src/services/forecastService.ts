import type { WeatherData, City } from '../types/weather';
import type { ForecastApiResponse } from '../types/api';
import { describeWeatherCode } from '../utils/weatherCodes';
import { normalizeForecast } from '../utils/forecast';
import { fetchJson } from './http';

export async function fetchForecast(city: City, signal?: AbortSignal): Promise<WeatherData> {
  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.searchParams.set('latitude', String(city.latitude));
  url.searchParams.set('longitude', String(city.longitude));
  url.searchParams.set('current', 'temperature_2m,weather_code');
  url.searchParams.set('daily', 'temperature_2m_min,temperature_2m_max,weather_code');
  url.searchParams.set('forecast_days', '5');
  url.searchParams.set('timezone', 'auto');

  const payload = await fetchJson<ForecastApiResponse>(url.toString(), { signal, timeoutMs: 8000 });

  if (!payload.current || typeof payload.current.temperature_2m !== 'number' || typeof payload.current.weather_code !== 'number') {
    throw {
      code: 'invalid-response',
      message: 'Não foi possível consultar o serviço.',
      retryable: true,
    };
  }

  if (!payload.daily) {
    throw {
      code: 'invalid-response',
      message: 'Não foi possível consultar o serviço.',
      retryable: true,
    };
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
