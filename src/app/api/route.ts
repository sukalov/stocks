import getDataFromEOD from "@/lib/get-data-from-eod"
import path from 'path';
import * as d3 from 'd3';
import { promises as fs } from 'fs';
import axios from "axios";

export async function GET(request: Request) {

  const file = 'kpop_adjShare'
  const csvDir = path.join(process.cwd(), 'src/data/csv/');
  const dataFile = await fs.readFile(csvDir + file + '.csv', 'utf8');
  const currencyFile = await fs.readFile(csvDir + 'KRW_price.csv', 'utf8');
  const currencyExchanges = d3.csvParse(currencyFile)
  let data = d3.csvParse(dataFile)
  const url = 'https://app.finalyzing.com/api/v1/fundamental?q=';
  const url2 = 'https://app.finalyzing.com/api/v1/historical?&q='
  const url3 = 'https://eodhistoricaldata.com/api/eod/'
  const url3_2 = `?api_token=${process.env.EOD_API_KEY}&fmt=json`

const getSharesOutstanding = async () => {
  try {
    const requests = data.map((stock) => fetch(`${url}${stock.Symbol}`));
    const responses = await Promise.all(requests);
    const errors = responses.filter((response) => !response.ok);

    if (errors.length > 0) {
      throw errors.map((response) => Error(response.statusText));
    }

    const json = responses.map((response) => response.json());
    const result = await Promise.all(json);

    result.forEach((datum, i) => data[i].shares = datum.SharesStats.SharesOutstanding);
  }
  catch (error) {
    console.error(error);
  }

  const newData: Array<any> = data.reduce(
    (acc, current, i) => {
      if (i === 0) acc.push(Object.keys(current))
      if (Object.values(current)) acc.push(Object.values(current))
      return acc
    }
    ,[])

    let csvContent = ''
    newData.forEach(row => {
      csvContent += row.join(',') + '\n'
    })

    fs.writeFile(csvDir + file + '_shares.csv', csvContent, 'utf-8')

    return(csvContent)
}

const getInitialPrices = async () => {
  try {
    const requests = data.map((stock) => fetch(`${url2}${stock.Symbol}`));
    const responses = await Promise.all(requests);
    const errors = responses.filter((response) => !response.ok);

    if (errors.length > 0) {
      throw errors.map((response) => Error(response.statusText));
    }

    const json = responses.map((response) => response.json());
    const result = await Promise.all(json);

    result.forEach((datum, i) => {
      const firstJanIndex = datum.findIndex(day => day.Date === 1672272000000)
      datum.splice(0, firstJanIndex)
      data[i]['initialPrice_1jan2023'] = datum[0].Close
    });
  }
  catch (error) {
    console.error(error);
  }

  const newData: Array<any> = data.reduce(
    (acc, current, i) => {
      if (i === 0) acc.push(Object.keys(current))
      if (Object.values(current)) acc.push(Object.values(current))
      return acc
    }
    ,[])

    let csvContent = ''
    newData.forEach(row => {
      csvContent += row.join(',') + '\n'
    })

    fs.writeFile(csvDir + 'kpop_shares_initialPrice.csv', csvContent, 'utf-8')

  return csvContent
}

const getCurrenencyPrices = async () => {
  const req = await fetch(`${url2}KRW.FOREX`)
  const res = await req.json()
  const firstJanIndex = res.findIndex((day) => day.Date === 1672358400000)
  res.splice(0, firstJanIndex)
  const newData = res.map(obj => {
    const date = new Date(obj.Date)
    const iso = date.toISOString().replace('T00:00:00.000Z', '')
    return `${iso},${String(obj.Close)}`
  })
  const completeCSV = 'date,TWD\n' + newData.join('\n')
  fs.writeFile(csvDir + 'KRW_price.csv', completeCSV, 'utf-8')
  return completeCSV
}

const getAdjustedShare = () => {
  const KRW = currencyExchanges[0].KRW
  let initialMCSUM = 0
  data.forEach((stock, i) => {
    data[i].initialPrice_USD = String(Number(stock.initialPrice_1jan2023) / Number(KRW))
    const initialMC = Number(data[i].initialPrice_USD) * Number(data[i].shares) / 1000000
    initialMCSUM += initialMC
    data[i].initialMC = String(initialMC)
    data[i].initialMC_Adjusted = String(initialMC)
  })
  const tenPercentInitialMC = initialMCSUM / 10

  data.sort((a, b) => Number(a.initialMC) - Number(b.initialMC)).reverse()

  data.forEach((stock, i) => {
    if (Number(stock.initialMC_Adjusted) > tenPercentInitialMC) {
      const remain = (Number(stock.initialMC_Adjusted) - tenPercentInitialMC) / (data.length - (1 + i))
      data.forEach((el, j) => {
        if (j > i)  data[j].initialMC_Adjusted = String(Number(data[j].initialMC_Adjusted) + remain)
        data[i].initialMC_Adjusted = String(tenPercentInitialMC)
        data[i].SHARE = '10'
      }) 
      } else {
        data[i].SHARE_ADJ = String(Number(data[i].initialMC_Adjusted) / initialMCSUM * 100)
    }
  })

  const newData: Array<any> = data.reduce(
    (acc, current, i) => {
      if (i === 0) acc.push(Object.keys(current))
      if (Object.values(current)) acc.push(Object.values(current))
      return acc
    }
    ,[])

    let csvContent = ''
    newData.forEach(row => {
      csvContent += row.join(',') + '\n'
    })

    fs.writeFile(csvDir + 'kpop_adjShare.csv', csvContent, 'utf-8')
    return csvContent
}

const getIndexHistory = async () => {
  console.log(url3)

  try {
    const requests = data.map((stock) => fetch(`${url3}${stock.Symbol}${url3_2}`));
    const responses = await Promise.all(requests);
    const errors = responses.filter((response) => !response.ok);

    if (errors.length > 0) {
      throw errors.map((response) => Error(response.statusText));
    }

    const json = responses.map((response) => response.json());
    const result = await Promise.all(json);

    result.forEach((datum, i) => {
      let start = datum.findIndex(el => el.date === '2022-12-30')
      if (start = -1) start = datum.findIndex(el => el.date === '2022-12-29')
      datum.splice(0, start)
      datum.forEach(day => {
        const destinationIndex = currencyExchanges.findIndex(row => row.date === day.date)
        currencyExchanges[destinationIndex][String(data[i].Symbol)] = day.adjusted_close 
      })
    });

    currencyExchanges.forEach((day, i) => {
      let sharePriceUSD = 0
      data.forEach(stock => {
        const stockPriceKRW = Number(day[String(stock.Symbol)]) * Number(stock.SHARE) / 100
        const stockPriceUSD = stockPriceKRW / Number(day.KRW)
        sharePriceUSD += stockPriceUSD
      })
      currencyExchanges[i].share_price_usd = String(sharePriceUSD)
      currencyExchanges[i].KPOP_INDEX = String(sharePriceUSD / Number(currencyExchanges[0].share_price_usd) * 100)
    })
  }
  catch (error) {
    console.error(error);
  }

  const newData: Array<any> = currencyExchanges.reduce(
    (acc, current, i) => {
      if (i === 0) acc.push(Object.keys(current))
      if (Object.values(current)) acc.push(Object.values(current))
      return acc
    }
    ,[])

    let csvContent = ''
    newData.forEach(row => {
      csvContent += row.join(',') + '\n'
    })

    fs.writeFile(csvDir + 'kpop_index.csv', csvContent, 'utf-8')

  return csvContent
}

// const csv = await getSharesOutstanding()
// const csv = await getInitialPrices()
// const csv = await getCurrenencyPrices()
// const csv = await getAdjustedShare()
const res = await getIndexHistory()

    return new Response(JSON.stringify(currencyExchanges), {
      status: 200,
    })
};
