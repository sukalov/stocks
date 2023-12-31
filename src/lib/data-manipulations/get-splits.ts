import { currencies } from '../db/schema';
import get from '../get-from-eod';
import { timeout } from '../utils';

export default async function getSplits(data: StocksInfo[], startDate: string) {
  try {
    const batchSize = 50;
    const requests = [];
    const result: ResponseDividents[][] = [];

    for (let i = 0; i < data.length; i += batchSize) {
      await timeout(1900);
      const batch = data.slice(i, i + batchSize);
      const batchRequests = batch.map((stock) => get.splitsAsync(stock.symbol, startDate));
      requests.push(batchRequests);
      console.log('first loop.', i, 'of', data.length);
    }

    let counter = 1;
    for (const batchRequests of requests) {
      await timeout(1000);
      const batchResponses = await Promise.all(batchRequests);
      const errors = batchResponses.filter((response) => !response.ok);

      if (errors.length > 0) {
        throw errors.map((response) => Error(response.statusText));
      }

      const batchJson = batchResponses.map((response) => response.json());
      const batchResult = (await Promise.all(batchJson)) as ResponseDividents[][];
      result.push(...batchResult);
      console.log('second loop', counter, ' of ', requests.length);
      counter += 1;
    }

    let newData: any[] = [];
    result.forEach((splits, i) => {
      if (splits.length) {
        const stockSplits = {
          symbol: data[i]?.symbol,
          splits,
        };
        newData.push(stockSplits);
      }
    });

    return newData;
  } catch (error) {
    console.error(error);
  }
}
