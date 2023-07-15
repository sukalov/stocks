import "server-only";

const url = "https://eodhistoricaldata.com/api/eod/";

const getFundamental = async (symbol: string) => {
  const res = await fetch(
    `${url}${symbol}?api_token=${process.env.EOD_API_KEY}&fmt=json`,
  );
  if (!res.ok) throw new Error("failed to fetch data from EOD");
  return await res.json();
};

const getHistorical = async (symbol: string, startDate?: string) => {
  const from = `&from=${startDate}` ?? "";
  const res = await fetch(
    `${url}${symbol}?api_token=${process.env.EOD_API_KEY}${from}&fmt=json`,
  );
  if (!res.ok) throw new Error("failed to fetch data from EOD");
  return await res.json();
};

const getFundamentalAsync = async (symbol: string): Promise<Response> => {
  const res = await fetch(
    `${url}${symbol}?api_token=${process.env.EOD_API_KEY}&fmt=json`,
  );
  if (!res.ok) throw new Error("failed to fetch data from EOD");
  return await res.json();
};

const getHistoricalAsync = async (
  symbol: string,
  startDate?: string,
): Promise<Response> => {
  const from = `&from=${startDate}` ?? "";
  const res = await fetch(
    `${url}${symbol}?api_token=${process.env.EOD_API_KEY}${from}&fmt=json`,
  );
  if (!res.ok) throw new Error("failed to fetch data from EOD");
  return res;
};

export const gets = {
  getHistorical,
  getFundamental,
};
