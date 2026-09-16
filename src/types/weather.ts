export type Unit = 'celsius' | 'fahrenheit';

export interface City {
  id?: number;
  name: string;
  latitude: number;
  longitude: number;
  timezone: string;
  region?: string;
  country?: string;
}

export interface CurrentWeather {
  temperatureCelsius: number;
  weatherCode: number;
  condition: string;
}

export type ForecastMissingField = 'date' | 'minimum' | 'maximum' | 'condition';

export interface ForecastDay {
  date: string;
  minimumCelsius?: number;
  maximumCelsius?: number;
  weatherCode?: number;
  condition?: string;
  available: boolean;
  missingFields: ForecastMissingField[];
}

export interface WeatherData {
  city: City;
  current: CurrentWeather;
  forecast: ForecastDay[];
  unit: Unit;
}

export type AppErrorCode =
  | 'invalid-input'
  | 'too-long'
  | 'empty-results'
  | 'timeout'
  | 'rate-limit'
  | 'service-unavailable'
  | 'invalid-response';

export interface AppError {
  code: AppErrorCode;
  message: string;
  retryable: boolean;
}
