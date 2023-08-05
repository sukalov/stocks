import { Button } from '@/components/ui/button';
import Table from '@/components/stocks-table';
import { useState } from 'react';
import SearchTickers from '@/components/search-tickers';
import { DataTable } from '@/components/data-table';
import { ModeToggle } from '@/components/mode-toggle';
import Link from 'next/link';
import { GlobalNav } from '@/components/global-nav';

export default function Home() {
  const indicies = ['kpop-25', 'cosmetics-15', 'consumer-50']
  return (
    <div className='p-8 text-muted-foreground'>
    {
    indicies.map(indexName => (
      <div key={indexName}>
        <Link href={`/api/stocks-info/${indexName}`}>
          <Button variant={'link'}>info {indexName}</Button>
        </Link><br />
        <Link href={`/api/adjustments/${indexName}`}>
          <Button variant={'link'}>adjustments {indexName}</Button>
        </Link><br />
        <Link href={`/api/index/${indexName}`}>
          <Button variant={'link'}>index {indexName}</Button>
        </Link>
      </div>
    ))
  }
    </div>
  );
}
