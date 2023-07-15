import 'server-only'

const url = "https://eodhistoricaldata.com/api/eod/"

const fundamental = async (symbol: string) => {
    const res = await fetch(`${url}${symbol}?api_token=${process.env.EOD_API_KEY}&fmt=json`)
    if (!res.ok) throw new Error('failed to fetch data from EOD')
    return await res.json();
}

const historical = async (symbol: string, startDate?: string ) => {
    const from = `&from=${startDate}` ?? ''
    const res = await fetch(`${url}${symbol}?api_token=${process.env.EOD_API_KEY}${from}&fmt=json`)
    if (!res.ok) throw new Error('failed to fetch data from EOD')
    return await res.json();
}

const fundamentalAsync = async (symbol: string): Promise<Response>  => {
    const res = await fetch(`${url}${symbol}?api_token=${process.env.EOD_API_KEY}&fmt=json`)
    if (!res.ok) throw new Error('failed to fetch data from EOD')
    return res
}

const historicalAsync = async (symbol: string, startDate?: string ): Promise<Response> => {
    const from = `&from=${startDate}` ?? ''
    const res = await fetch(`${url}${symbol}?api_token=${process.env.EOD_API_KEY}${from}&fmt=json`)
    if (!res.ok) throw new Error('failed to fetch data from EOD')
    return res
}
 
export const get = {
    historical,
    historicalAsync,
    fundamental,
    fundamentalAsync
}