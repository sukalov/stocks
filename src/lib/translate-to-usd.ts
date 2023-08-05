export default function toUSD(
  price: number,
  currencyName: 'TWD' | 'JPY' | 'USD' | 'KRW',
  date: string,
  currencies: any[]
) {
  if (currencyName === 'USD') return price;
  const index = currencies.findIndex((day) => date === day.date.toISOString().slice(0, 10));
  console.log(currencies)
  const neededExchange = currencies[index][currencyName];
  const priceUSD = price / neededExchange;
  return priceUSD;
}
