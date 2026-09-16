import { useState } from 'react';
import { fetchForecast } from '../services/forecastService';
import { searchLocations } from '../services/geocodingService';
import type { AppError, City, Unit, WeatherData } from '../types/weather';
import { validateCityQuery } from '../utils/validation';

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
      return [];
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
        return results;
      }

      setState({
        kind: 'idle',
        query: validation.value,
      });
      return results;
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
      return [];
    }
  };

  const fetchForecastForCity = async (city: City) => {
    setState({
      kind: 'loading',
      operation: 'forecast',
      query: city.name,
      operationId: Date.now(),
      location: city,
    });

    try {
      const data = await fetchForecast(city);
      setState({ kind: 'success', data });
      return data;
    } catch (error) {
      const appError = error as Partial<AppError>;
      setState({
        kind: 'error',
        error: {
          code: appError.code ?? 'service-unavailable',
          message: appError.message ?? 'Não foi possível consultar o serviço.',
          retryable: appError.retryable ?? true,
        },
        retry: {
          kind: 'forecast',
          city,
        },
      });
      return null;
    }
  };

  return {
    state,
    unit,
    toggleUnit,
    searchLocations: searchLocationsForQuery,
    fetchForecast: fetchForecastForCity,
  };
}
