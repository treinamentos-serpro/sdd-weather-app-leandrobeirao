import type { Unit } from '../types/weather';

export function celsiusToFahrenheit(celsius: number): number {
  return (celsius * 9) / 5 + 32;
}

export function fahrenheitToCelsius(fahrenheit: number): number {
  return ((fahrenheit - 32) * 5) / 9;
}

export function displayTemperature(celsius: number, unit: Unit): number {
  const value = unit === 'fahrenheit' ? celsiusToFahrenheit(celsius) : celsius;
  return Math.round(value);
}
