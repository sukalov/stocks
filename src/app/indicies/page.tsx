'use client';

import { LineChartProps, Overview } from '@/components/overview';
import { useEffect, useState } from 'react';
import { ResponsiveContainer } from 'recharts';

export default function KpopIndex() {
  const [data, setData] = useState<LineChartProps[]>([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/index/kpop-25')
      .then((res) => res.json() as Promise<any[]>)
      .then((data) => {
        setData(
          data.map((el) => {
            const date = new Date(el.date);
            const date2 = date.toISOString().slice(0, 10);
            return { name: date2, 'kpop-25': Number(el.index).toFixed(2) };
          })
        );
        setLoading(false);
      });
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (!data) return <p>No data</p>;

  return (
    <div className="py-8">
      <ResponsiveContainer>
        <Overview data={data} indexName='kpop-25'/>
      </ResponsiveContainer>
    </div>
  );
}
