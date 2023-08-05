import get from '@/lib/get-from-eod';
import { csv } from '@/lib/read-write-csv';
import toUSD from '@/lib/translate-to-usd';
import { getInitialIndexDates, addMissingValues, findUnique, getQuarterlyStartDates } from '@/lib/utils';
import { db } from '@/lib/db';
import { stocks_info, currencies, adjustments } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';
import getCurrenencyPrices from '@/lib/data-manipulations/get-currencies';
import getIndexHistory from '@/lib/data-manipulations/get-index-history';
import getIndexPrices from '@/lib/data-manipulations/get-index-prices';
import getSharesOutstanding from '@/lib/data-manipulations/get-shares-outstanding';

export async function GET(request: Request) {
  const initialSteps = async () => {
    const last_date = await db
      .select()
      .from(currencies)
      .orderBy(sql`${currencies.date} desc limit 1`);
    const today = new Date();
    if (today.toLocaleDateString() > last_date[0]!.date.toLocaleDateString()) {
      getCurrenencyPrices();
    }
  };

  const getInitialPrices = async (data: Array<DataSharesOutstanding>, startDate: string, indexName: string) => {
    const newData: Array<DataInitialPrices> = [];
    const requests = data.map((stock) => get.historicalAsync(stock.symbol, startDate));
    const responses = await Promise.all(requests);
    const errors = responses.filter((response: { ok: any }) => !response.ok);

    if (errors.length > 0) {
      throw errors.map((response: { statusText: string | undefined }) => Error(response.statusText));
    }

    const json = responses.map((response: { json: () => any }) => response.json());
    const result = (await Promise.all(json)) as Array<ResponseHistorical[]>;

    result.forEach((datum, i) => {
      newData.push({
        ...data[i],
        initial_date: startDate,
        initial_price: datum[0]?.adjusted_close ?? 0,
        symbol: data[i]?.symbol ?? '',
        currency: data[i]?.currency ?? 'USD',
      });
    });

    csv.write(`${indexName}_step2`, newData);
    return newData;
  };

  const getAdjustedShares = (
    data: DataSharesInitialDay[],
    currencies: any[],
    indexVolume: number = 25,
    indexName: string
  ) => {
    data.map((stock: DataSharesInitialDay, i: number) => {
      stock.initial_price_USD = toUSD(stock.initial_price, stock.currency, stock.initial_date, currencies);
      const initialMC = (Number(stock.initial_price_USD) * Number(stock.shares)) / 1000000;
      stock.initial_MC_USD = initialMC;
    });

    data
      .sort((a: DataSharesInitialDay, b: DataSharesInitialDay) => Number(b.initial_MC_USD) - Number(a.initial_MC_USD))
      .splice(indexVolume);

    const totalMC = data.reduce((acc: number, current: DataSharesInitialDay) => {
      if (current.initial_MC_USD) return acc + current.initial_MC_USD;
      else return acc;
    }, 0);

    data.forEach((stock: DataSharesInitialDay, i: number) => {
      stock.share = Number(stock.initial_MC_USD) / totalMC;
      stock.share_adj = Number(stock.initial_MC_USD) / totalMC;
    });

    const dataCopy = JSON.parse(JSON.stringify(data)) as DataShareAdjusted[];
    let remainingSUM = totalMC;
    data.forEach((stock, i: number) => {
      if (stock.share > 0.1) {
        stock.share_adj = 0.1;
        const remains = stock.initial_MC_USD - totalMC / 10; // то что надо раскидать по всем оставшимся акциям
        remainingSUM -= stock.initial_MC_USD;
        stock.initial_MC_USD = totalMC / 10;
        data.forEach((el: DataSharesInitialDay, j: number) => {
          if (j > i) {
            const addition = (el.initial_MC_USD / remainingSUM) * remains;
            el.initial_MC_USD = el.initial_MC_USD + addition;
            el.share = el.initial_MC_USD / totalMC;
          }
        });
        remainingSUM = remainingSUM + remains;
      } else {
        stock.share_adj = stock.share;
      }
    });

    data.forEach((stock, i) => {
      stock.initial_MC_USD = dataCopy[i]?.initial_MC_USD ?? 0;
      stock.share = dataCopy[i]?.share ?? 0;
    });

    csv.write(`${indexName}_share`, data);

    return data;
  };

  const getDataForAdjustments = (indexPriceHistory: any) => {
    const adjustmentDates = getQuarterlyStartDates('2022-12-29');
    const adjustmentDaysFull = indexPriceHistory.filter((day: any) => adjustmentDates.includes(day.date));
    return adjustmentDaysFull;
  };

  const getAdjustments = (dataForAdjustments: any, dataSharesOutstanding: any, indexName: any) => {
    const indexVolume = Number(indexName.split('-')[1]);
    const newAdjustments: any[] = [];
    dataForAdjustments.forEach((adjDay: any) => {
      const data = JSON.parse(JSON.stringify(dataSharesOutstanding)) as any[];
      data.forEach((stock) => {
        stock.MC = adjDay[stock.symbol] * stock.shares;
      });
      data.sort((a, b) => Number(b.MC) - Number(a.MC)).splice(indexVolume);

      const totalMC = data.reduce((acc: number, current: DataSharesInitialDay) => {
        if (current.MC) return acc + current.MC;
        else return acc;
      }, 0);

      data.forEach((stock: DataSharesInitialDay, i: number) => {
        stock.share = Number(stock.MC) / totalMC;
        stock.share_adj = Number(stock.MC) / totalMC;
      });

      const dataCopy = JSON.parse(JSON.stringify(data)) as DataShareAdjusted[];
      let remainingSUM = totalMC;
      data.forEach((stock, i: number) => {
        if (stock.share > 0.1) {
          stock.share_adj = 0.1;
          const remains = stock.MC - totalMC / 10; // то что надо раскидать по всем оставшимся акциям
          remainingSUM -= stock.MC;
          stock.MC = totalMC / 10;
          data.forEach((el: DataSharesInitialDay, j: number) => {
            if (j > i) {
              const addition = (el.MC / remainingSUM) * remains;
              el.MC = el.MC + addition;
              el.share = el.MC / totalMC;
            }
          });
          remainingSUM = remainingSUM + remains;
        } else {
          stock.share_adj = stock.share;
        }
      });

      data.forEach((stock, i) => {
        stock.MC = dataCopy[i]?.MC ?? 0;
        stock.share = dataCopy[i]?.share ?? 0;
      });

      const adjustment = data.reduce((acc, current, i) => {
        acc.capitalizations = acc?.capitalizations || {};
        acc.original_percents = acc?.original_percents || {};
        acc.percents = acc?.percents || {};

        acc.capitalizations[current.symbol] = current.MC;
        acc.original_percents[current.symbol] = current.share;
        acc.percents[current.symbol] = current.share_adj;

        return acc;
      }, {});

      const finalAdjustment = {
        date: adjDay.date,
        index: indexName,
        ...adjustment,
      };

      newAdjustments.push(finalAdjustment);
    });

    return newAdjustments;
  };

  const mergeIndicies = (
    dataTotal: DataTotal[] = [],
    dataNew: IndexDay[],
    dataOld: IndexDay[],
    indexName: string = 'test'
  ): DataTotal[] => {
    const newDataTotal = JSON.parse(JSON.stringify(dataTotal)) as DataTotal[];
    if (dataTotal.length === 0) {
      let mergingDay = dataOld.findIndex((day) => day.date === dataNew[0]?.date);
      const keys = dataOld[0] ?? {};
      let shares = Object.keys(keys).filter((el, i) => i > 5 && i < Object.keys(keys).length - 2);
      for (let i = 0; i <= mergingDay; i++) {
        newDataTotal.push({
          date: dataOld[i]?.date ?? '',
          price: dataOld[i]?.share_price_usd,
          index: dataOld[i]?.index ?? 0,
          index_adjusted: dataOld[i]?.index ?? 0,
          index_shares: shares,
          refactor: null,
        });
      }
    }
    const newDataTotal2 = addNewDataToTotal(newDataTotal, dataNew);

    csv.write(indexName, newDataTotal2);

    return newDataTotal2;
  };

  const addNewDataToTotal = (dataTotal: DataTotal[], dataNew: IndexDay[]) => {
    let mergingDay = dataTotal.findIndex((day) => day.date === dataNew[0]?.date);
    let newDataTotal = dataTotal.slice(0, mergingDay + 1);
    const keys2 = dataNew[0] ?? {};
    const shares2 = Object.keys(keys2).filter((el, i) => i > 5 && i < Object.keys(keys2).length - 2);
    const lastElement = newDataTotal[newDataTotal.length - 1]!;
    const shares = lastElement.index_shares;

    lastElement.refactor = {
      new_index: dataNew[0]!.index,
      new_price: dataNew[0]!.share_price_usd,
      shares_removed: findUnique(shares, shares2)[0],
      shares_added: findUnique(shares, shares2)[1],
    };

    newDataTotal.forEach((el) => {
      el.index_adjusted = el.price / Number(newDataTotal[newDataTotal.length - 1]?.refactor?.new_price);
    });

    dataNew.forEach((el, i) => {
      if (i > 0) {
        newDataTotal.push({
          date: el.date ?? '',
          price: el.share_price_usd,
          index: el.index,
          index_adjusted: el.index,
          index_shares: shares2,
          refactor: null,
        });
      }
    });
    return newDataTotal;
  };

  // const mainCollectingSharesOutstanding = async (symbolsFileName: string, startDate: string) => {
  //   const dataOnlySymbol = (await csv.read(symbolsFileName)) as DataOnlySymbol[];
  //   const dataSharesOutstanding = (await getSharesOutstanding(
  //     dataOnlySymbol,
  //     symbolsFileName
  //   )) as DataSharesOutstanding[];
  //   const dataInitialPrices = (await getInitialPrices(
  //     dataSharesOutstanding,
  //     startDate,
  //     symbolsFileName
  //   )) as DataSharesInitialDay[];
  //   const currencies = (await getCurrenencyPrices(['KRW', 'JPY', 'TWD'], startDate)) as CurrenciesPrice[];
  //   const dataAdjustedShare = getAdjustedShare(
  //     dataInitialPrices,
  //     currencies,
  //     25,
  //     symbolsFileName
  //   ) as DataShareAdjusted[];
  //   const dataIndexHistory = await getIndexHistory(dataAdjustedShare, currencies, startDate, symbolsFileName);
  //   return dataIndexHistory;
  // };

  // const mainWIthGivenSharesOutstanding = async (symbolsFileName: string, startDate: string) => {
  //   const command = `JSON_CONTAINS(indicies, '"cosmetics-15"')`;
  //   const dataSharesOutstanding = (await db
  //     .select()
  //     .from(stocks_info)
  //     .where(sql`JSON_CONTAINS(indicies, '"cosmetics-15"')`)) as DataSharesOutstanding[];
  //   console.log(dataSharesOutstanding);

  //   const dataInitialPrices = (await getInitialPrices(
  //     dataSharesOutstanding,
  //     startDate,
  //     symbolsFileName
  //   )) as DataSharesInitialDay[];
  //   const currencies = (await getCurrenencyPrices(['KRW', 'JPY', 'TWD'], startDate)) as CurrenciesPrice[];
  //   const dataAdjustedShare = getAdjustedShare(
  //     dataInitialPrices,
  //     currencies,
  //     25,
  //     symbolsFileName
  //   ) as DataShareAdjusted[];
  //   const dataIndexHistory = await getIndexHistory(dataAdjustedShare, currencies, startDate, symbolsFileName);
  //   return dataIndexHistory;
  // };

  // const mainRefactorEveryQuartile = async (symbolsFileName: string, startDate: string) => {
  //   const dates = getQuarterlyStartDates(startDate) as string[];
  //   dates.shift();
  //   let data1 = (await mainWIthGivenSharesOutstanding(symbolsFileName, startDate)) as IndexDay[];
  //   let newDataTotal: DataTotal[] = [];
  //   // dates.forEach(async (date, i) => {
  //   //   console.log(newDataTotal)
  //   //     const data2 = await mainWIthGivenSharesOutstanding(symbolsFileName, date) as IndexDay[]
  //   //     newDataTotal = mergeindicies(newDataTotal, data2, data1)
  //   // })
  //   let i = 0;
  //   while (i < dates.length) {
  //     const data2 = (await mainWIthGivenSharesOutstanding(symbolsFileName, dates[i]!)) as IndexDay[];
  //     newDataTotal = mergeIndicies(newDataTotal, data2, data1);
  //     i++;
  //   }

  //   csv.write(symbolsFileName + '_final', newDataTotal);

  //   return newDataTotal;
  // };

  // const res = await getInitialPrices(dataOnlySymbol)
  // const res = getAdjustedShare(dataSharesInitialDay, currenciesData);
  // const res = await getIndexHistory(dataShareAdjusted, currenciesData)
  // const res = getInitialIndexDates()
  
  // const res = await mainWIthGivenSharesOutstanding('cosmetics-15', '2022-12-29');
  // const data2 = data.map(el => {
    //   return {
      //     ...el,
      //     indicies: ['semiconductors-25'],
      //     shares: Number(el.shares)
      
      //   }
      // })
      // const res = await getSharesOutstanding(data2, 'entertain100');
      
      // const topush = []
      // for (let i = 0; i < data2.length; i++) {
        //   let element = data2[i]!;
        //   const search = await db.select().from(stocks_info).where(eq(stocks_info.symbol, element.symbol))
        //   if (search.length === 0) {
          //     topush.push(element)
          //   }
          //   else {
            //     console.log(search[0]?.indicies.concat(element.indicies))
            //   }
            //     await db
            //     .insert(stocks_info).values(element)
            //     .onDuplicateKeyUpdate({ set: { cap_index: element.cap_index }});
            
            // };
            // if (topush.length > 0) await db.insert(stocks_info).values(topush)
  // await db.delete(stocks_info).where(gte(stocks_info.id, 9));
  // const data2 = await csv.read('kpop2_index') as IndexDay[];
  // const res = await getSharesOutstanding(data1, 'anime10');

  const indexName = 'consumer-50';
  const nameForSQL = `"${indexName}"`;
  const dataSharesOutstanding = (await db
    .select()
    .from(stocks_info)
    .where(sql`JSON_CONTAINS(${stocks_info.indicies}, ${nameForSQL})`)) as DataSharesOutstanding[];
  const currData = await db.select().from(currencies);
  const oldAdjustments = await db
    .select()
    .from(adjustments)
    .where(eq(adjustments.index, indexName))
    .orderBy(adjustments.date);

  const dataIndexPrices = await getIndexPrices(dataSharesOutstanding, currData, '2022-12-29', indexName);
  const dataForAdjustments = getDataForAdjustments(dataIndexPrices)
  const newAdjustments = getAdjustments(dataForAdjustments, dataSharesOutstanding, indexName)

  // const indexHistory = getIndexHistory(dataIndexPrices, oldAdjustments, indexName);

  // await db.insert(adjustments).values(newAdjustments)
  // await db.delete(adjustments)
  // await initialSteps();

const res = ['type one of three api\'s [stocks-info, adjustments, index] followed by the name of the index you are interested in']
  return new Response(JSON.stringify(res), {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
