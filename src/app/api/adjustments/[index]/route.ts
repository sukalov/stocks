import { db } from '@/lib/db';
import { adjustments } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: any, context: any) {
  const index = context.params.index
  const selectedAdjustments = await db.select().from(adjustments).where(eq(adjustments.index, index))

  return new Response(JSON.stringify(selectedAdjustments), {
    status: 200,
    headers: {
      'content-type': 'application/json',
    },
  });
}