import { memo } from 'react';
import type { Unit } from '../types/weather';

interface UnitToggleProps {
  unit: Unit;
  onChange: (nextUnit: Unit) => void;
}

function UnitToggleComponent({ unit, onChange }: UnitToggleProps) {
  return (
    <fieldset className="flex w-full gap-1 rounded-lg border border-white/10 bg-white/5 p-1 shadow-glass backdrop-blur-md sm:w-fit">
      <legend className="sr-only">Unidade de temperatura</legend>
      <button
        type="button"
        aria-pressed={unit === 'celsius'}
        onClick={() => onChange('celsius')}
        className={`flex-1 rounded-md px-4 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-night-900 sm:flex-none ${unit === 'celsius' ? 'bg-accent-600 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
      >
        Celsius
      </button>
      <button
        type="button"
        aria-pressed={unit === 'fahrenheit'}
        onClick={() => onChange('fahrenheit')}
        className={`flex-1 rounded-md px-4 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-night-900 sm:flex-none ${unit === 'fahrenheit' ? 'bg-accent-600 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
      >
        Fahrenheit
      </button>
    </fieldset>
  );
}

export const UnitToggle = memo(UnitToggleComponent);
