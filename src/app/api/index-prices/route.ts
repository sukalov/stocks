import { csv } from "@/lib/read-write-csv";

export async function GET(request: Request) {
  
    const splits = await csv.readJSON('indexPrices')

  return new Response(JSON.stringify(splits), {
    status: 200,
    headers: {
      'content-type': 'application/json',
    },
  });
}