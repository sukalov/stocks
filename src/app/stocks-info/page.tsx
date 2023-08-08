import { StockInfo } from "@/components/data-table";
import { StocksInfoTable } from "@/components/stocks-info-table";
import { db } from '@/lib/db';
import { stocks_info } from '@/lib/db/schema';

export default async function MarketData() {
  const stocks = await db.select().from(stocks_info).orderBy(stocks_info.indicies) as StockInfo[]
  return (
    <div className="mb-16">
      <StocksInfoTable data={stocks} />
    </div>
  );
}
