export interface GeocodingResult {
  id?: number;
  name: string;
  latitude: number;
  longitude: number;
  timezone: string;
  admin1?: string;
  country?: string;
  country_code?: string;
}

export interface GeocodingApiResponse {
  results?: GeocodingResult[];
  generationtime_ms?: number;
}

export interface ForecastCurrentApi {
  time?: string;
  temperature_2m?: number;
  weather_code?: number;
}

export interface ApiDailyData {
  time?: string[];
  temperature_2m_min?: number[];
  temperature_2m_max?: number[];
  weather_code?: number[];
}

export interface ForecastApiResponse {
  latitude?: number;
  longitude?: number;
  timezone?: string;
  current?: ForecastCurrentApi;
  daily?: ApiDailyData;
}
