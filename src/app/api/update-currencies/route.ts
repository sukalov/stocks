import { initialSteps } from '@/lib/data-manipulations/update-currencies-data';

export async function GET(request: any, context: any) {
  // const newData = initialSteps();

  return new Response(JSON.stringify([]), {
    status: 200,
    headers: {
      'Content-Type': 'text/json',
    },
  });
}
