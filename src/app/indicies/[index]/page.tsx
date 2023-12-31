'use client';

import { LineChartProps, Overview } from '@/components/overview';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

export default function KpopIndex() {
  const pathname = usePathname();
  const indexName = pathname.split('/')[2] ?? '';
  const [data, setData] = useState<LineChartProps[]>([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/indicies/${indexName}`)
      .then((res) => res.json() as Promise<IndexDay[]>)
      .then((data) => {
        setData(
          data.map((el: IndexDay) => {
            const date = new Date(el.date);
            const date2 = date.toISOString().slice(0, 10);
            return {
              name: date2,
              index: Number(el.index).toFixed(2),
              total_return: Number(el.total_return).toFixed(2),
            };
          })
        );
        setLoading(false);
      });
  }, [indexName]);

  if (isLoading)
    return (
      <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-between py-8  min-w-screen">
        <Skeleton className="w-full h-full" />
      </div>
    );
  if (!data) return <p>No data</p>;

  return (
    <div className="py-8 -ml-12">
      <Overview data={data} indexName={indexName} />
    </div>
  );
}
