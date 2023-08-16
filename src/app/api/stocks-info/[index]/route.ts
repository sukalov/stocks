import { db } from '@/lib/db';
import { stocks_info } from '@/lib/db/schema';
import { sql } from 'drizzle-orm';

export async function GET(request: any, context: any) {
  const index = `"${context.params.index}"`;
  const stocks = await db
    .select()
    .from(stocks_info)
    .where(sql`JSON_CONTAINS(${stocks_info.indicies}, ${index})`);

  return new Response(JSON.stringify(stocks), {
    status: 200,
    headers: {
      'content-type': 'application/json',
    },
  });
}
