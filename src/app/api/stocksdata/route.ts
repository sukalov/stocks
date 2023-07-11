import { db } from "@/lib/db";
import { stocks_data } from "@/lib/db/schema";

export async function GET(request: Request) {
    const stocks = await db.select().from(stocks_data)
    return new Response(JSON.stringify(stocks), {
      status: 200,
      headers: {
        'content-type': 'application/json',
      },
    })
};

export async function POST(request: Request) {
    const stocks = await db.select().from(stocks_data)
    return new Response(JSON.stringify(stocks), {
      status: 200,
      headers: {
        'content-type': 'application/json',
      },
    })
};