import { describe, expect, it } from 'vitest';
import { celsiusToFahrenheit, displayTemperature, fahrenheitToCelsius } from '../../../src/utils/temperature';

describe('temperature helpers', () => {
  it('converts with the expected formulas', () => {
    expect(celsiusToFahrenheit(0)).toBe(32);
    expect(fahrenheitToCelsius(32)).toBe(0);
    expect(displayTemperature(21.6, 'fahrenheit')).toBe(71);
    expect(displayTemperature(-1.2, 'celsius')).toBe(-1);
  });
});
