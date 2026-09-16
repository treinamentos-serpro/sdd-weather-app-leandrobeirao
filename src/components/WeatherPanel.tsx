import { memo, useMemo } from 'react';
import type { WeatherData } from '../types/weather';
import { displayTemperature } from '../utils/temperature';

interface WeatherPanelProps {
  data: WeatherData;
  unit: 'celsius' | 'fahrenheit';
}

function WeatherPanelComponent({ data, unit }: WeatherPanelProps) {
  const currentTemperature = useMemo(
    () =>
      `${displayTemperature(data.current.temperatureCelsius, unit)}°${unit === 'celsius' ? 'C' : 'F'}`,
    [data.current.temperatureCelsius, unit],
  );

  return (
    <section aria-label="Clima atual e previsão">
      <div>
        <h2>{data.city.name}</h2>
        <p>{data.current.condition}</p>
        <p>{currentTemperature}</p>
      </div>

      <ul>
        {data.forecast.map((day) => (
          <li key={day.date}>
            <p>{day.date}</p>
            <p>{day.condition ?? 'Condição indisponível'}</p>
            <p>
              {day.minimumCelsius !== undefined
                ? `${displayTemperature(day.minimumCelsius, unit)}°${unit === 'celsius' ? 'C' : 'F'}`
                : 'N/D'}
            </p>
            <p>
              {day.maximumCelsius !== undefined
                ? `${displayTemperature(day.maximumCelsius, unit)}°${unit === 'celsius' ? 'C' : 'F'}`
                : 'N/D'}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export const WeatherPanel = memo(WeatherPanelComponent);
