import { currencies } from '../db/schema';
import get from '../get-from-eod';
import toUSD from '../translate-to-usd';

export default async function getDividents(
  data: DataSharesOutstanding[],
  currencies: CurrenciesPrice[],
  startDate: string
) {
  try {
    const requests = data.map((stock) => get.dividentsAsync(stock.symbol, startDate));
    const responses = await Promise.all(requests);
    const errors = responses.filter((response: Response) => !response.ok);

    if (errors.length > 0) {
      throw errors.map((response: Response) => Error(response.statusText));
    }
    const json = responses.map((response: Response) => response.json());
    const result = (await Promise.all(json)) as Array<ResponseDividents[]>;

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
