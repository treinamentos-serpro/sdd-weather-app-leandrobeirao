import { describe, expect, it } from 'vitest';
import { describeWeatherCode } from '../../../src/utils/weatherCodes';

describe('describeWeatherCode', () => {
  it('returns the description for known codes', () => {
    expect(describeWeatherCode(0)).toBe('Céu limpo');
    expect(describeWeatherCode(61)).toBe('Chuva leve');
  });

  it('returns unknown fallback for unknown values', () => {
    expect(describeWeatherCode(999)).toBe('Condição indisponível');
  });
});
