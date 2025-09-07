import { parseCurrency } from '../../../src/scrapers/utils/parseCurrency';

describe('parseCurrency', () => {
  it('returns 0 for empty string', () => {
    expect(parseCurrency('')).toBe(0);
  });

  it('returns 0 for undefined input', () => {
    expect(parseCurrency(undefined as any)).toBe(0);
  });

  it('parses simple integer string', () => {
    expect(parseCurrency('123')).toBe(123);
  });

  it('parses US style decimal number', () => {
    expect(parseCurrency('123.45')).toBe(123.45);
  });

  it('parses US style number with commas', () => {
    expect(parseCurrency('1,234.56')).toBe(1234.56);
  });

  it('parses European style number with dot as thousand separator and comma as decimal', () => {
    expect(parseCurrency('1.234,56')).toBe(1234.56);
  });

  it('parses negative US style number', () => {
    expect(parseCurrency('-123.45')).toBe(-123.45);
  });

  it('parses negative European style number', () => {
    expect(parseCurrency('-1.234,56')).toBe(-1234.56);
  });

  it('parses number with currency symbol', () => {
    expect(parseCurrency('$1,234.56')).toBe(1234.56);
  });

  it('parses number with multiple dots and commas', () => {
    expect(parseCurrency('1.2.3,45')).toBe(123.45);
  });

  it('returns NaN for invalid string', () => {
    expect(parseCurrency('abc')).toBeNaN();
  });

  it('parses number with mixed separators but last comma after last dot', () => {
    expect(parseCurrency('1.234.567,89')).toBe(1234567.89);
  });

  it('parses number with mixed separators but last dot after last comma', () => {
    expect(parseCurrency('1,234,567.89')).toBe(1234567.89);
  });
});
