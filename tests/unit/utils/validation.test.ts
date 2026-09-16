import { describe, expect, it } from 'vitest';
import { validateCityQuery } from '../../../src/utils/validation';

describe('validateCityQuery', () => {
  it('rejects empty or whitespace input', () => {
    expect(validateCityQuery('')).toMatchObject({ ok: false, code: 'invalid-input' });
    expect(validateCityQuery('   ')).toMatchObject({ ok: false, code: 'invalid-input' });
  });

  it('rejects long inputs', () => {
    expect(validateCityQuery('a'.repeat(101))).toMatchObject({ ok: false, code: 'too-long' });
  });

  it('keeps valid accents, dashes and apostrophes', () => {
    expect(validateCityQuery(' São-Paulo ’s ')).toMatchObject({ ok: true, value: 'São-Paulo ’s' });
  });
});
