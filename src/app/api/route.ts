import path from 'path';
import * as d3 from 'd3';
// import { promises as fs } from 'fs';
import axios from 'axios';
import get from '@/lib/get-from-eod';
import { csv } from '@/lib/read-write-csv';
import { inspect } from 'eyes';
import toUSD from '@/lib/translate-to-usd';

export async function GET(request: Request) {
  const dataOnlySymbol = (await csv.read('kpop')) as DataOnlySymbol[];
  const currenciesData = await csv.read('currencies')

  const getSharesOutstanding = async (
    data: Array<DataOnlySymbol>
  ): Promise<DataSharesOutstanding[]> => {
    const dataWithShares: Array<DataSharesOutstanding> = [];
    try {
      const requests = data.map((stock) => get.fundamentalAsync(stock.symbol));
      const responses = await Promise.all(requests);
      const errors = responses.filter((response: { ok: any; }) => !response.ok);

      if (errors.length > 0) {
        throw errors.map((response: { statusText: string | undefined; }) => Error(response.statusText));
      }

      const json = responses.map((response: { json: () => any; }) => response.json());
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
    csv.write('kpop-shares', dataWithShares)
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
      const errors = responses.filter((response: { ok: any; }) => !response.ok);

      if (errors.length > 0) {
        throw errors.map((response: { statusText: string | undefined; }) => Error(response.statusText));
      }

      const json = responses.map((response: { json: () => any; }) => response.json());
      const result = (await Promise.all(json)) as Array<ResponseHistorical[]>;

      result.forEach((datum, i) => {
        newData.push({
          ...data[i],
          starting_date: startDate,
          initial_price: datum[0]?.adjusted_close ?? 0,
          symbol: data[i]?.symbol ?? '',
        });
      });
    } catch (error) {
      console.error(error);
    }

    return newData;
  };

  const getCurrenencyPrices = async (
    currencies: Array<string>,
    startDate: string = '2022-12-29'
  ) => {
    try {
      const requests = currencies.map((stock) =>
        get.historicalAsync(`${stock}.FOREX`, startDate)
      );
      const responses = await Promise.all(requests);
      const errors = responses.filter((response: { ok: any; }) => !response.ok);

      if (errors.length > 0) {
        throw errors.map((response: { statusText: string | undefined; }) => Error(response.statusText));
      }
      const json = responses.map((response: { json: () => any; }) => response.json());
      const result = (await Promise.all(json)) as Array<ResponseHistorical[]>;

      const newData: any[] = [];

      result.forEach((data, i) => {
        data.forEach((day) => {
          const currencyName = currencies[i] ?? ''
          if (i === 0) {
            newData.push({
              date: day.date,
              [currencyName]: day.adjusted_close
            });
          } else {
            const destinationIndex = newData.findIndex(NDday => NDday.date === day.date)
            newData[destinationIndex] = {...newData[destinationIndex], [currencyName]: day.adjusted_close}
          }
        });
      });

      csv.write('currencies', newData);
      return newData;
    } catch (error) {
      console.error(error);
    }
  };

  const getAdjustedShare = (data: DataSharesInitialDay[], ) => {
    const KRW = currencyExchanges[0].KRW;
    let initialMCSUM = 0;
    data.forEach(
      (stock: { initialPrice_1jan2023: any }, i: number) => {
        data[i].initialPrice_USD = String(
          Number(stock.initialPrice_1jan2023) / Number(KRW)
        );
        const initialMC =
          (Number(data[i].initialPrice_USD) * Number(data[i].shares)) / 1000000;
        initialMCSUM += initialMC;
        data[i].initialMC = String(initialMC);
        data[i].initialMC_Adjusted = String(initialMC);
      }
    );
    const tenPercentInitialMC = initialMCSUM / 10;

    data
      .sort(
        (a: { initialMC: any }, b: { initialMC: any }) =>
          Number(a.initialMC) - Number(b.initialMC)
      )
      .reverse();

    data.forEach((stock: { initialMC_Adjusted: any }, i: number) => {
      if (Number(stock.initialMC_Adjusted) > tenPercentInitialMC) {
        const remain =
          (Number(stock.initialMC_Adjusted) - tenPercentInitialMC) /
          (data.length - (1 + i));
        data.forEach((el: any, j: number) => {
          if (j > i)
            data[j].initialMC_Adjusted = String(
              Number(data[j].initialMC_Adjusted) + remain
            );
          data[i].initialMC_Adjusted = String(tenPercentInitialMC);
          data[i].SHARE = '10';
        });
      } else {
        data[i].SHARE_ADJ = String(
          (Number(data[i].initialMC_Adjusted) / initialMCSUM) * 100
        );
      }
    });

    const newData: Array<any> = data.reduce(
      (
        acc: unknown[][],
        current: { [s: string]: unknown } | ArrayLike<unknown>,
        i: number
      ) => {
        if (i === 0) acc.push(Object.keys(current));
        if (Object.values(current)) acc.push(Object.values(current));
        return acc;
      },
      []
    );

    let csvContent = '';
    newData.forEach((row) => {
      csvContent += row.join(',') + '\n';
    });

    fs.writeFile(csvDir + 'kpop_adjShare.csv', csvContent, 'utf-8');
    return csvContent;
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

  const res = await getSharesOutstanding(dataOnlySymbol);
  // const res = await getInitialPrices(theData)
  // const res = await getCurrenencyPrices(['KRW', 'JPY', 'TWD']);
  // const res = await getAdjustedShare(theData)
  // const res = await getIndexHistory(theData)

  return new Response(JSON.stringify(res), {
    status: 200,
  });
}
