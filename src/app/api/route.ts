import path from 'path';
import * as d3 from 'd3';
// import { promises as fs } from 'fs';
import axios from 'axios';
import get from '@/lib/get-from-eod';
import { csv } from '@/lib/read-write-csv';
import { inspect } from 'eyes';
import toUSD from '@/lib/translate-to-usd';
import { Share } from 'next/font/google';
import { LucideAlignVerticalSpaceAround } from 'lucide-react';

export async function GET(request: Request) {
  const dataOnlySymbol = (await csv.read(
    'kpop_shares_new'
  )) as DataOnlySymbol[];
  const dataSharesInitialDay = (await csv.read(
    'kpop_shares_initial'
  )) as DataSharesInitialDay[];
  const currenciesData = await csv.read('currencies');

  const getSharesOutstanding = async (
    data: Array<DataOnlySymbol>
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
        dataWithShares.push({
          symbol: data[i]?.symbol ?? '',
          ...data[i],
          shares,
        });
      });
    } catch (error) {
      console.error(error);
    }
    csv.write('kpop-shares', dataWithShares);
    return dataWithShares;
  };

  const getInitialPrices = async (
    data: Array<DataOnlySymbol>,
    startDate: string = '2022-12-29'
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
        });
      });
    } catch (error) {
      console.error(error);
    }
    csv.write('kpop_shares_initial.csv', newData);
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
    indexVolume: number = 25
  ) => {
    const startingDateIndex = currencies.findIndex(
      (day) => day.date === dataSharesInitialDay[0]?.initial_date
    );

    data.map((stock: DataSharesInitialDay, i: number) => {
      stock.initial_price_USD = toUSD(
        stock.initial_price,
        stock.country,
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

    const totalMC = data.reduce((acc, current) => acc + current.initial_MC_USD, 0);

    data.forEach((stock: DataSharesInitialDay, i: number) => {
      stock.share = Number(stock.initial_MC_USD) / totalMC
    });

    const dataCopy = JSON.parse(JSON.stringify(data))
    let remainingSUM = totalMC
    data.forEach((stock: DataSharesInitialDay, i: number) => {
      console.log(remainingSUM)
      if (stock.share > 0.1) {
        stock.share_adj = 0.1
        const remains = stock.initial_MC_USD - (totalMC / 10) // то что надо раскидать по всем оставшимся акциям
        remainingSUM -= stock.initial_MC_USD
        stock.initial_MC_USD = totalMC / 10 
        let percent = 0
        data.forEach((el: DataSharesInitialDay, j: number) => {
          if (j > i) {
            // if (j === 10) console.log({'1-----': el.initial_MC_USD, elshare: el.share, remains})
            const addition = (el.initial_MC_USD / remainingSUM) * remains
            percent += el.initial_MC_USD / remainingSUM
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
      stock.initial_MC_USD = dataCopy[i].initial_MC_USD
      stock.share = dataCopy[i].share
    })
    csv.write('kpop-test', data)

    return data;
  };

  const getIndexHistory = async () => {
    try {
      const requests = data.map((stock: { Symbol: any }) =>
        fetch(`${url3}${stock.Symbol}${url3_2}`)
      );
      const responses = await Promise.all(requests);
      const errors = responses.filter((response: { ok: any }) => !response.ok);

      if (errors.length > 0) {
        errors.map((response: { statusText: any }) =>
          console.log(response.statusText)
        );
      }

      const json = responses.map((response: { json: () => any }) =>
        response.json()
      );
      const result = await Promise.all(json);

      result.forEach((datum: any[], i: string | number) => {
        let start = datum.findIndex(
          (el: { date: string }) => el.date === '2022-12-30'
        );
        if ((start = -1))
          start = datum.findIndex(
            (el: { date: string }) => el.date === '2022-12-29'
          );
        datum.splice(0, start);
        datum.forEach((day: { date: any; adjusted_close: any }) => {
          const destinationIndex = currencyExchanges.findIndex(
            (row: { date: any }) => row.date === day.date
          );
          currencyExchanges[destinationIndex][String(data[i].Symbol)] =
            day.adjusted_close;
        });
      });

      currencyExchanges.forEach(
        (day: { [x: string]: any; KRW: any }, i: string | number) => {
          let sharePriceUSD = 0;
          data.forEach((stock: { Symbol: any; SHARE: any }) => {
            const stockPriceKRW =
              (Number(day[String(stock.Symbol)]) * Number(stock.SHARE)) / 100;
            const stockPriceUSD = stockPriceKRW / Number(day.KRW);
            sharePriceUSD += stockPriceUSD;
          });
          currencyExchanges[i].share_price_usd = String(sharePriceUSD);
          currencyExchanges[i].KPOP_INDEX = String(
            (sharePriceUSD / Number(currencyExchanges[0].share_price_usd)) * 100
          );
        }
      );
    } catch (error) {
      console.error(error);
    }

    return csvContent;
  };

  // const res = await getSharesOutstanding(dataOnlySymbol);
  // const res = await getInitialPrices(dataOnlySymbol)
  // const res = await getCurrenencyPrices();
  const res = getAdjustedShare(dataSharesInitialDay, currenciesData);
  // const res = await getIndexHistory(theData)

  return new Response(JSON.stringify(res), {
    status: 200,
  });
}
