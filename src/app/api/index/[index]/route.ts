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
  const currData = await db.select().from(currencies);
  const oldAdjustments = await db
    .select()
    .from(adjustments)
    .where(eq(adjustments.index, indexName))
    .orderBy(adjustments.date);

  const dataIndexPrices = await getIndexPrices(dataSharesOutstanding, currData, '2022-12-28', indexName);
  const indexHistory = getIndexHistory(dataIndexPrices, oldAdjustments, indexName);

  return new Response(JSON.stringify(indexHistory), {
    status: 200,
    headers: {
      'Content-Type': 'text/json',
    },
  });
}
