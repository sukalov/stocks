import { db } from '@/lib/db';
import { adjustments } from '@/lib/db/schema';
export async function GET(request: Request) {
  const stocks = await db.select().from(adjustments);
  return new Response(JSON.stringify(stocks), {
    status: 200,
    headers: {
      'content-type': 'application/json',
    },
  });
}
