export const currencyAdder = (currency: string) => (price?: number | string) =>
  price ? `${currency} ${price}` : `Free`;
