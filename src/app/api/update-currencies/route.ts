import { initialSteps } from '@/lib/data-manipulations/update-currencies-data';

export async function GET(request: any, context: any) {
  // const newData = initialSteps();

  return new Response('endpoint suspended', {
    status: 200,
    headers: {
      'Content-Type': 'text/json',
    },
  });
}
