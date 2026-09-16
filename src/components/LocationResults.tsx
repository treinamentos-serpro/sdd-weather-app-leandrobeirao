import { memo } from 'react';
import type { City } from '../types/weather';

interface LocationResultsProps {
  cities: City[];
  onSelect: (city: City) => void;
}

function LocationResultsComponent({ cities, onSelect }: LocationResultsProps) {
  return (
    <ul aria-label="Resultados da busca">
      {cities.map((city) => (
        <li key={city.id ?? `${city.name}-${city.latitude}-${city.longitude}`}>
          <button
            type="button"
            onClick={() => onSelect(city)}
            aria-label={[city.name, city.region, city.country].filter(Boolean).join(', ')}
            className="rounded px-2 py-1 text-left text-white hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            <span>{city.name}</span>
            {city.region && <span>{city.region}</span>}
            {city.country && <span>{city.country}</span>}
          </button>
        </li>
      ))}
    </ul>
  );
}

export const LocationResults = memo(LocationResultsComponent);
