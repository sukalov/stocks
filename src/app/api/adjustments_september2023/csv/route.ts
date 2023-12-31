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

  let res = '';
  for (let i in adjes) {
    let thisAdj: any = adjes[i];
    let arr: [string, unknown][] = [];
    Object.entries(thisAdj).forEach((element: any, i) => {
      if (typeof element[1] !== 'object') {
        arr.push(element);
      } else {
        const newIter = Object.entries(element![1]);
        newIter.forEach((el) => {
          el[0] = `${el[0]}-${element[0]}`;
          arr.push(el);
        });
      }
    });

    const arr2 = arr.map((el) => el.join(','));
    const resultCSV = arr2.join(`\r\n`);
    res = res + `\r\n` + resultCSV;
  }

  return new Response(res, {
    status: 200,
    headers: {
      'content-type': 'text/plain; charset=utf-8',
    },
  });
}
