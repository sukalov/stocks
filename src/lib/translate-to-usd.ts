export default function toUSD (price: number, currencyName: string, date: 'string', currencies: any[]) {
    const index = currencies.findIndex(day => date === day.date)
    const neededExchange = currencies[index][currencyName]
    const priceUSD = price / neededExchange
    return priceUSD
}