const weatherCodeMap: Record<number, string> = {
  0: 'Céu limpo',
  1: 'Parcialmente nublado',
  2: 'Parcialmente nublado',
  3: 'Nublado',
  45: 'Nevoeiro',
  48: 'Nevoeiro',
  51: 'Garoa',
  53: 'Garoa',
  55: 'Garoa',
  56: 'Garoa',
  57: 'Garoa',
  61: 'Chuva leve',
  63: 'Chuva',
  65: 'Chuva forte',
  66: 'Chuva gelada',
  67: 'Chuva gelada',
  71: 'Neve leve',
  73: 'Neve',
  75: 'Neve forte',
  77: 'Neve',
  80: 'Pancadas de chuva',
  81: 'Pancadas de chuva',
  82: 'Pancadas de chuva',
  85: 'Pancadas de neve',
  86: 'Pancadas de neve',
  95: 'Tempestade',
  96: 'Tempestade',
  99: 'Tempestade',
};

export function describeWeatherCode(code: number): string {
  return weatherCodeMap[code] ?? 'Condição indisponível';
}
