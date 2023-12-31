import { eq } from 'drizzle-orm';
import { db } from '../db';
import { indexprices } from '../db/schema';
import get from '../get-from-eod';
import { csv } from '../read-write-csv';
import toUSD from '../translate-to-usd';
import { getInitialIndexDates, addMissingValues } from '../utils';
import { timeout } from '../utils';

export default async function getIndexPrices(
  data: StocksInfo[],
  currenciesData: any[],
  startDate: string
): Promise<DataPrices[]> {
  let resData: any = [];

  try {
    const batchSize = 50;
    const requests = [];
    const result: ResponseHistorical[][] = [];

    for (let i = 0; i < data.length; i += batchSize) {
      await timeout(1900);
      const batch = data.slice(i, i + batchSize);
      const batchRequests = batch.map((stock) => get.historicalAsync(stock.symbol, startDate));
      requests.push(batchRequests);
      console.log('1/6. requests', i, 'of', data.length / 50);
    }

    let counter = 1;
    for (const batchRequests of requests) {
      await timeout(800);
      const batchResponses = await Promise.all(batchRequests);
      const errors = batchResponses.filter((response) => !response.ok);

      if (errors.length > 0) {
        throw errors.map((response) => Error(response.statusText));
      }

      const batchJson = batchResponses.map((response) => response.json());
      const batchResult = (await Promise.all(batchJson)) as ResponseHistorical[][];
      result.push(...batchResult);
      console.log('2/6. parse responses', counter, ' of ', requests.length);
      counter += 1;
    }

    const indexHistory = getInitialIndexDates(startDate) as any[];

    currenciesData.forEach((cur) => {
      const i = indexHistory.findIndex((day) => day.date === cur.date);
      indexHistory[i] = cur;
    });

    console.log('3/6');

    await csv.writeJSON('indexPricesInitial', result);
    // const result = await csv.readJSON('indexPricesInitial')
    // await db.delete(indexprices).where(eq(indexprices.type, 'result'))
    // await timeout(2000)
    // await db.insert(indexprices).values({type: 'result', json: result})
    // await timeout(2000)

    // resData = result
    // return result

    result.forEach((stockHistory: ResponseHistorical[], i: number) => {
      stockHistory.forEach((day) => {
        const destinationIndex = indexHistory.findIndex((row) => row.date === day.date);
        indexHistory[destinationIndex] = {
          ...indexHistory[destinationIndex],
          date: indexHistory[destinationIndex]!.date,
          [String(data[i]?.symbol)]: day.adjusted_close,
        };
      });
    });
    console.log('4/6');

    const completeData = addMissingValues(indexHistory);
    // const completeData = indexHistory;

    console.log('5/6');

    // return {completeData, data, currenciesData}

    completeData.forEach((day: IndexDay, i: number) => {
      data.forEach((stock: StocksInfo) => {
        day[stock.symbol] = toUSD(day[stock.symbol], stock.currency, day.date, currenciesData);
      });
    });

    console.log('completed!');

    resData = completeData;
    return completeData;
  } catch (error) {
    console.error(error);
  }
  return resData;
}
