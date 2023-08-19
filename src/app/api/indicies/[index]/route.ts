import getDividents from '@/lib/data-manipulations/get-dividents';
import getIndexHistory from '@/lib/data-manipulations/get-index-history';
import getIndexPrices from '@/lib/data-manipulations/get-index-prices';
import { initialSteps } from '@/lib/data-manipulations/update-currencies-data';
import { db } from '@/lib/db';
import { stocks_info, currencies, adjustments, indicies } from '@/lib/db/schema';
import { sql, eq } from 'drizzle-orm';

export async function GET(request: any, context: any) {

  const indexName = context.params.index;
  const indexHistory = await db.select().from(indicies).where(eq(indicies.name, indexName)).orderBy(indicies.date)

  return new Response(JSON.stringify(indexHistory), {
    status: 200,
    headers: {
      'Content-Type': 'text/json',
    },
  });
}
