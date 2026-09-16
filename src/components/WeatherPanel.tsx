import { memo, useMemo } from 'react';
import type { WeatherData } from '../types/weather';
import { displayTemperature } from '../utils/temperature';
import WeatherVisual from './WeatherVisual';

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
    <section aria-label="Clima atual e previsão" className="mt-6 space-y-5">
      <div className="overflow-hidden rounded-lg border border-white/10 bg-white/5 shadow-glass backdrop-blur-md">
        <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <div className="min-w-0 space-y-2">
            <p className="text-sm font-medium text-white/60">Condições atuais</p>
            <h2 className="truncate text-2xl font-semibold text-white sm:text-3xl">
              {data.city.name}
            </h2>
            <p className="text-base text-white/75">{data.current.condition}</p>
            <p className="text-6xl font-bold leading-none text-sun sm:text-7xl">
              {currentTemperature}
            </p>
          </div>
          <div className="flex h-32 w-32 shrink-0 items-center justify-center self-center rounded-lg border border-white/10 bg-night-800/70 sm:h-40 sm:w-40">
            <WeatherVisual weatherCode={data.current.weatherCode} size="large" />
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 pt-5">
        <div className="mb-3 flex items-baseline justify-between gap-4">
          <h3 className="text-lg font-semibold text-white">Próximos dias</h3>
          <span className="text-sm text-white/60">Previsão de 5 dias</span>
        </div>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {data.forecast.map((day) => (
            <li
              key={day.date}
              className="flex min-h-60 flex-col justify-between rounded-lg border border-white/10 bg-white/5 p-4 shadow-glass backdrop-blur-md"
            >
              <div className="space-y-3">
                <p className="text-sm font-medium text-white/70">{day.date}</p>
                <WeatherVisual weatherCode={day.weatherCode} />
                <p className="min-h-12 text-sm leading-5 text-white/80">
                  {day.condition ?? 'Condição indisponível'}
                </p>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 border-t border-white/10 pt-3 text-sm">
                <div>
                  <p className="text-xs text-white/55">Mín.</p>
                  <p className="font-semibold text-white">
                    {day.minimumCelsius !== undefined
                      ? `${displayTemperature(day.minimumCelsius, unit)}°${unit === 'celsius' ? 'C' : 'F'}`
                      : 'N/D'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-white/55">Máx.</p>
                  <p className="font-semibold text-sun">
                    {day.maximumCelsius !== undefined
                      ? `${displayTemperature(day.maximumCelsius, unit)}°${unit === 'celsius' ? 'C' : 'F'}`
                      : 'N/D'}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export const WeatherPanel = memo(WeatherPanelComponent);
