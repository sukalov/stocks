import { error } from 'console';
import 'server-only';

const url_eod = 'https://eodhistoricaldata.com/api/eod/';
const url_fundamental = 'https://eodhistoricaldata.com/api/fundamentals/';
const url_div = 'https://eodhistoricaldata.com/api/div/';
const url_splits = 'https://eodhistoricaldata.com/api/splits/';

const fundamental = async (symbol: string): Promise<ResponseFundamental> => {
  const link = `${url_fundamental}${symbol}?api_token=${process.env.EOD_API_KEY}&fmt=json`;
  const res = await fetch(link);
  if (!res.ok) throw new Error(res.url);
  return (await res.json()) as ResponseFundamental;
};

const historical = async (symbol: string, startDate?: string, endDate?: string): Promise<ResponseHistorical> => {
  const from = startDate !== undefined ? `&from=${startDate}` : '';
  const to = endDate !== undefined ? `&to=${endDate}` : '';
  const link = `${url_eod}${symbol}?api_token=${process.env.EOD_API_KEY}${from}${to}&fmt=json`;
  const res = await fetch(link);
  if (!res.ok) throw new Error(res.url);
  return (await res.json()) as ResponseHistorical;
};

const fundamentalAsync = async (symbol: string): Promise<Response> => {
  const res = await fetch(`${url_fundamental}${symbol}?api_token=${process.env.EOD_API_KEY}&fmt=json`);
  if (!res.ok) throw new Error(res.url);
  return res;
};

const historicalAsync = async (symbol: string, startDate?: string): Promise<Response> => {
  const from = `&from=${startDate}` ?? '';
  const string = `${url_eod}${symbol}?api_token=${process.env.EOD_API_KEY}${from}&fmt=json`;
  const res = await fetch(string);
  if (!res.ok) throw new Error(res.url);
  return res;
};

const dividentsAsync = async (symbol: string, startDate?: string): Promise<Response> => {
  const from = `&from=${startDate}` ?? '';
  const res = await fetch(`${url_div}${symbol}?api_token=${process.env.EOD_API_KEY}${from}&fmt=json`);
  if (!res.ok) throw new Error(JSON.stringify(res.statusText));
  return res;
};

const splitsAsync = async (symbol: string, startDate?: string): Promise<Response> => {
  const from = `&from=${startDate}` ?? '';
  const res = await fetch(`${url_splits}${symbol}?api_token=${process.env.EOD_API_KEY}${from}&fmt=json`);
  if (!res.ok) throw new Error(JSON.stringify(res.statusText));
  return res;
};

export default {
  historical,
  historicalAsync,
  fundamental,
  fundamentalAsync,
  dividentsAsync,
  splitsAsync,
};
