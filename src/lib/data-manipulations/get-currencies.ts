import { db } from '../db';
import get from '@/lib/get-from-eod';
import { addMissingValues, getInitialIndexDates } from '../utils';
import { currencies } from '../db/schema';

export default async function getCurrenencyPrices(
  startDate: string = '2022-12-29',
  currenciesToCollect: Array<string> = ['KRW', 'JPY', 'TWD']
) {
  try {
    const requests = currenciesToCollect.map((stock) => get.historicalAsync(`${stock}.FOREX`, startDate));
    const responses = await Promise.all(requests);
    const errors = responses.filter((response: { ok: boolean }) => !response.ok);

    if (errors.length > 0) {
      throw errors.map((response: { statusText: string | undefined }) => Error(response.statusText));
    }
    const json = responses.map((response: { json: () => any }) => response.json());
    const result = (await Promise.all(json)) as Array<ResponseHistorical[]>;

    const newData: any[] = [];

    result.forEach((data, i) => {
      data.forEach((day) => {
        const currencyName = currenciesToCollect[i] ?? '';
        if (i === 0) {
          newData.push({
            date: day.date,
            [currencyName]: Number(day.adjusted_close.toFixed(2)),
          });
        } else {
          const destinationIndex = newData.findIndex((NDday) => NDday.date === day.date);
          newData[destinationIndex] = {
            ...newData[destinationIndex],
            [currencyName]: Number(day.adjusted_close.toFixed(2)),
          };
        }
      });
    });

    const indexHistory = getInitialIndexDates(startDate) as CurrenciesPrice[];
    newData.forEach((cur) => {
      const i = indexHistory.findIndex((day) => day.date === cur.date);
      indexHistory[i] = cur;
    });

    const newData2 = addMissingValues(indexHistory) as any[];

    
    await db.delete(currencies)
    await db.insert(currencies).values(newData2)

    return newData2;
  } catch (error) {
    console.error(error);
  }
}
