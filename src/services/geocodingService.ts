import type { GeocodingApiResponse } from '../types/api';
import type { City } from '../types/weather';
import { validateCityQuery } from '../utils/validation';
import { fetchJson } from './http';

export async function searchLocations(query: string, signal?: AbortSignal): Promise<City[]> {
  const validation = validateCityQuery(query);

  if (!validation.ok) {
    return [];
  }

  const url = new URL('https://geocoding-api.open-meteo.com/v1/search');
  url.searchParams.set('name', validation.value);
  url.searchParams.set('count', '10');
  url.searchParams.set('language', 'pt');
  url.searchParams.set('format', 'json');

  const payload = await fetchJson<GeocodingApiResponse>(url.toString(), {
    signal,
    timeoutMs: 8000,
  });

  if (!payload.results || !Array.isArray(payload.results)) {
    return [];
  }

  return payload.results
    .filter(
      (item) =>
        item?.name &&
        typeof item.latitude === 'number' &&
        typeof item.longitude === 'number' &&
        item.timezone,
    )
    .map((item) => ({
      id: item.id,
      name: item.name,
      latitude: item.latitude,
      longitude: item.longitude,
      timezone: item.timezone,
      region: item.admin1,
      country: item.country,
    }));
}
