import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LocationResults } from './components/LocationResults';
import { SearchForm } from './components/SearchForm';
import { StatusMessage } from './components/StatusMessage';
import { UnitToggle } from './components/UnitToggle';
import { WeatherPanel } from './components/WeatherPanel';
import { useWeatherApp } from './hooks/useWeatherApp';
import type { City, WeatherData } from './types/weather';

export default function App() {
  const {
    unit,
    toggleUnit,
    state,
    searchLocations: submitSearch,
    fetchForecast: submitForecast,
  } = useWeatherApp();
  const [query, setQuery] = useState('');
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const weatherRef = useRef<HTMLDivElement>(null);

  const weatherData: WeatherData | null = state.kind === 'success' ? state.data : null;
  const isLoadingSearch = state.kind === 'loading' && state.operation === 'search';
  const isLoadingForecast = state.kind === 'loading' && state.operation === 'forecast';
  const isLoading = isLoadingSearch || isLoadingForecast;

  const handleSubmit = useCallback(
    async (value: string) => {
      const nextValue = value.trim();
      setQuery(nextValue);

      if (!nextValue) {
        setCities([]);
        setSelectedCity(null);
        return;
      }

      const results = await submitSearch(nextValue);
      setCities(results);
      setSelectedCity(null);
      if (results.length > 0) {
        setQuery(nextValue);
      }
    },
    [submitSearch],
  );

  const handleSelectCity = useCallback(
    (city: City) => {
      setSelectedCity(city);
      void submitForecast(city);
    },
    [submitForecast],
  );

  // Move o foco para os resultados assim que a busca retorna cidades.
  useEffect(() => {
    if (cities.length > 0 && !selectedCity && !weatherData) {
      resultsRef.current?.focus();
    }
  }, [cities, selectedCity, weatherData]);

  // Move o foco para a previsão assim que ela é carregada.
  useEffect(() => {
    if (weatherData) {
      weatherRef.current?.focus();
    }
  }, [weatherData]);

  const statusMessage = useMemo(() => {
    if (state.kind === 'loading' && state.operation === 'search') {
      return { kind: 'loading' as const, message: 'Carregando...' };
    }

    if (state.kind === 'empty') {
      return { kind: 'empty' as const, message: 'Nenhuma cidade encontrada' };
    }

    if (state.kind === 'error') {
      return {
        kind: 'error' as const,
        message: state.error.message,
        retryable: state.error.retryable,
      };
    }

    return null;
  }, [state]);

  const handleRetry = useCallback(() => {
    if (state.kind === 'error' && state.retry?.kind === 'search') {
      void handleSubmit(state.retry.query);
    }
    if (state.kind === 'error' && state.retry?.kind === 'forecast') {
      setSelectedCity(state.retry.city);
      void submitForecast(state.retry.city);
    }
  }, [state, handleSubmit, submitForecast]);

  return (
    <main className="min-h-screen bg-slate-950 p-4 text-white" aria-busy={isLoading}>
      <div className="mx-auto max-w-4xl">
        <SearchForm
          value={query}
          onChange={setQuery}
          onSubmit={handleSubmit}
          disabled={isLoading}
        />

        <UnitToggle unit={unit} onChange={toggleUnit} />

        {statusMessage && (
          <StatusMessage
            kind={statusMessage.kind}
            message={statusMessage.message}
            retryable={statusMessage.retryable}
            onRetry={handleRetry}
          />
        )}

        {cities.length > 0 && !selectedCity && !weatherData && (
          <div role="status" className="sr-only">
            {cities.length === 1 ? 'Uma cidade encontrada' : `${cities.length} cidades encontradas`}
          </div>
        )}

        {cities.length > 0 && !selectedCity && !weatherData && (
          <div ref={resultsRef} tabIndex={-1} className="outline-none">
            <LocationResults cities={cities} onSelect={handleSelectCity} />
          </div>
        )}

        {isLoadingForecast && <StatusMessage kind="loading" message="Carregando clima..." />}

        {weatherData && (
          <div ref={weatherRef} tabIndex={-1} className="outline-none">
            <WeatherPanel data={{ ...weatherData, unit }} unit={unit} />
          </div>
        )}
      </div>
    </main>
  );
}
