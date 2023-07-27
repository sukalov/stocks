import StocksTable from '@/components/stocks-table';
import { db } from '@/lib/db';
import { stocks_data, stocks_info } from '@/lib/db/schema';

export default function StocksInfo() {
  const data = db.select().from(stocks_info);
  return <StocksTable />;
}
