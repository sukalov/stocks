import { db } from '@/lib/db';
import { indexprices } from '@/lib/db/schema';
import { csv } from '@/lib/read-write-csv';

export async function GET(request: Request) {
  const dataIndexPricesDB = await db.select().from(indexprices);
  const dataIndexPrices = dataIndexPricesDB[0]?.json as any[];

  const yesterday = dataIndexPrices.at(-2);
  const today = dataIndexPrices.at(-1);

  const resultArr: any[][] = [];
  Object.keys(yesterday).forEach((key) => {
    if (key !== 'date') {
      const day = [key, yesterday[key], today[key], (yesterday[key] / today[key] - 1) * 100];
      resultArr.push(day);
    }
  });

  resultArr.sort((a, b) => a.at(-1) - b.at(-1));
  const result = resultArr.map((el) => el.join(', '));
  result.unshift(`date, ${yesterday.date}, ${today.date}, change (%)`);
  const csv = result.join('\r\n');

  return new Response(csv, {
    status: 200,
    headers: {
      'content-type': 'text/csv',
      'Cache-Control': 'no-store',
    },
  });
}
