import removeStockFromAdjustment from '@/lib/data-manipulations/remove-stock-from-adjustment';
import { db } from '@/lib/db';
import { adjustments } from '@/lib/db/schema';

export async function POST(request: any) {
  const dataAdjustments = (await db.select().from(adjustments)) as DataAdjustments[];

  const body = await request.json();

  const adjIndex = dataAdjustments.findIndex((adj) => adj.id === Number(body.adjId));
  const adj = dataAdjustments[adjIndex] as DataAdjustments;
  const symbol = body.stock;
  const date = body.date;
  const res = removeStockFromAdjustment(adj, symbol, date);

  return new Response(JSON.stringify(res), {
    status: 200,
    headers: {
      'Content-Type': 'text/json',
    },
  });
}
