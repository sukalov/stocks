import getDividents from '@/lib/data-manipulations/get-dividents';
import getIndexHistory from '@/lib/data-manipulations/get-index-history';
import getIndexPrices from '@/lib/data-manipulations/get-index-prices';
import { initialSteps } from '@/lib/data-manipulations/update-currencies-data';
import { db } from '@/lib/db';
import { stocks_info, currencies, adjustments } from '@/lib/db/schema';
import { sql, eq } from 'drizzle-orm';

export async function GET(request: any, context: any) {
  const dataSharesOutstanding = (await db
    .select()
    .from(stocks_info)
    // .where(sql`JSON_CONTAINS(${stocks_info.indicies}, ${nameForSQL})`)) as StocksInfo[];
    .where(eq(stocks_info.cap_index, 'Blue Chips'))) as StocksInfo[];

  console.log(dataSharesOutstanding.length);

  for (let i in dataSharesOutstanding) {
    const data = 0;
  }
  const testStock = dataSharesOutstanding[0];

  return new Response(JSON.stringify([]), {
    status: 200,
    headers: {
      'Content-Type': 'text/json',
      'Cache-control': 'no-store',
    },
  });
}
