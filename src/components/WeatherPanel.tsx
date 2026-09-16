import type { WeatherData } from '../types/weather';
import { displayTemperature } from '../utils/temperature';

interface WeatherPanelProps {
  data: WeatherData;
  unit: 'celsius' | 'fahrenheit';
}

export function WeatherPanel({ data, unit }: WeatherPanelProps) {
  return (
    <section aria-label="Clima atual e previsão">
      <div>
        <h2>{data.city.name}</h2>
        <p>{data.current.condition}</p>
        <p>{`${displayTemperature(data.current.temperatureCelsius, unit)}°${unit === 'celsius' ? 'C' : 'F'}`}</p>
      </div>

      <ul role="list">
        {data.forecast.map((day) => (
          <li key={day.date}>
            <p>{day.date}</p>
            <p>{day.condition ?? 'Condição indisponível'}</p>
            <p>
              {day.minimumCelsius !== undefined ? `${displayTemperature(day.minimumCelsius, unit)}°${unit === 'celsius' ? 'C' : 'F'}` : 'N/D'}
            </p>
            <p>
              {day.maximumCelsius !== undefined ? `${displayTemperature(day.maximumCelsius, unit)}°${unit === 'celsius' ? 'C' : 'F'}` : 'N/D'}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
