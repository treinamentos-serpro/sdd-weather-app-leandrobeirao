import { useMemo, useState } from 'react';
import { SearchForm } from './components/SearchForm';
import { StatusMessage } from './components/StatusMessage';
import { LocationResults } from './components/LocationResults';
import { WeatherPanel } from './components/WeatherPanel';
import { UnitToggle } from './components/UnitToggle';
import { useWeatherApp } from './hooks/useWeatherApp';
import { fetchForecast } from './services/forecastService';
import { searchLocations } from './services/geocodingService';
import type { City, WeatherData } from './types/weather';

export default function App() {
  const { unit, toggleUnit, state, searchLocations: submitSearch } = useWeatherApp();
  const [query, setQuery] = useState('');
  const [cities, setCities] = useState<City[]>([]);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [isLoadingForecast, setIsLoadingForecast] = useState(false);

  const handleSubmit = async (value: string) => {
    const nextValue = value.trim();
    setQuery(nextValue);

    if (!nextValue) {
      setCities([]);
      setWeatherData(null);
      setSelectedCity(null);
      return;
    }

    const results = await searchLocations(nextValue);
    setCities(results);
    setSelectedCity(null);
    setWeatherData(null);
    if (results.length > 0) {
      setQuery(nextValue);
    }
  };

  const handleSelectCity = async (city: City) => {
    setSelectedCity(city);
    setIsLoadingForecast(true);
    setWeatherData(null);

    try {
      const data = await fetchForecast(city);
      setWeatherData(data);
    } finally {
      setIsLoadingForecast(false);
    }
  };

  const statusMessage = useMemo(() => {
    if (state.kind === 'loading' && state.operation === 'search') {
      return { kind: 'loading' as const, message: 'Carregando...' };
    }

    if (state.kind === 'empty') {
      return { kind: 'empty' as const, message: 'Nenhuma cidade encontrada' };
    }

    if (state.kind === 'error') {
      return { kind: 'error' as const, message: state.error.message, retryable: state.error.retryable };
    }

    return null;
  }, [state]);

  return (
    <main className="min-h-screen bg-slate-950 p-4 text-white">
      <div className="mx-auto max-w-4xl">
        <SearchForm
          value={query}
          onChange={setQuery}
          onSubmit={handleSubmit}
          disabled={isLoadingForecast}
        />

        <UnitToggle unit={unit} onChange={toggleUnit} />

        {statusMessage && (
          <StatusMessage
            kind={statusMessage.kind}
            message={statusMessage.message}
            retryable={statusMessage.retryable}
            onRetry={() => {
              if (state.kind === 'error' && state.retry?.kind === 'search') {
                void submitSearch(state.retry.query);
              }
            }}
          />
        )}

        {cities.length > 0 && !selectedCity && !weatherData && (
          <LocationResults cities={cities} onSelect={handleSelectCity} />
        )}

        {isLoadingForecast && (
          <StatusMessage kind="loading" message="Carregando clima..." />
        )}

        {weatherData && (
          <WeatherPanel data={{ ...weatherData, unit }} unit={unit} />
        )}
      </div>
    </main>
  );
}
