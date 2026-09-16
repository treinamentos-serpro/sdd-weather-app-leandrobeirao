import type { GeocodingApiResponse } from '../types/api';
import type { City } from '../types/weather';
import { validateCityQuery } from '../utils/validation';
import { fetchJson } from './http';
import { createRequestId, recordTelemetry } from './telemetry';

const invalidResponseError = {
  code: 'invalid-response',
  message: 'Não foi possível consultar o serviço.',
  retryable: true,
} as const;

function throwInvalidResponse(requestId: string): never {
  recordTelemetry({
    category: 'invalid-response',
    operation: 'geocoding',
    timestamp: new Date().toISOString(),
    requestId,
  });
  throw invalidResponseError;
}

export async function searchLocations(
  query: string,
  signal?: AbortSignal,
  requestId = createRequestId(),
): Promise<City[]> {
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
    operation: 'geocoding',
    requestId,
  });

  if (!payload || typeof payload !== 'object' || !Array.isArray(payload.results)) {
    throwInvalidResponse(requestId);
  }

  const results = payload.results;
  if (results.some((item) => !isValidGeocodingResult(item))) {
    throwInvalidResponse(requestId);
  }

  return results.map((item) => {
    const result = item as Record<string, unknown>;
    return {
      id: typeof result.id === 'number' ? result.id : undefined,
      name: result.name as string,
      latitude: result.latitude as number,
      longitude: result.longitude as number,
      timezone: result.timezone as string,
      region: typeof result.admin1 === 'string' ? result.admin1 : undefined,
      country: typeof result.country === 'string' ? result.country : undefined,
    };
  });
}

function isValidGeocodingResult(value: unknown): value is Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }

  const result = value as Record<string, unknown>;
  return (
    typeof result.name === 'string' &&
    result.name.length > 0 &&
    typeof result.timezone === 'string' &&
    result.timezone.length > 0 &&
    typeof result.latitude === 'number' &&
    Number.isFinite(result.latitude) &&
    result.latitude >= -90 &&
    result.latitude <= 90 &&
    typeof result.longitude === 'number' &&
    Number.isFinite(result.longitude) &&
    result.longitude >= -180 &&
    result.longitude <= 180 &&
    isValidTimeZone(result.timezone) &&
    (result.id === undefined || (typeof result.id === 'number' && Number.isFinite(result.id))) &&
    (result.admin1 === undefined || typeof result.admin1 === 'string') &&
    (result.country === undefined || typeof result.country === 'string')
  );
}

function isValidTimeZone(value: unknown): value is string {
  if (typeof value !== 'string' || value.length === 0) {
    return false;
  }

  try {
    new Intl.DateTimeFormat('en-US', { timeZone: value }).format();
    return true;
  } catch {
    return false;
  }
}
