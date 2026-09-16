import type { ForecastDay, ForecastMissingField } from '../types/weather';
import { describeWeatherCode } from './weatherCodes';

type ForecastApiLike = {
  time?: unknown;
  temperature_2m_min?: unknown;
  temperature_2m_max?: unknown;
  weather_code?: unknown;
};

export function normalizeForecast(
  daily: ForecastApiLike,
  timezone: string,
): ForecastDay[] {
  if (!daily || typeof daily !== 'object' || Array.isArray(daily)) {
    throw new Error('invalid-response');
  }

  const timeArray = daily.time;
  const minArray = daily.temperature_2m_min;
  const maxArray = daily.temperature_2m_max;
  const codeArray = daily.weather_code;

  if (!Array.isArray(timeArray) || !Array.isArray(minArray) || !Array.isArray(maxArray) || !Array.isArray(codeArray)) {
    throw new Error('invalid-response');
  }

  const entries: ForecastDay[] = [];

  for (let index = 0; index < 5; index += 1) {
    const date = typeof timeArray[index] === 'string' ? timeArray[index] : undefined;
    const minimumValue = minArray[index];
    const maximumValue = maxArray[index];
    const weatherCode = codeArray[index];

    const missingFields: ForecastMissingField[] = [];

    if (!date) {
      missingFields.push('date');
    }
    if (typeof minimumValue !== 'number' || Number.isNaN(minimumValue)) {
      missingFields.push('minimum');
    }
    if (typeof maximumValue !== 'number' || Number.isNaN(maximumValue)) {
      missingFields.push('maximum');
    }
    if (typeof weatherCode !== 'number' || Number.isNaN(weatherCode)) {
      missingFields.push('condition');
    }

    const condition = typeof weatherCode === 'number' ? describeWeatherCode(weatherCode) : undefined;

    entries.push({
      date: date ?? `missing-${index}`,
      minimumCelsius: typeof minimumValue === 'number' && !Number.isNaN(minimumValue) ? minimumValue : undefined,
      maximumCelsius: typeof maximumValue === 'number' && !Number.isNaN(maximumValue) ? maximumValue : undefined,
      weatherCode: typeof weatherCode === 'number' && !Number.isNaN(weatherCode) ? weatherCode : undefined,
      condition,
      available: missingFields.length === 0,
      missingFields,
    });
  }

  void timezone;
  return entries;
}
