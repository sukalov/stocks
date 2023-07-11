import 'server-only'

interface EODProps {
    symbol: string;
    from?: string;
}

const url = "https://eodhistoricaldata.com/api/eod/"

const getDataFromEOD = async (props: EODProps) => {
    const from = props.from || ''
    const res = await fetch(`${url}${props.symbol}?api_token=${process.env.EOD_API_KEY}&${from}&fmt=json`)
    if (!res.ok) throw new Error('failed to fetch data from EOD')
    return res.json;
}
 
export default getDataFromEOD;