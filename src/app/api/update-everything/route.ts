import getDividents from '@/lib/data-manipulations/get-dividents';
import getIndexHistory from '@/lib/data-manipulations/get-index-history';
import getIndexPrices from '@/lib/data-manipulations/get-index-prices';
import { initialSteps } from '@/lib/data-manipulations/update-currencies-data';
import { db } from '@/lib/db';
import { stocks_info, currencies, adjustments, indicies, dividents } from '@/lib/db/schema';
import { sql, eq } from 'drizzle-orm';
import { indexNames } from '@/lib/index-names';
import { compareDates } from '@/lib/utils';

export async function GET(request: any, context: any) {
  initialSteps();
  const last_date = await db
    .select()
    .from(currencies)
    .orderBy(sql`${currencies.date} desc limit 7`);
  let a = [];
  const today = new Date();
  let newData = [] as any[];

  if (compareDates(today, last_date[0]!.date) === 0) {
    const dataSharesOutstanding = (await db
      .select()
      .from(stocks_info)
      .orderBy(stocks_info.market_cap)) as DataSharesOutstanding[];

    const currData = (await db.select().from(currencies)) as CurrenciesPrice[];
    const dbDataDividents = await db.select().from(dividents);
    const dataDividents = dbDataDividents.reduce((prev: DataDividents, curr: any) => {
      const date = curr.date.toISOString().slice(0, 10);
      prev[date] = curr.dividents;
      return prev;
    }, {});
    const dataIndexPrices = await getIndexPrices(dataSharesOutstanding, currData, '2022-12-28');

    for (let i = 0; i < indexNames.length; i++) {
      const indexName = String(indexNames[i]);
      const oldAdjustments = await db
        .select()
        .from(adjustments)
        .where(eq(adjustments.index, indexName))
        .orderBy(adjustments.date);
      const indexHistory = getIndexHistory(dataIndexPrices, oldAdjustments, dataDividents, indexName) as any[];
      newData = [...newData, ...indexHistory];
      await db.delete(indicies).where(eq(indicies.name, indexName));
      await db.insert(indicies).values(indexHistory);
    }

    // const dataNewDividents = await getDividents(dataSharesOutstanding, currData, '2022-12-31');
    // const newDividents = Object.keys(dataNewDividents).map(el => {
    //   return {date: el, dividents: dataNewDividents[el]}
    // })
    // newData = newDividents
    // await db.delete(dividents)
    // await db.insert(dividents).values(newData)

    // await db.insert(indicies).values(newData)

    //   for (let i = 0; i < indexNames.length; i++) {
    //     const indexName = String(indexNames[i]);
    //     const nameForSQL = `"${indexName}"`;
    //     const dataSharesOutstanding = (await db
    //       .select()
    //       .from(stocks_info)
    //       .where(sql`JSON_CONTAINS(${stocks_info.indicies}, ${nameForSQL})`)) as DataSharesOutstanding[];
    //     const currData = (await db.select().from(currencies)) as CurrenciesPrice[];
    //     const oldAdjustments = await db
    //       .select()
    //       .from(adjustments)
    //       .where(eq(adjustments.index, indexName))
    //       .orderBy(adjustments.date);
    //     const dataDividents = await getDividents(dataSharesOutstanding, currData, '2022-12-31');
    //     const dataIndexPrices = await getIndexPrices(dataSharesOutstanding, currData, '2022-12-28');
    //     const indexHistory = getIndexHistory(dataIndexPrices, oldAdjustments, dataDividents, indexName) as any[];
    //     newData = [...newData, ...indexHistory];

    //   }
  } else {
    newData = await db.select().from(indicies);
  }

  return new Response(JSON.stringify(newData), {
    status: 200,
    headers: {
      'Content-Type': 'text/json',
    },
  });
}
