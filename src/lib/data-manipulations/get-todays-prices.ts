import { timeout } from "../utils";
import get from '../get-from-eod';


export default async function getTodaysPrices(
    data: {symbol: string}[],
    currenciesData: any[]
  ): Promise<DataPrices[]> {
  
    let resData: any = [];
    const now = new Date();
    const today = now.toISOString().slice(0,10)
  
    try {
      const batchSize = 50;
      const requests = [];
      const result: ResponseHistorical[][] = [];
  
      for (let i = 0; i < data.length; i += batchSize) {
        await timeout(1900);
        const batch = data.slice(i, i + batchSize);
        const batchRequests = batch.map((stock) => get.historicalAsync(stock.symbol, today));
        requests.push(batchRequests);
        console.log('1/6. requests', i + 1, 'of', data.length);
      }
  
      let counter = 1
      for (const batchRequests of requests) {
        await timeout(800);
        const batchResponses = await Promise.all(batchRequests);
        const errors = batchResponses.filter((response: { ok: any; }) => !response.ok);
  
        if (errors.length > 0) {
          throw errors.map((response: { statusText: string | undefined; }) => Error(response.statusText));
        }
  
        const batchJson = batchResponses.map((response: { json: () => any; }) => response.json());
        const batchResult = (await Promise.all(batchJson)) as ResponseHistorical[][];
        result.push(...batchResult);
        console.log('2/6. parse responses', counter, ' of ', requests.length);
        counter += 1
      }
  
      resData = result;
      return result;
    } catch (error) {
      console.error(error);
      resData = error
    }
    return resData;
  }