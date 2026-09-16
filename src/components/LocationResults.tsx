import { memo } from 'react';
import type { City } from '../types/weather';

interface LocationResultsProps {
  cities: City[];
  onSelect: (city: City) => void;
}

function LocationResultsComponent({ cities, onSelect }: LocationResultsProps) {
  return (
    <section aria-label="Resultados da busca" className="overflow-hidden rounded-lg border border-white/10 bg-white/5 shadow-glass backdrop-blur-md">
      <div className="border-b border-white/10 px-4 py-3">
        <h2 className="font-semibold text-white">Escolha uma localidade</h2>
      </div>
    <ul aria-label="Resultados da busca" className="divide-y divide-white/10">
      {cities.map((city) => (
        <li key={city.id ?? `${city.name}-${city.latitude}-${city.longitude}`} className="p-1">
          <button
            type="button"
            onClick={() => onSelect(city)}
            aria-label={[city.name, city.region, city.country].filter(Boolean).join(', ')}
            className="w-full rounded-lg px-3 py-3 text-left text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-night-900"
          >
            <span className="block font-medium">{city.name}</span>
            {(city.region || city.country) && (
              <span className="mt-1 block text-sm text-white/60">
                {[city.region, city.country].filter(Boolean).join(', ')}
              </span>
            )}
          </button>
        </li>
      ))}
    </ul>
    </section>
  );
}

export const LocationResults = memo(LocationResultsComponent);
