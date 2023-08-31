import get from '../get-from-eod';
import toUSD from '../translate-to-usd';
import { getInitialIndexDates, addMissingValues } from '../utils';

export default async function getIndexPrices(data: DataSharesOutstanding[], currenciesData: any[], startDate: string): Promise<DataPrices[]> {

  function timeout(ms: any) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

  try {
    const batchSize = 50;
    const requests = [];
    const result: ResponseHistorical[][] = [];

    for (let i = 0; i < data.length; i += batchSize) {
      await timeout(1000)
      const batch = data.slice(i, i + batchSize);
      const batchRequests = batch.map((stock) => get.historicalAsync(stock.symbol, startDate));
      requests.push(batchRequests);
    }

    for (const batchRequests of requests) {
      await timeout(1000)
      console.log('1')
      const batchResponses = await Promise.all(batchRequests);
      const errors = batchResponses.filter((response) => !response.ok);

      if (errors.length > 0) {
        throw errors.map((response) => Error(response.statusText));
      }

      const batchJson = batchResponses.map((response) => response.json());
      const batchResult = (await Promise.all(batchJson)) as ResponseHistorical[][];
      result.push(...batchResult);
    }

    const indexHistory = getInitialIndexDates(startDate) as any[];

    currenciesData.forEach((cur) => {
      const i = indexHistory.findIndex((day) => day.date === cur.date);
      indexHistory[i] = cur;
    });

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

    const completeData = addMissingValues(indexHistory);

    completeData.forEach((day: IndexDay, i: number) => {
      data.forEach((stock: DataSharesOutstanding) => {
        day[stock.symbol] = toUSD(day[stock.symbol], stock.currency, day.date, currenciesData);
      });
    });

    return completeData;
  } catch (error) {
    console.error(error);
  }
  return []
}
