import getIndexPrices from "@/lib/data-manipulations/get-index-prices";
import getTodaysPrices from "@/lib/data-manipulations/get-todays-prices";
import { db } from "@/lib/db";
import { currencies } from "@/lib/db/schema";

export const revalidate = 0;

export async function GET(request: any, context: any) {

    const currenciesData = (await db.select().from(currencies)) as CurrenciesPrice[];
    const lastTwoPrices = await getTodaysPrices([{symbol: '005930.KO', currency: 'USD'}], currenciesData)

return new Response(JSON.stringify(lastTwoPrices), {
    status: 200,
    headers: {
      'Content-Type': 'text/json',
      'Cache-Control': 'no-store, , max-age=0',
    },
  });
}