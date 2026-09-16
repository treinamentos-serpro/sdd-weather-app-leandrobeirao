import type { City } from '../types/weather';

interface LocationResultsProps {
  cities: City[];
  onSelect: (city: City) => void;
}

export function LocationResults({ cities, onSelect }: LocationResultsProps) {
  return (
    <ul aria-label="Resultados da busca" role="list">
      {cities.map((city) => (
        <li key={city.id ?? `${city.name}-${city.latitude}-${city.longitude}`}>
          <button type="button" onClick={() => onSelect(city)} aria-label={city.name}>
            <span>{city.name}</span>
            {city.region && <span>{city.region}</span>}
            {city.country && <span>{city.country}</span>}
          </button>
        </li>
      ))}
    </ul>
  );
}
