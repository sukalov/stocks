import { db } from '@/lib/db';
import { adjustments } from '@/lib/db/schema';
import { inArray } from 'drizzle-orm';
export async function GET(request: Request) {
  const adjes = await db
    .select()
    .from(adjustments)
    .where(
      inArray(adjustments.id, [6, 9, 15, 27, 30, 33, 39, 60, 102, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123])
    )
    .orderBy(adjustments.index);

  return new Response(JSON.stringify(adjes), {
    status: 200,
    headers: {
      'content-type': 'application/json',
    },
  });
}
