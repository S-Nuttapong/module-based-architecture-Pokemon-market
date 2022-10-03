export const currencyAdder = (currency: string) => (price?: number | string, fallback = '') =>
  price ? `${currency} ${price}` : fallback;
