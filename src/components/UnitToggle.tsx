import { memo } from 'react';
import type { Unit } from '../types/weather';

interface UnitToggleProps {
  unit: Unit;
  onChange: (nextUnit: Unit) => void;
}

function UnitToggleComponent({ unit, onChange }: UnitToggleProps) {
  return (
    <fieldset className="mt-4 flex gap-2">
      <legend className="sr-only">Unidade de temperatura</legend>
      <button
        type="button"
        aria-pressed={unit === 'celsius'}
        onClick={() => onChange('celsius')}
        className="rounded border border-slate-700 px-3 py-2 text-white hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
      >
        Celsius
      </button>
      <button
        type="button"
        aria-pressed={unit === 'fahrenheit'}
        onClick={() => onChange('fahrenheit')}
        className="rounded border border-slate-700 px-3 py-2 text-white hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
      >
        Fahrenheit
      </button>
    </fieldset>
  );
}

export const UnitToggle = memo(UnitToggleComponent);
