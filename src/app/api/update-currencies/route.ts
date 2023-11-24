import { initialSteps } from '@/lib/data-manipulations/update-currencies-data';

export async function GET(request: any, context: any) {
  // const newData = await initialSteps();

  return new Response(JSON.stringify('newData'), {
    status: 200,
    headers: {
      'Content-Type': 'text/json',
    },
  });
}
