import { describe, expect, it } from 'vitest';
import { formatForecastDate } from '../../../src/utils/date';

describe('formatForecastDate', () => {
  it('formats a valid forecast date with its weekday in pt-BR', () => {
    expect(formatForecastDate('2026-09-16')).toBe('quarta-feira, 16/09/2026');
  });

  it('identifies unavailable or invalid dates', () => {
    expect(formatForecastDate('missing-0')).toBe('Data indisponível');
    expect(formatForecastDate('2026-02-29')).toBe('Data indisponível');
  });
});
