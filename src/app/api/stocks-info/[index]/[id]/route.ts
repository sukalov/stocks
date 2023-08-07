import { db } from '@/lib/db';
import { stocks_info } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: any, context: any) {
  const id = context.params.id
  const selectedAdjustments = await db.selectDistinct().from(stocks_info).where(eq(stocks_info.id, id))
  if (selectedAdjustments.length === 0) return new Response('not found', {status: 404})
  const thisAdj = JSON.parse(JSON.stringify(selectedAdjustments[0])) as {date: any}

  if (thisAdj?.date !== undefined) thisAdj.date = new Date(thisAdj.date).toISOString().slice(0,10)

  let arr: [string, unknown][] = []
  Object.entries(thisAdj).forEach((element, i) => {
    if (typeof element[1] !== 'object') {
        arr.push(element)
    } else {
        console.log(element)
        const newIter = Object.entries(element[1]);
        newIter.forEach(el => {
            el[0] = `${el[0]}-${element[0]}`
            arr.push(el)
        })
    }
  });

  const arr2 = arr.map(el => el.join(','))
  const resultCSV = arr2.join(`\r\n`)
  
  return new Response(resultCSV, {
    status: 200,
    headers: {
      'content-type': 'text/plain; charset=utf-8',
    },
  });
}