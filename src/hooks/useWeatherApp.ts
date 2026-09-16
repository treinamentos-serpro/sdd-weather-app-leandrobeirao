import { useEffect, useRef, useState } from 'react';
import { fetchForecast } from '../services/forecastService';
import { searchLocations } from '../services/geocodingService';
import { createRequestId } from '../services/telemetry';
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
  const operationRef = useRef(0);
  const controllerRef = useRef<AbortController | null>(null);
  const correlationIdRef = useRef(createRequestId());

  const beginOperation = () => {
    controllerRef.current?.abort();
    const operationId = operationRef.current + 1;
    operationRef.current = operationId;
    const controller = new AbortController();
    controllerRef.current = controller;
    return { operationId, controller };
  };

  const isCurrentOperation = (operationId: number) => operationRef.current === operationId;

  const toggleUnit = () => {
    setUnit((current) => (current === 'celsius' ? 'fahrenheit' : 'celsius'));
  };

  const searchLocationsForQuery = async (query: string) => {
    const validation = validateCityQuery(query);

    if (!validation.ok) {
      beginOperation();
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

    const { operationId, controller } = beginOperation();
    correlationIdRef.current = createRequestId();
    setState({
      kind: 'loading',
      operation: 'search',
      query: validation.value,
      operationId,
    });

    try {
      const results = await searchLocations(
        validation.value,
        controller.signal,
        correlationIdRef.current,
      );
      if (!isCurrentOperation(operationId)) {
        return [];
      }
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
      if (!isCurrentOperation(operationId) || controller.signal.aborted) {
        return [];
      }
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
    const { operationId, controller } = beginOperation();
    setState({
      kind: 'loading',
      operation: 'forecast',
      query: city.name,
      operationId,
      location: city,
    });

    try {
      const data = await fetchForecast(city, controller.signal, correlationIdRef.current);
      if (!isCurrentOperation(operationId)) {
        return null;
      }
      setState({ kind: 'success', data });
      return data;
    } catch (error) {
      if (!isCurrentOperation(operationId) || controller.signal.aborted) {
        return null;
      }
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

  useEffect(() => () => controllerRef.current?.abort(), []);

  return {
    state,
    unit,
    toggleUnit,
    searchLocations: searchLocationsForQuery,
    fetchForecast: fetchForecastForCity,
  };
}
