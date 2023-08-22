import get from '../get-from-eod';
import toUSD from '../translate-to-usd';
import { getInitialIndexDates, addMissingValues } from '../utils';

export default async function getIndexPrices(data: DataSharesOutstanding[], currenciesData: any[], startDate: string) {
  try {
    const requests = data.map((stock) => get.historicalAsync(stock.symbol, startDate));
    const responses = await Promise.all(requests);
    const errors = responses.filter((response: Response) => !response.ok);

    if (errors.length > 0) {
      throw errors.map((response: Response) => Error(response.statusText));
    }
    const json = responses.map((response: Response) => response.json());
    const result = (await Promise.all(json)) as Array<ResponseHistorical[]>;

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
}
