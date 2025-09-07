export function parseCurrency(currencyString: string): number {
  if (!currencyString) {
    return 0;
  }

  const cleaned = currencyString.replace(/[^\d.,-]/g, '');

  const lastDot = cleaned.lastIndexOf('.');
  const lastComma = cleaned.lastIndexOf(',');

  let numberString;

  if (lastComma > lastDot) {
    numberString = cleaned.replace(/\./g, '').replace(',', '.');
  } else {
    numberString = cleaned.replace(/,/g, '');
  }

  return parseFloat(numberString);
}
