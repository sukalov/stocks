import getDividents from '@/lib/data-manipulations/get-dividents';
import getIndexHistory from '@/lib/data-manipulations/get-index-history';
import getIndexPrices from '@/lib/data-manipulations/get-index-prices';
import { initialSteps } from '@/lib/data-manipulations/update-currencies-data';
import { db } from '@/lib/db';
import { stocks_info, currencies, adjustments } from '@/lib/db/schema';
import { sql, eq } from 'drizzle-orm';

export async function GET(request: any, context: any) {
  initialSteps();
  const indexName = context.params.index;
  const nameForSQL = `"${indexName}"`;
  const dataSharesOutstanding = (await db
    .select()
    .from(stocks_info)
    .where(sql`JSON_CONTAINS(${stocks_info.indicies}, ${nameForSQL})`)) as DataSharesOutstanding[];
  const currData = (await db.select().from(currencies)) as CurrenciesPrice[];
  const dataDividents = await getDividents(dataSharesOutstanding, currData, '2022-12-31');

  return new Response(JSON.stringify(dataDividents), {
    status: 200,
    headers: {
      'Content-Type': 'text/json',
    },
  });
}