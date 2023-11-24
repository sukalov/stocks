import { csv } from '../read-write-csv';
import { stocks_info } from '../db/schema';
import get from '@/lib/get-from-eod';
import { db } from '../db';

export default async function getSharesOutstanding(
  data: Array<DataOnlySymbol>,
  indexName: string
): Promise<DataSharesOutstanding[]> {
  let dataWithShares: Array<any> = [];
  try {
    const requests = data.map((stock) => get.fundamentalAsync(stock.symbol));
    const result = await Promise.allSettled(requests);
    let keys = [];
    let vals: Array<any> = [];

    for (let i in result) {
      let set = result[i];
      if (set!.status === 'fulfilled') {
        keys.push(data[i]?.symbol);
        const dat = (await set!.value.json()) as any;
        const shares = dat.SharesStats?.SharesOutstanding ?? 0;
        const currency = dat.General?.CurrencyCode ?? '';
        const jakota_indicies = [];
        if (data[i]?.industry === 'Apparel Retail') jakota_indicies.push('consumer-50');
        if (data[i]?.industry === 'Apparel Accessories and Luxury Goods') jakota_indicies.push('consumer-50');
        if (data[i]?.industry === 'Automotive Retail') jakota_indicies.push('consumer-50');
        if (data[i]?.industry === 'Brewers') jakota_indicies.push('consumer-50');
        if (data[i]?.industry === 'Broadcasting') jakota_indicies.push('consumer-50');
        if (data[i]?.industry === 'Broadcasting') jakota_indicies.push('entertainment-100');
        if (data[i]?.industry === 'Broadline Retail') jakota_indicies.push('consumer-50');
        if (data[i]?.industry === 'Computer and Electronics Retail') jakota_indicies.push('consumer-50');
        if (data[i]?.industry === 'Consumer Electronics') jakota_indicies.push('consumer-50');
        if (data[i]?.industry === 'Consumer Finance') jakota_indicies.push('consumer-50');
        if (data[i]?.industry === 'Consumer Staples Merchandise Retail') jakota_indicies.push('consumer-50');
        if (data[i]?.industry === 'Distillers and Vintners') jakota_indicies.push('consumer-50');
        if (data[i]?.industry === 'Drug Retail') jakota_indicies.push('consumer-50');
        if (data[i]?.industry === 'Education Services') jakota_indicies.push('consumer-50');
        if (data[i]?.industry === 'Food Retail') jakota_indicies.push('consumer-50');
        if (data[i]?.industry === 'Footwear') jakota_indicies.push('consumer-50');
        if (data[i]?.industry === 'Home Improvement Retail') jakota_indicies.push('consumer-50');
        if (data[i]?.industry === 'Homefurnishing Retail') jakota_indicies.push('consumer-50');
        if (data[i]?.industry === 'Household Products') jakota_indicies.push('consumer-50');
        if (data[i]?.industry === 'Interactive Home Entertainment') jakota_indicies.push('consumer-50');
        if (data[i]?.industry === 'Interactive Media and Services') jakota_indicies.push('consumer-50');
        if (data[i]?.industry === 'Interactive Media and Services') jakota_indicies.push('entertainment-100');
        if (data[i]?.industry === 'Leisure Facilities') jakota_indicies.push('consumer-50');
        if (data[i]?.industry === 'Leisure Products') jakota_indicies.push('consumer-50');
        if (data[i]?.industry === 'Motorcycle Manufacturers') jakota_indicies.push('consumer-50');
        if (data[i]?.industry === 'Passenger Airlines') jakota_indicies.push('consumer-50');
        if (data[i]?.industry === 'Passenger Ground Transportation') jakota_indicies.push('consumer-50');
        if (data[i]?.industry === 'Personal Care Products') jakota_indicies.push('consumer-50');
        if (data[i]?.industry === 'Soft Drinks and Non-alcoholic Beverages') jakota_indicies.push('consumer-50');
        if (data[i]?.industry === 'Tobacco') jakota_indicies.push('consumer-50');
        if (data[i]?.industry === 'Application Software') jakota_indicies.push('tech-100');
        if (data[i]?.industry === 'Communications Equipment') jakota_indicies.push('tech-100');
        if (data[i]?.industry === 'Electronic Components') jakota_indicies.push('tech-100');
        if (data[i]?.industry === 'Electronic Equipment and Instruments') jakota_indicies.push('tech-100');
        if (data[i]?.industry === 'Electronic Manufacturing Services') jakota_indicies.push('tech-100');
        if (data[i]?.industry === 'Internet Services and Infrastructure') jakota_indicies.push('tech-100');
        if (data[i]?.industry === 'Semiconductor Materials and Equipment') jakota_indicies.push('tech-100');
        if (data[i]?.industry === 'Semiconductor Materials and Equipment') jakota_indicies.push('semiconductors-25');
        if (data[i]?.industry === 'Systems Software') jakota_indicies.push('tech-100');
        if (data[i]?.industry === 'Technology Hardware, Storage and Peripherals') jakota_indicies.push('tech-100');
        if (data[i]?.industry === 'Movies and Entertainment') jakota_indicies.push('entertainment-100');

        dataWithShares.push({
          symbol: data[i]?.symbol ?? '',
          ...data[i],
          shares,
          currency,
          jakota_indicies,
        });
      }
      // const shares = datum.SharesStats.SharesOutstanding;
      // const currency = datum.General.CurrencyCode;
      // dataWithShares.push({
      //   symbol: data[i]?.symbol ?? '',
      //   ...data[i],
      //   shares,
      //   currency
      // });
    }

    // dataWithShares = vals
  } catch (error) {
    console.error(error);
  }

  await csv.write(`${indexName}_step1`, dataWithShares);
  // await db.insert(stocks_info).values(dataWithShares)
  // await db.delete(stocks_info)

  return dataWithShares;
}
