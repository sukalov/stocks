import get from '@/lib/get-from-eod';
import { csv } from '@/lib/read-write-csv';
import toUSD from '@/lib/translate-to-usd';
import { getInitialIndexDates, addMissingValues, findUnique, getQuarterlyStartDates } from '@/lib/utils';
import { db } from '@/lib/db';
import { stocks_info, currencies, adjustments, dividents, indicies } from '@/lib/db/schema';
import { and, eq, gt, gte, inArray, isNull, ne, sql } from 'drizzle-orm';
import getCurrenencyPrices from '@/lib/data-manipulations/get-currencies';
import getIndexHistory from '@/lib/data-manipulations/get-index-history';
import getIndexPrices from '@/lib/data-manipulations/get-index-prices';
import getSharesOutstanding from '@/lib/data-manipulations/get-shares-outstanding';
import { initialSteps } from '@/lib/data-manipulations/update-currencies-data';
import getDividents from '@/lib/data-manipulations/get-dividents';
import { getAdjustments } from '@/lib/data-manipulations/get-adjustments';
import { getCapAdjustments } from '@/lib/data-manipulations/get-cap-adjustments';
import { json } from 'd3';
import getDividentsFromDB from '@/lib/data-manipulations/get-dividents-from-db';
import getAllDataAsCSV from '@/lib/get-data-as-csv';
import getIndexHistory2 from '@/lib/data-manipulations/get-index-history2';
import { indexNames } from '@/lib/index-names';
import getSplits from '@/lib/data-manipulations/get-splits';

export async function GET(request: Request) {
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
    const adjustmentDates = getQuarterlyStartDates('2022-12-28');
    const adjustmentDaysFull = indexPriceHistory.filter((day: any) => adjustmentDates.includes(day.date));
    return adjustmentDaysFull;
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
      new_index: dataNew[0]!.index ?? 0,
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
          index: el.index ?? null,
          index_adjusted: el.index ?? null,
          index_shares: shares2,
          refactor: null,
        });
      }
    });
    return newDataTotal;
  };

  const mainCollectingSharesOutstanding = async (symbolsFileName: string, startDate: string) => {
    const dataOnlySymbol = (await csv.read(symbolsFileName)) as DataOnlySymbol[];
    const dataSharesOutstanding = (await getSharesOutstanding(
      dataOnlySymbol,
      symbolsFileName
    )) as DataSharesOutstanding[];
    // const dataInitialPrices = (await getInitialPrices(
    //   dataSharesOutstanding,
    //   startDate,
    //   symbolsFileName
    // )) as DataSharesInitialDay[];
    return dataSharesOutstanding;
    //   const currencies = (await getCurrenencyPrices(['KRW', 'JPY', 'TWD'], startDate)) as CurrenciesPrice[];
    //   const dataAdjustedShare = getAdjustedShare(
    //     dataInitialPrices,
    //     currencies,
    //     25,
    //     symbolsFileName
    //   ) as DataShareAdjusted[];
    //   const dataIndexHistory = await getIndexHistory(dataAdjustedShare, currencies, startDate, symbolsFileName);
    //   return dataIndexHistory;
  };

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

  //  =====================  REMOVE DUPLICATE INDICIES FROM DB =====================
  // const data = await db.select().from(stocks_info)
  //   for (let index = 0; index < data.length; index++) {
  //     const element = data[index];
  //     await db.update(stocks_info).set({indicies: [...new Set(element.indicies)]}).where(eq(stocks_info.id, element.id))
  //   }
  //===============================================================================

  //========================  cap index, renames =====================
  // const data = await db.select().from(stocks_info);
  // const dataMidSmall = await db.select().from(adjustments).where(and(eq(adjustments.date, new Date('2023-09-30')), eq(adjustments.index,'mid-small-cap-2000'))) as any[]
  // const dataBlueChips = await db.select().from(adjustments).where(and(eq(adjustments.date, new Date('2023-09-30')), eq(adjustments.index,'blue-chips-150'))) as any[]
  // const midSmall = Object.keys(dataMidSmall[0].capitalizations)
  // const blueChips = Object.keys(dataBlueChips[0].capitalizations)
  // const caps = {...dataBlueChips[0].capitalizations, ...dataMidSmall[0].capitalizations}
  
  // for (let i in data) {
  //   const stock: any = data[i]
  //   if (midSmall.includes(stock.symbol)) {
  //     await db.update(stocks_info).set({ cap_index: 'Mid/Small Cap' }).where(eq(stocks_info.id, stock.id));
  //   } else if (blueChips.includes(stock.symbol)) {
  //     await db.update(stocks_info).set({ cap_index: 'Blue Chips' }).where(eq(stocks_info.id, stock.id));
  //   } else {
  //     await db.update(stocks_info).set({ cap_index: null }).where(eq(stocks_info.id, stock.id));
  //   }
  //   console.log('processed', i, 'of', data.length )
  // }


         //#############      exporting ajustment capitalisations to a csv    ############
  // let stocksInfoAdjustmentsDay = [];
  // for (let i in data) {
  //   const stock = JSON.parse(JSON.stringify(data[i])) as any
  //   if (midSmall.includes(stock.symbol)) {
  //     stock.market_cap_september_30 = caps[stock.symbol]
  //     stocksInfoAdjustmentsDay.push(stock)
  //   } else if (blueChips.includes(stock.symbol)) {
  //     stock.market_cap_september_30 = caps[stock.symbol]
  //     stocksInfoAdjustmentsDay.push(stock)
  //   }
  // }

  // await csv.write('stocks_info_with_september_caps', stocksInfoAdjustmentsDay)
  //===============================================================================

  // const indexName = 'semiconductors-25'
  // const data2 = await csv.read(indexName) as DataOnlySymbol[];
  //   const topush = []
  //   for (let i = 0; i < data2.length; i++) {
  //     let element = data2[i]!;
  //     const search = await db.select().from(stocks_info).where(eq(stocks_info.symbol, element.symbol))

  //     if (search.length === 0) {
  //       element.indicies = indexName
  //       topush.push(element)
  //     }
  //     else {
  //       console.log(search[0]?.indicies.concat(element.indicies))
  //       const theId = search[0].id
  //       await db.update(stocks_info).set({indicies: search[0]?.indicies.concat(element.indicies)}).where(eq(stocks_info.id, theId))
  //   };}
  //   if (topush.length > 0) {
  //   // await db.insert(stocks_info).values(topush)
  //   }
  //   console.log('=============')
  //   topush.forEach(e => console.log(e));

  //================================  COMPARE DB WITH CSV  ========================================
  // const indexName = 'semiconductors-25';
  // const index = `"${indexName}"`;
  // const stocks = (await db
  //   .select()
  //   .from(stocks_info)
  //   .where(sql`JSON_CONTAINS(${stocks_info.indicies}, ${index})`)) as any[];
  // const stockshere = await csv.read(indexName) as any[]
  // const i1 = stocks.map(el => el.symbol)
  // const i2 = stockshere.map(el => el.symbol)
  // const arr = i2.filter(el => !i1.includes(el))
  // console.log(i1.length, i2.length, arr);
  // await csv.write(`${indexName}_RESULT`, stocks)
  //================================================================================================
  // const currData = await db.select().from(currencies)
  // const errors = [];

  // let data2 = await csv.read('universe') as DataOnlySymbol[] as DataSharesOutstanding[]
  // for (let i = 0; i < data2.length; i++) {
  //   const element = data2[i];
  //   const prices = await get.historical(element!.symbol)
  //   const currentPrice = prices.at(-1)
  //   const usdPrice = toUSD(currentPrice!.adjusted_close, element!.currency, currentPrice!.date, currData)
  //   element!.market_cap = Math.round(usdPrice * element!.shares)
  //   const el = {
  //     ...element,
  //     name: String(element!.name),
  //     symbol: element!.symbol
  //   }
  //   try {
  //     await db.insert(stocks_info).values(el)
  //   } catch (err) {
  //     errors.push(err)
  //   }//
  // }

  // const indexName = 'video-75';
  // const nameForSQL = `"${indexName}"`;
  const dataSharesOutstanding = (await db
    .select()
    .from(stocks_info)
     ) as StocksInfo[];
    // .where(isNull(stocks_info.is_delisted))) as StocksInfo[];
  const currData = (await db.select().from(currencies)) as CurrenciesPrice[];
  // const oldAdjustments = await db
  //   .select()
  //   .from(adjustments)
  //   .where(eq(adjustments.index, indexName))
  //   .orderBy(adjustments.date);
  // const divs = (await db.select().from(dividents)) as DividentsDB[];
  const dataDivs = await getDividentsFromDB();

  // const indexPrices = await getIndexPrices(dataSharesOutstanding, currData, '2022-12-28')
  // await csv.writeJSON('indexPrices', indexPrices)
  // const indexPrices = (await csv.readJSON('indexPrices')) as DataPrices[];


  // -------------------- DIVIDENTS -------------------
  // const divs = await csv.readJSON('dividents')
  // const divsForDB: {date: Date, dividents: any}[] = Object.keys(divs).map(date => {
  //   return {date: new Date(date), dividents: divs[date]}
  // })

  // await db.delete(dividents)
  // await db.insert(dividents).values(divsForDB)
  // ---------------------------------------------------------------------
  
  // const indexHistory = getIndexHistory2(indexPrices, oldAdjustments, dataDivs, indexName)

  // ================= export data as CSV for manual checking ===================
  // const res = getAllDataAsCSV(indexPrices, divs, oldAdjustments)

  // const stocks = (await db.select().from(stocks_info)) as DataSharesOutstanding[];


  // const splits = await getSplits(dataSharesOutstanding, '2023-06-01')
  // const splits = await csv.readJSON('splits')
  // const stocksForCheck: Array<string> = splits.map((el: {symbol: string}) => el.symbol)
  // const splitsStocks = await db.select().from(stocks_info).where(inArray(stocks_info.symbol, stocksForCheck))
  // await csv.write('STOCKS_WITH_SPLITS', splitsStocks)
// =
// =
// =
// =
// =
// =
// =
// =


  // let result: any = {};
  // for (let i in indexNames) {
  //   const name = indexNames[i] as string;
  //   console.log(name);
  //   const oldAdjustments = await db
  //     .select()
  //     .from(adjustments)
  //     .where(eq(adjustments.index, name))
  //     .orderBy(adjustments.date);

  //   let dataSharesOutstandingFiltered = dataSharesOutstanding;
  //   if (name !== 'blue-chips-150' && name !== 'mid-small-cap-2000') {
  //     dataSharesOutstandingFiltered = dataSharesOutstandingFiltered.filter((stock) => {
  //       if (stock.indicies) return stock.indicies.includes(name);
  //       else return false;
  //     });
  //   }

  //   const dataForAdjustments = getDataForAdjustments(indexPrices) as any[]; //=========================================

  //   let dataForAdjustmentsFiltered = dataForAdjustments;
  //   if (name !== 'blue-chips-150' && name !== 'mid-small-cap-2000') {
  //     dataForAdjustmentsFiltered = dataForAdjustments.reduce((prev, curr) => {
  //       let filteredData: any = {};
  //       Object.keys(curr).forEach((symbol) => {
  //         if (symbol === 'date') filteredData[symbol] = curr[symbol]
  //         else  {
  //           const stockInfoIndex = dataSharesOutstandingFiltered.findIndex((stock) => stock.symbol === symbol);
  //           if (stockInfoIndex >= 0) {
  //             if (curr[symbol] !== 0) filteredData[symbol] = curr[symbol];
  //             // else console.log({symbol, date: curr.date})
  //           }
  //         } 
  //       });
  //       return [...prev, filteredData];
  //     }, []);
  //   }
  
  //   console.log(dataForAdjustmentsFiltered)
  //   const newAdjustments = getCapAdjustments(dataForAdjustmentsFiltered, dataSharesOutstandingFiltered, name);
  //   result[name] = newAdjustments;

  //   await db.delete(adjustments).where(eq(adjustments.index, name))
  //   await db.insert(adjustments).values(newAdjustments);
  // }
  // =
  // =
  // =
  // =
  // =
  // =
  // =

  // await db.delete(adjustments).where(eq(adjustments.index, indexName));

  // const res = await getDividents(stocks, currData, '2022-12-31');
  // const res = await initialSteps()

  // console.log(errors[0])

  // const resFromMainCollectingSharesOutstanding = await mainCollectingSharesOutstanding('JAKOTA_revised8', '2022-12-29')

  // const revised = await csv.read('addition_FINAL1')
  // // const revised_EOD = await csv.read('JAKOTA_revised_step1')
  // const total = revised.map((el: any) => {
  //   let newEl = {...el}
  //   newEl.indicies = JSON.parse(el.indicies)
  //   newEl.shares = Number(el.shares)
  //   return newEl
  // })

  // await csv.write('JAKOTA_revised8', total)

  //   async function processArrayInBatches(array: any) {
  //     console.log('initial', array.length)
  // let counter = 0
  //     const batchSize = 100;
  //     const totalBatches = Math.ceil(array.length / batchSize);

  //     for (let i = 0; i < totalBatches; i++) {
  //       const start = i * batchSize;
  //       const end = start + batchSize;
  //       const batch = array.slice(start, end);
  //       counter += batch.length

  //       await db.insert(stocks_info).values(batch)
  //       console.log(counter, 'done')
  //     }

  //     console.log('final', counter)
  //   }

  // await processArrayInBatches(total)

  // await db.delete(indicies)

  const res = [
    "type one of four api's [stocks-info, adjustments, indicies, dividents] followed by the name of the index you are interested in",
  ];
  return new Response(JSON.stringify(res), {
    status: 200,
    headers: {
      'Content-Type': 'text/json; charset=utf-8',
    },
  });
}
