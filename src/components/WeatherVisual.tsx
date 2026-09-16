interface WeatherVisualProps {
  weatherCode?: number;
  decorative?: boolean;
  size?: 'large' | 'small';
}

interface WeatherIcon {
  symbol: string;
  label: string;
}

function getWeatherIcon(weatherCode?: number): WeatherIcon {
  if (weatherCode === 0) {
    return { symbol: '☀️', label: 'Céu limpo' };
  }

  if (weatherCode !== undefined && weatherCode >= 1 && weatherCode <= 3) {
    return { symbol: '⛅', label: 'Parcialmente nublado' };
  }

  if (weatherCode === 45 || weatherCode === 48) {
    return { symbol: '🌫️', label: 'Nevoeiro' };
  }

  if (weatherCode !== undefined && weatherCode >= 51 && weatherCode <= 57) {
    return { symbol: '🌦️', label: 'Garoa' };
  }

  if (weatherCode !== undefined && weatherCode >= 61 && weatherCode <= 67) {
    return { symbol: '🌧️', label: 'Chuva' };
  }

  if (weatherCode !== undefined && weatherCode >= 71 && weatherCode <= 77) {
    return { symbol: '❄️', label: 'Neve' };
  }

  if (weatherCode !== undefined && weatherCode >= 80 && weatherCode <= 82) {
    return { symbol: '🌧️', label: 'Pancadas de chuva' };
  }

  if (weatherCode === 85 || weatherCode === 86) {
    return { symbol: '🌨️', label: 'Pancadas de neve' };
  }

  if (weatherCode !== undefined && weatherCode >= 95 && weatherCode <= 99) {
    return { symbol: '⛈️', label: 'Tempestade' };
  }

  return { symbol: '🌡️', label: 'Condição indisponível' };
}

export default function WeatherVisual({
  weatherCode,
  decorative = true,
  size = 'small',
}: WeatherVisualProps) {
  const icon = getWeatherIcon(weatherCode);
  const className =
    size === 'large' ? 'text-7xl leading-none sm:text-8xl' : 'text-4xl leading-none';

  if (decorative) {
    return (
      <span aria-hidden="true" className={className}>
        {icon.symbol}
      </span>
    );
  }

  return (
    <div role="img" aria-label={icon.label} className={className}>
      {icon.symbol}
    </div>
  );
}
