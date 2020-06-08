export const nameSort = (a, b) => {
  const prodA = a.title.toUpperCase();
  const prodB = b.title.toUpperCase();
  if (prodA > prodB) return 1;
  if (prodA < prodB) return -1;
  return 0;
}

export const numberFormat = (amount, currencyCode='NZD') => {
  let amt = parseFloat(amount);
  let locale = 'en-NZ';
  if (currencyCode == 'NZD') locale = 'en-NZ';
  return (
    new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currencyCode
    }).format(amt)
  )
}

export const dateToISOString = (date) => {
  date.setTime(date.getTime() + (12 * 60 * 60 * 1000));
  return date.toISOString().slice(0, 10); // try this out later
}

