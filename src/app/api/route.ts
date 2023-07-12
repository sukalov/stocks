import getDataFromEOD from "@/lib/getDataFromEOD"
import csv from "csv-parser";
import path from 'path';
import * as d3 from 'd3';
import { promises as fs } from 'fs';
import axios from "axios";
import * as objToCsv from 'objects-to-csv'

export async function GET(request: Request) {

  const csvDir = path.join(process.cwd(), 'src/data/csv');
  const fileContents = await fs.readFile(csvDir + '/kpop.csv', 'utf8');
  const data = d3.csvParse(fileContents)
  const url = 'https://app.finalyzing.com/api/v1/fundamental?q=';

//   for (let i = 0; i < data.length; i++) {
//     const stock = data[i];
//     const res = await axios.get(`${url}${stock.Symbol}`)
//     stock.shares = res.data.SharesStats.SharesOutstanding
// }

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

data.reduce(
  (accumulator, current) => {
    return accumulator.push(current)
  }
  ,[])

    return new Response(JSON.stringify(data), {
      status: 200,
    })
};
