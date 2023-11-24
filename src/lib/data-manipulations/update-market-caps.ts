import { eq } from 'drizzle-orm';
import { db } from '../db';
import { stocks_info } from '../db/schema';

export const updateMarketCaps = async (dataSharesOutstanding: StocksInfo[], indexPrices: DataPrices[]) => {
  const todayPrices = indexPrices.at(-1) as DataPrices;
  const res: any = [];
  let count = 0;
  for (let el in todayPrices) {
    console.log({ count, el });
    count += 1;
    if (el !== 'date') {
      const symbolIndex = dataSharesOutstanding.findIndex((stock) => stock.symbol === el)
      if (symbolIndex >= 0) {
      const shares = dataSharesOutstanding.find((stock) => stock.symbol === el)!.shares;
      let currentMC = shares * Number(todayPrices[el]);
      if (isNaN(currentMC)) currentMC = 0;
      res.push({ el, currentMC });
      await db.update(stocks_info).set({ market_cap: currentMC, last_price: todayPrices[el]}).where(eq(stocks_info.symbol, el));
    }}
  }
  return res;
};
