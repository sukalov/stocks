import getDividents from '@/lib/data-manipulations/get-dividents';
import { db } from '@/lib/db';
import { currencies, dividents, stocks_info } from '@/lib/db/schema';

export async function GET(req: Request) {
  // const dataSharesOutstanding = (await db.select().from(stocks_info)) as StocksInfo[];
  // const dataCurrencies = (await db.select().from(currencies)) as CurrenciesPrice[];
  // const dataDividents = await getDividents(dataSharesOutstanding, dataCurrencies, '2022-12-29');

  // const divs: DividentsDB[] = [];
  // Object.keys(dataDividents).forEach((dateStr) => {
    // const date = new Date(dateStr);
    // const divDay = { date, dividents: dataDividents[dateStr] };
    // divs.push(divDay);
  // });

  // await db.delete(dividents);
  // await db.insert(dividents).values(divs);

  return new Response('endpoint unavailible ', {
    status: 200,
    headers: {
      'Content-Type': 'text/json',
    },
  });
}
