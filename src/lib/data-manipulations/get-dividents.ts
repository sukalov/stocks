import { StockInfo } from '@/components/data-table';
import { currencies } from '../db/schema';
import get from '../get-from-eod';
import toUSD from '../translate-to-usd';

export default async function getDividents(
  data: StocksInfo[],
  currencies: CurrenciesPrice[],
  startDate: string
) {
  function timeout(ms: any) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  try {
    const batchSize = 50;
    const requests = [];
    const result: ResponseDividents[][] = [];

    for (let i = 0; i < data.length; i += batchSize) {
      await timeout(1600);
      const batch = data.slice(i, i + batchSize);
      const batchRequests = batch.map((stock) => get.dividentsAsync(stock.symbol, startDate));
      requests.push(batchRequests);
      console.log('1/6. requests', i, 'of', data.length);
    }

    let counter = 1
    for (const batchRequests of requests) {
      await timeout(500);
      const batchResponses = await Promise.all(batchRequests);
      const errors = batchResponses.filter((response) => !response.ok);

      if (errors.length > 0) {
        throw errors.map((response) => Error(response.statusText));
      }

      const batchJson = batchResponses.map((response) => response.json());
      const batchResult = (await Promise.all(batchJson)) as ResponseDividents[][];
      result.push(...batchResult);
      console.log('2/6. parse responses', counter, ' of ', requests.length);
      counter += 1
    }

    let newData: any[] = [];
    result.forEach((divs, i) => {
      if (divs.length) {
        const dividents = divs.map((el) => {
          return {
            symbol: data[i]?.symbol,
            date: el.date,
            value: toUSD(Number(el.value), data[i]!.currency, el.date, currencies),
          };
        });
        newData = [...newData, ...dividents];
      }
    });
    const newData2 = newData.reduce((acc, curr) => {
      acc[curr.date] = acc[curr.date] ?? {};
      acc[curr.date][curr.symbol] = curr.value;
      return acc;
    }, {});

    return newData2;
  } catch (error) {
    console.error(error);
  }
}
