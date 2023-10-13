import getDividents from '@/lib/data-manipulations/get-dividents';
import getIndexHistory from '@/lib/data-manipulations/get-index-history';
import getIndexPrices from '@/lib/data-manipulations/get-index-prices';
import { initialSteps } from '@/lib/data-manipulations/update-currencies-data';
import { db } from '@/lib/db';
import { stocks_info, currencies, adjustments, indicies, dividents } from '@/lib/db/schema';
import { sql, eq, inArray } from 'drizzle-orm';
// import { capIndexNames as indexNames} from '@/lib/cap-index-names';
import { indexNames } from '@/lib/index-names';
import { compareDates } from '@/lib/utils';
import getIndexHistory2 from '@/lib/data-manipulations/get-index-history2';
import { updateMarketCaps } from '@/lib/data-manipulations/update-market-caps';
import { csv } from '@/lib/read-write-csv';

export async function GET(request: any, context: any) {
  await initialSteps();
  // const last_date = await db
  //   .select()
  //   .from(currencies)
  //   .orderBy(sql`${currencies.date} desc limit 7`);
  // let a = [];
  const today = new Date();
  let newData = [] as any[];

  // const indexName = 'anime-10';
  // const nameForSQL = `"${indexName}"`;
  // const dataSharesOutstanding2 = (await db
  //   .select()
  //   .from(stocks_info)
  //   //  ) as DataSharesOutstanding[];
  //   .where(sql`JSON_CONTAINS(${stocks_info.indicies}, ${nameForSQL})`)) as DataSharesOutstanding[];

  const dataSharesOutstanding = (await db
    .select()
    .from(stocks_info)
    // .where(inArray(stocks_info.symbol, ['5574.TSE', '420770.KQ', '408900.KO', '5253.TSE', '439090.KQ', '6757.TW', '9166.TSE', '6757.TW', '406820.KQ']))
    ) as StocksInfo[];



  const currData = (await db.select().from(currencies)) as CurrenciesPrice[];
  const dbDataDividents = await db.select().from(dividents);
  const dataDividents = dbDataDividents.reduce((prev: DataDividents, curr: any) => {
    const date = curr.date.toISOString().slice(0, 10);
    prev[date] = curr.dividents;
    return prev;
  }, {});
  // const dataIndexPrices = await getIndexPrices(dataSharesOutstanding, currData, '2022-12-28');
  // await csv.writeJSON('indexPrices', dataIndexPrices)
  const dataIndexPrices = await csv.readJSON('indexPrices');

  // for (let i = 0; i < indexNames.length; i++) {
  //   const indexName = String(indexNames[i]);
  //   const oldAdjustments = await db
  //     .select()
  //     .from(adjustments)
  //     .where(eq(adjustments.index, indexName))

  //   oldAdjustments.sort(function(a,b){
  //     return new Date(b.date) + new Date(a.date);
  //   });

  //   const indexHistory = getIndexHistory2(dataIndexPrices, oldAdjustments, dataDividents, indexName) as any[];
  //   newData = [...newData, ...indexHistory];
  //   await db.delete(indicies).where(eq(indicies.name, indexName));
  //   await db.insert(indicies).values(indexHistory);
  // }

  await updateMarketCaps(dataSharesOutstanding, dataIndexPrices);

  return new Response(JSON.stringify(newData), {
    status: 200,
    headers: {
      'Content-Type': 'text/json',
      'Cache-Control': 'no-store',
    },
  });
}
