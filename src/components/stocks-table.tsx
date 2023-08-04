import * as React from 'react';
import { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption } from './ui/table';
import axios from 'axios';
import { db } from '@/lib/db';
import { stocks_info } from '@/lib/db/schema';

const StocksTable: React.FC = async () => {
  const stocks = await db.select().from(stocks_info).orderBy(stocks_info.indicies)
  return (
    <div className="py-4">
      <Table>
        <TableHeader>
          <TableRow>
            {/* <TableHead className="w-[100px]">Ticker</TableHead> */}
            <TableHead className="w-[100px]">Name</TableHead>
            <TableHead>Symbol </TableHead>
            <TableHead>Country</TableHead>
            <TableHead>Currency</TableHead>
            <TableHead>Shares </TableHead>
            <TableHead>Cap Index</TableHead>
            <TableHead className="w-[200px]">Indicies</TableHead>

          </TableRow>
        </TableHeader>
        <TableBody>
          {stocks.map((stock) => (
            <TableRow key={stock.id}>
              <TableCell>{stock.name}</TableCell>
              <TableCell className='font-bold'>{stock.symbol}</TableCell>
              <TableCell>{stock.country}</TableCell>
              <TableCell>{stock.currency}</TableCell>
              <TableCell>{stock.shares}</TableCell>
              <TableCell>{stock.cap_index}</TableCell>
              <TableCell>{stock.indicies.join(', ')}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default StocksTable;
