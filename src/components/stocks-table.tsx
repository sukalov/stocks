import * as React from 'react';
import { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption } from './ui/table';
import axios from 'axios';
import { db } from '@/lib/db';
import { stocks_data } from '@/lib/db/schema';

// const { stocks } = JSON.parse(`{"stocks":{"AAPL":{"meta":{"symbol":"AAPL","interval":"1day","currency":"USD","exchange_timezone":"America/New_York","exchange":"NASDAQ","mic_code":"XNGS","type":"Common Stock"},"values":[{"datetime":"2023-07-03","open":"193.78000","high":"193.88000","low":"191.76250","close":"192.46001","volume":"30907450"},{"datetime":"2023-06-30","open":"191.63000","high":"194.48000","low":"191.25999","close":"193.97000","volume":"85069600"},{"datetime":"2023-06-29","open":"189.08000","high":"190.07001","low":"188.94000","close":"189.59000","volume":"46347300"},{"datetime":"2023-06-28","open":"187.92999","high":"189.89999","low":"187.60001","close":"189.25000","volume":"51216800"},{"datetime":"2023-06-27","open":"185.89000","high":"188.39000","low":"185.67000","close":"188.06000","volume":"50730800"},{"datetime":"2023-06-26","open":"186.83000","high":"188.05000","low":"185.23000","close":"185.27000","volume":"48088700"},{"datetime":"2023-06-23","open":"185.55000","high":"187.56000","low":"185.00999","close":"186.67999","volume":"53079300"},{"datetime":"2023-06-22","open":"183.74001","high":"187.05000","low":"183.67000","close":"187.00000","volume":"51245300"},{"datetime":"2023-06-21","open":"184.89999","high":"185.41000","low":"182.59000","close":"183.96001","volume":"49515700"},{"datetime":"2023-06-20","open":"184.41000","high":"186.10001","low":"184.41000","close":"185.00999","volume":"49799100"},{"datetime":"2023-06-16","open":"186.73000","high":"186.99001","low":"184.27000","close":"184.92000","volume":"101235600"},{"datetime":"2023-06-15","open":"183.96001","high":"186.52000","low":"183.78000","close":"186.00999","volume":"65433200"},{"datetime":"2023-06-14","open":"183.37000","high":"184.39000","low":"182.02000","close":"183.95000","volume":"57462900"},{"datetime":"2023-06-13","open":"182.80000","high":"184.14999","low":"182.44000","close":"183.31000","volume":"54929100"},{"datetime":"2023-06-12","open":"181.27000","high":"183.89000","low":"180.97000","close":"183.78999","volume":"54274900"},{"datetime":"2023-06-09","open":"181.50000","high":"182.23000","low":"180.63000","close":"180.96001","volume":"48870700"},{"datetime":"2023-06-08","open":"177.89999","high":"180.84000","low":"177.46001","close":"180.57001","volume":"50214900"},{"datetime":"2023-06-07","open":"178.44000","high":"181.21001","low":"177.32001","close":"177.82001","volume":"61944600"},{"datetime":"2023-06-06","open":"179.97000","high":"180.12000","low":"177.42999","close":"179.21001","volume":"64848400"},{"datetime":"2023-06-05","open":"182.63000","high":"184.95000","low":"178.03999","close":"179.58000","volume":"121946500"},{"datetime":"2023-06-02","open":"181.03000","high":"181.78000","low":"179.25999","close":"180.95000","volume":"61945900"},{"datetime":"2023-06-01","open":"177.70000","high":"180.12000","low":"176.92999","close":"180.09000","volume":"68901800"},{"datetime":"2023-05-31","open":"177.33000","high":"179.35001","low":"176.75999","close":"177.25000","volume":"99625300"},{"datetime":"2023-05-30","open":"176.96001","high":"178.99001","low":"176.57001","close":"177.30000","volume":"55964400"},{"datetime":"2023-05-26","open":"173.32001","high":"175.77000","low":"173.11000","close":"175.42999","volume":"54835000"},{"datetime":"2023-05-25","open":"172.41000","high":"173.89999","low":"171.69000","close":"172.99001","volume":"56058300"},{"datetime":"2023-05-24","open":"171.09000","high":"172.42000","low":"170.52000","close":"171.84000","volume":"45143500"},{"datetime":"2023-05-23","open":"173.13000","high":"173.38000","low":"171.28000","close":"171.56000","volume":"50747300"},{"datetime":"2023-05-22","open":"173.98000","high":"174.71001","low":"173.45000","close":"174.20000","volume":"43570900"},{"datetime":"2023-05-19","open":"176.39000","high":"176.39000","low":"174.94000","close":"175.16000","volume":"55772400"}],"status":"ok"},"QQQ":{"meta":{"symbol":"QQQ","interval":"1day","currency":"USD","exchange_timezone":"America/New_York","exchange":"NASDAQ","mic_code":"XNMS","type":"ETF"},"values":[{"datetime":"2023-07-03","open":"370.07001","high":"370.92999","low":"368.97000","close":"370.29001","volume":"19432862"},{"datetime":"2023-06-30","open":"367.54999","high":"370.48999","low":"367.23001","close":"369.42001","volume":"58668800"},{"datetime":"2023-06-29","open":"364.23999","high":"364.89001","low":"362.14001","close":"363.81000","volume":"46151000"},{"datetime":"2023-06-28","open":"361.98001","high":"366.51999","low":"361.89999","close":"364.54001","volume":"46498000"},{"datetime":"2023-06-27","open":"359.25000","high":"364.57001","low":"358.51001","close":"363.82999","volume":"49428100"},{"datetime":"2023-06-26","open":"362.00000","high":"364.84000","low":"357.59000","close":"357.67999","volume":"52685500"},{"datetime":"2023-06-23","open":"362.20999","high":"364.88000","low":"360.82001","close":"362.54001","volume":"48873900"},{"datetime":"2023-06-22","open":"360.63000","high":"366.32999","low":"360.22000","close":"366.17001","volume":"47603000"},{"datetime":"2023-06-21","open":"365.73999","high":"366.17999","low":"360.95999","close":"361.89999","volume":"53378300"},{"datetime":"2023-06-20","open":"365.95001","high":"368.32001","low":"363.89001","close":"366.89999","volume":"49204700"},{"datetime":"2023-06-16","open":"372.72000","high":"372.85001","low":"367.48001","close":"367.92999","volume":"80875900"},{"datetime":"2023-06-15","open":"364.60999","high":"371.76999","low":"363.98001","close":"370.26001","volume":"71138800"},{"datetime":"2023-06-14","open":"363.26999","high":"366.19000","low":"360.42001","close":"365.89999","volume":"69525600"},{"datetime":"2023-06-13","open":"363.29001","high":"364.10999","low":"360.03000","close":"363.26001","volume":"57097800"},{"datetime":"2023-06-12","open":"356.19000","high":"360.59000","low":"355.20001","close":"360.48999","volume":"44606500"},{"datetime":"2023-06-09","open":"354.63000","high":"357.66000","low":"353.03000","close":"354.50000","volume":"53155900"},{"datetime":"2023-06-08","open":"349.12000","high":"353.62000","low":"348.89001","close":"353.14999","volume":"47153900"},{"datetime":"2023-06-07","open":"355.13000","high":"357.12000","low":"348.17999","close":"348.82001","volume":"69225900"},{"datetime":"2023-06-06","open":"354.28000","high":"355.82001","low":"352.92999","close":"354.84000","volume":"41390400"},{"datetime":"2023-06-05","open":"354.42999","high":"357.50000","low":"353.85001","close":"354.89999","volume":"47266200"},{"datetime":"2023-06-02","open":"353.79999","high":"355.82999","low":"352.01001","close":"354.64999","volume":"53293500"},{"datetime":"2023-06-01","open":"347.73001","high":"353.35999","low":"346.66000","close":"352.01001","volume":"50488600"},{"datetime":"2023-05-31","open":"348.37000","high":"350.60001","low":"346.51001","close":"347.98999","volume":"65105400"},{"datetime":"2023-05-30","open":"352.70999","high":"353.92999","low":"348.53000","close":"349.98001","volume":"72652200"},{"datetime":"2023-05-26","open":"340.76001","high":"349.25000","low":"340.66000","close":"348.39999","volume":"63007000"},{"datetime":"2023-05-25","open":"339.14001","high":"341.01001","low":"336.67001","close":"339.72000","volume":"66862800"},{"datetime":"2023-05-24","open":"331.37000","high":"332.91000","low":"329.56000","close":"331.64999","volume":"62891200"},{"datetime":"2023-05-23","open":"335.89001","high":"337.06000","low":"333.00000","close":"333.35999","volume":"48216700"},{"datetime":"2023-05-22","open":"336.25000","high":"338.67001","low":"336.23999","close":"337.64001","volume":"43015900"},{"datetime":"2023-05-19","open":"337.48999","high":"338.20999","low":"335.42999","close":"336.51001","volume":"61462400"}],"status":"ok"}}}`)

const StocksTable: React.FC = async () => {
  // const [stocks, setStocks] = React.useState([])
  // const stocks = await axios.get('/api/stocksdata')
  // React.useEffect(() => {
  //   axios.get('/api/stocksdata').then(res => {
  //     console.log(res.data);
  //     setStocks(res.data)
  //     return res
  // })
  // },[])
  const stocks = await db.select().from(stocks_data);

  return (
    <div className="py-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Ticker</TableHead>
            <TableHead>Currency</TableHead>
            <TableHead>Exchange</TableHead>
            <TableHead>MIC</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Open</TableHead>
            <TableHead>Low</TableHead>
            <TableHead>High</TableHead>
            <TableHead>Close</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stocks.map((stock) => (
            <TableRow key={stock.id}>
              <TableCell className="font-medium">{stock.symbol}</TableCell>
              <TableCell>{stock.currency}</TableCell>
              <TableCell>{stock.exchange}</TableCell>
              <TableCell>{stock.mic}</TableCell>
              <TableCell>{stock.date?.toLocaleDateString()}</TableCell>
              <TableCell>{Math.round(Number(stock.open) * 100) / 100}</TableCell>
              <TableCell>{Math.round(Number(stock.low) * 100) / 100}</TableCell>
              <TableCell>{Math.round(Number(stock.high) * 100) / 100}</TableCell>
              <TableCell>{Math.round(Number(stock.close) * 100) / 100}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default StocksTable;
