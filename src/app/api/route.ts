import path from 'path';
import * as d3 from 'd3';
import get from '@/lib/get-from-eod';
import { csv } from '@/lib/read-write-csv';
import toUSD from '@/lib/translate-to-usd';
import { getInitialIndexDates, addMissingValues } from '@/lib/utils';

export async function GET(request: Request) {

  const getSharesOutstanding = async (
    data: Array<DataOnlySymbol>,
    indexName: string
  ): Promise<DataSharesOutstanding[]> => {
    const dataWithShares: Array<DataSharesOutstanding> = [];
    try {
      const requests = data.map((stock) => get.fundamentalAsync(stock.symbol));
      const responses = await Promise.all(requests);
      const errors = responses.filter((response: { ok: any }) => !response.ok);

      if (errors.length > 0) {
        throw errors.map((response: { statusText: string | undefined }) =>
          Error(response.statusText)
        );
      }

      const json = responses.map((response: { json: () => any }) =>
        response.json()
      );
      const result = (await Promise.all(json)) as Array<ResponseFundamental>;

      result.forEach((datum, i) => {
        const shares = datum.SharesStats.SharesOutstanding;
        const currency = datum.General.CurrencyCode
        dataWithShares.push({
          symbol: data[i]?.symbol ?? '',
          ...data[i],
          shares,
          currency
        });
      });
    } catch (error) {
      console.error(error);
    }
    csv.write(`${indexName}_step1`, dataWithShares);
    return dataWithShares;
  };

  const getInitialPrices = async (
    data: Array<DataSharesOutstanding>,
    startDate: string = '2022-12-29',
    indexName: string
  ) => {
    const newData: Array<DataInitialPrices> = [];
    try {
      const requests = data.map((stock) =>
        get.historicalAsync(stock.symbol, startDate)
      );
      const responses = await Promise.all(requests);
      const errors = responses.filter((response: { ok: any }) => !response.ok);

      if (errors.length > 0) {
        throw errors.map((response: { statusText: string | undefined }) =>
          Error(response.statusText)
        );
      }

      const json = responses.map((response: { json: () => any }) =>
        response.json()
      );
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
    } catch (error) {
      console.error(error);
    }
    csv.write(`${indexName}_step2`, newData);
    return newData;
  };

  const getCurrenencyPrices = async (
    currencies: Array<string> = ['KRW', 'JPY', 'TWD'],
    startDate: string = '2022-12-29'
  ) => {
    try {
      const requests = currencies.map((stock) =>
        get.historicalAsync(`${stock}.FOREX`, startDate)
      );
      const responses = await Promise.all(requests);
      const errors = responses.filter((response: { ok: any }) => !response.ok);

      if (errors.length > 0) {
        throw errors.map((response: { statusText: string | undefined }) =>
          Error(response.statusText)
        );
      }
      const json = responses.map((response: { json: () => any }) =>
        response.json()
      );
      const result = (await Promise.all(json)) as Array<ResponseHistorical[]>;

      const newData: any[] = [];

      result.forEach((data, i) => {
        data.forEach((day) => {
          const currencyName = currencies[i] ?? '';
          if (i === 0) {
            newData.push({
              date: day.date,
              [currencyName]: day.adjusted_close,
            });
          } else {
            const destinationIndex = newData.findIndex(
              (NDday) => NDday.date === day.date
            );
            newData[destinationIndex] = {
              ...newData[destinationIndex],
              [currencyName]: day.adjusted_close,
            };
          }
        });
      });

      csv.write('currencies', newData);
      return newData;
    } catch (error) {
      console.error(error);
    }
  };

  const getAdjustedShare = (
    data: DataSharesInitialDay[],
    currencies: any[],
    indexVolume: number = 25,
    indexName: string
  ) => {

    data.map((stock: DataSharesInitialDay, i: number) => {
      stock.initial_price_USD = toUSD(
        stock.initial_price,
        stock.currency,
        stock.initial_date,
        currencies
      );
      const initialMC =
        (Number(stock.initial_price_USD) * Number(stock.shares)) / 1000000;
      stock.initial_MC_USD = initialMC;
    });

    data.sort(
      (a: DataSharesInitialDay, b: DataSharesInitialDay) =>
        Number(b.initial_MC_USD) - Number(a.initial_MC_USD)
    ).splice(indexVolume)

    const totalMC = data.reduce((acc: number, current: DataSharesInitialDay) => {
      if (current.initial_MC_USD) return acc + current.initial_MC_USD
      else return acc
    }, 0);

    data.forEach((stock: DataSharesInitialDay, i: number) => {
      stock.share = Number(stock.initial_MC_USD) / totalMC
      stock.share_adj = Number(stock.initial_MC_USD) / totalMC
    })

    const dataCopy = JSON.parse(JSON.stringify(data)) as DataShareAdjusted[]
    let remainingSUM = totalMC
    data.forEach((stock, i: number) => {
      if (stock.share > 0.1) {
        stock.share_adj = 0.1
        const remains = stock.initial_MC_USD - (totalMC / 10) // то что надо раскидать по всем оставшимся акциям
        remainingSUM -= stock.initial_MC_USD
        stock.initial_MC_USD = totalMC / 10 
        data.forEach((el: DataSharesInitialDay, j: number) => {
          if (j > i) {
            const addition = (el.initial_MC_USD / remainingSUM) * remains
            el.initial_MC_USD = el.initial_MC_USD + addition
            el.share = el.initial_MC_USD / totalMC
          }
        })
      remainingSUM = remainingSUM + remains
      } else {
        stock.share_adj = stock.share
      }
    });

    data.forEach((stock, i) => {
      stock.initial_MC_USD = dataCopy[i]?.initial_MC_USD ?? 0
      stock.share = dataCopy[i]?.share ?? 0
    })

    csv.write(`${indexName}_share`, data)

    return data;
  };

  const getIndexHistory = async (data: DataShareAdjusted[], currencies: CurrenciesPrice[], startDate: string = '2022-12-29', indexName: string = 'kpop') => {
    try {
      const requests = data.map((stock) =>
        get.historicalAsync(stock.symbol, startDate)
      );
      const responses = await Promise.all(requests);
      const errors = responses.filter((response: Response) => !response.ok);

      if (errors.length > 0) {
        throw errors.map((response: Response) =>
          Error(response.statusText)
        );
      }
      const json = responses.map((response: Response) =>
        response.json()
      );
      const result = (await Promise.all(json)) as Array<ResponseHistorical[]>;

      const indexHistory = JSON.parse(JSON.stringify(currencies)) as IndexDay[]

      result.forEach((stockHistory: ResponseHistorical[], i: number) => {
        stockHistory.forEach(day => {
          const destinationIndex = indexHistory.findIndex((row) => row.date === day.date);
          indexHistory[destinationIndex] = {
            ...indexHistory[destinationIndex],
            date: indexHistory[destinationIndex]?.date || '',
            [String(data[i]?.symbol)]: day.adjusted_close,
          }
        });
      });

      indexHistory.forEach(
        (day: IndexDay, i: number) => {
          let sharePriceUSD = 0;
          data.forEach((stock: DataShareAdjusted) => {
            const stockPrice = (day[stock.symbol] * stock.share_adj);
            const stockPriceUSD = toUSD(stockPrice, stock.currency, day.date, currencies) 
            sharePriceUSD += stockPriceUSD;
          });
          day.share_price_usd = sharePriceUSD;
          day[indexName] = sharePriceUSD / Number(indexHistory[0]?.share_price_usd);
        }
      );

      const completeData = addMissingValues(indexHistory)
      csv.write(`${indexName}_index`, completeData)

      return completeData
    } catch (error) {
      console.error(error);
    }
  };

  const mainCollectingSharesOutstanding = async (symbolsFileName: string, startDate: string) => {
    const dataOnlySymbol = (await csv.read(symbolsFileName)) as DataOnlySymbol[];
    const dataSharesOutstanding = (await getSharesOutstanding(dataOnlySymbol, symbolsFileName)) as DataSharesOutstanding[];
    const dataInitialPrices = (await getInitialPrices(dataSharesOutstanding, startDate, symbolsFileName)) as DataSharesInitialDay[];
    const currencies = (await getCurrenencyPrices(['KRW', 'JPY', 'TWD'], startDate)) as CurrenciesPrice[];
    const dataAdjustedShare = getAdjustedShare(dataInitialPrices, currencies, 25, symbolsFileName) as DataShareAdjusted[];
    const dataIndexHistory = (await getIndexHistory(dataAdjustedShare, currencies, startDate, symbolsFileName))
    return dataIndexHistory
  }

    const mainWIthGivenSharesOutstanding = async (symbolsFileName: string, startDate: string) => {
    const dataSharesOutstanding = (await csv.read(`${symbolsFileName}_step1`)) as DataSharesOutstanding[];
    const dataInitialPrices = (await getInitialPrices(dataSharesOutstanding, startDate, symbolsFileName)) as DataSharesInitialDay[];
    const currencies = (await getCurrenencyPrices(['KRW', 'JPY', 'TWD'], startDate)) as CurrenciesPrice[];
    const dataAdjustedShare = getAdjustedShare(dataInitialPrices, currencies, 25, symbolsFileName) as DataShareAdjusted[];
    const dataIndexHistory = (await getIndexHistory(dataAdjustedShare, currencies, startDate, symbolsFileName))
    return dataIndexHistory
  }

  // const res = await getSharesOutstanding(dataOnlySymbol);
  // const res = await getInitialPrices(dataOnlySymbol)
  // const res = await getCurrenencyPrices();
  // const res = getAdjustedShare(dataSharesInitialDay, currenciesData);
  // const res = await getIndexHistory(dataShareAdjusted, currenciesData)
  // const res = getInitialIndexDates()

  const res = await mainWIthGivenSharesOutstanding('kpop', '2022-12-29')

  return new Response(JSON.stringify(res), {
    status: 200,
  });
}
