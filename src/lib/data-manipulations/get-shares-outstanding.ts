import { csv } from '../read-write-csv';
import { stocks_info } from '../db/schema';
import get from '@/lib/get-from-eod'

export default async function getSharesOutstanding(
  data: Array<DataOnlySymbol>,
  indexName: string
): Promise<DataSharesOutstanding[]> {
  const dataWithShares: Array<DataSharesOutstanding> = [];
  try {
    const requests = data.map((stock) => get.fundamentalAsync(stock.symbol));
    const responses = await Promise.all(requests);
    const errors = responses.filter((response: { ok: any }) => !response.ok);

    if (errors.length > 0) {
      throw errors.map((response: { statusText: string | undefined }) => Error(response.statusText));
    }

    const json = responses.map((response: { json: () => any }) => response.json());
    const result = (await Promise.all(json)) as Array<ResponseFundamental>;

    result.forEach((datum, i) => {
      const shares = datum.SharesStats.SharesOutstanding;
      const currency = datum.General.CurrencyCode;
      dataWithShares.push({
        symbol: data[i]?.symbol ?? '',
        ...data[i],
        shares,
        currency,
        indicies: [`${indexName}`],
      });
    });
  } catch (error) {
    console.error(error);
  }

  await csv.write(`${indexName}_step1`, dataWithShares);
  // await db.insert(stocks_info).values(dataWithShares)
  // await db.delete(stocks_info)

  return dataWithShares;
}
