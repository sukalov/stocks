export default function toUSD(
  price: number,
  country: 'Japan' | 'South Korea' | 'Taiwan',
  date: string,
  currencies: any[]
) {
  const currencyNames = {
    Japan: 'JPY',
    Taiwan: 'TWD',
    'South Korea': 'KRW',
  };
  const currencyName = currencyNames[country];
  const index = currencies.findIndex((day) => date === day.date);
  const neededExchange = currencies[index][currencyName];
  const priceUSD = price / neededExchange;
  return priceUSD;
}
