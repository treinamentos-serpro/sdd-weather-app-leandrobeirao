export interface GeocodingResult {
  id?: unknown;
  name?: unknown;
  latitude?: unknown;
  longitude?: unknown;
  timezone?: unknown;
  admin1?: unknown;
  country?: unknown;
  country_code?: unknown;
}

export interface GeocodingApiResponse {
  results?: unknown;
  generationtime_ms?: unknown;
}

export interface ForecastCurrentApi {
  time?: unknown;
  temperature_2m?: unknown;
  weather_code?: unknown;
}

export interface ApiDailyData {
  time?: unknown;
  temperature_2m_min?: unknown;
  temperature_2m_max?: unknown;
  weather_code?: unknown;
}

export interface ForecastApiResponse {
  latitude?: unknown;
  longitude?: unknown;
  timezone?: unknown;
  current?: ForecastCurrentApi;
  daily?: ApiDailyData;
}
