import { useState } from 'react';
import type { AppError, City, Unit, WeatherData } from '../types/weather';
import { validateCityQuery } from '../utils/validation';
import { fetchForecast } from '../services/forecastService';
import { searchLocations } from '../services/geocodingService';

export type WeatherAppState =
  | { kind: 'idle'; query: string }
  | {
      kind: 'loading';
      operation: 'search' | 'forecast';
      query: string;
      operationId: number;
      location?: City;
    }
  | { kind: 'success'; data: WeatherData }
  | { kind: 'empty'; query: string }
  | {
      kind: 'error';
      error: AppError;
      retry?: { kind: 'search'; query: string } | { kind: 'forecast'; city: City };
    };

export function useWeatherApp() {
  const [unit, setUnit] = useState<Unit>('celsius');
  const [state, setState] = useState<WeatherAppState>({ kind: 'idle', query: '' });

  const toggleUnit = () => {
    setUnit((current) => (current === 'celsius' ? 'fahrenheit' : 'celsius'));
  };

  const searchLocationsForQuery = async (query: string) => {
    const validation = validateCityQuery(query);

    if (!validation.ok) {
      setState({
        kind: 'error',
        error: {
          code: validation.code,
          message: validation.message,
          retryable: false,
        },
        retry: {
          kind: 'search',
          query,
        },
      });
      return;
    }

    setState({
      kind: 'loading',
      operation: 'search',
      query: validation.value,
      operationId: Date.now(),
    });

    try {
      const results = await searchLocations(validation.value);
      if (results.length === 0) {
        setState({ kind: 'empty', query: validation.value });
        return;
      }

      setState({
        kind: 'idle',
        query: validation.value,
      });
    } catch (error) {
      const appError = error as AppError;
      setState({
        kind: 'error',
        error: {
          code: appError.code ?? 'service-unavailable',
          message: appError.message ?? 'Não foi possível consultar o serviço.',
          retryable: appError.retryable ?? true,
        },
        retry: {
          kind: 'search',
          query: validation.value,
        },
      });
    }
  };

  return {
    state,
    unit,
    toggleUnit,
    searchLocations: searchLocationsForQuery,
  };
}
