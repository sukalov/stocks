import { eq, sql } from 'drizzle-orm';
import { db } from '../db';
import { currencies, stocks_info } from '../db/schema';
import getCurrenencyPrices from './get-currencies';
import { compareDates } from '../utils';
import getIndexPrices from './get-index-prices';

export const initialSteps = async () => {
  const last_date = await db
    .select()
    .from(currencies)
    .orderBy(sql`${currencies.date} desc limit 7`);
  let a = [];
  const today = new Date();

  let indexPrices = [];
  let data;
  if (compareDates(today, last_date[0]!.date) === 1) {
    // === 1 means data needs to be updated
    data = await getCurrenencyPrices();
    // const currData = await db.select().from(currencies);
    // const stocks = (await db.select().from(stocks_info)) as DataSharesOutstanding[];
    // indexPrices = (await getIndexPrices(stocks, currData, last_date[1]!.date.toISOString().slice(0, 10))) ?? [];
    // const lastPrices = indexPrices[0];
    // for (let i = 0; i < stocks.length; i++) {
    //   const element = stocks[i];
    //   const sym = element?.symbol ?? '';
    //   if (lastPrices[sym] !== undefined && lastPrices[sym] !== null) {
    //     const newCap = lastPrices[sym] * element!.shares;
    //     // console.log(!isNaN(newCap) && element!.market_cap !== null, !isNaN(newCap), element!.market_cap)
    //     if (isNaN(newCap)) console.log(sym);
    //     // if (!isNaN(newCap)) await db.update(stocks_info).set({market_cap: newCap}).where(eq(stocks_info.symbol, sym))
    //   }
    // }
  } else {
    data = await db.select().from(currencies).orderBy(currencies.date);
  }
  return data;
};
