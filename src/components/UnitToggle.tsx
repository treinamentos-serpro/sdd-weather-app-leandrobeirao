import type { Unit } from '../types/weather';

interface UnitToggleProps {
  unit: Unit;
  onChange: (nextUnit: Unit) => void;
}

export function UnitToggle({ unit, onChange }: UnitToggleProps) {
  return (
    <div>
      <button type="button" aria-label="Celsius" aria-pressed={unit === 'celsius'} onClick={() => onChange('celsius')}>
        Celsius
      </button>
      <button type="button" aria-label="Fahrenheit" aria-pressed={unit === 'fahrenheit'} onClick={() => onChange('fahrenheit')}>
        Fahrenheit
      </button>
    </div>
  );
}
