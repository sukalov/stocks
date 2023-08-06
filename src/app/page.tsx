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
    <div className='p-8 text-muted-foreground table'>
    {
    indicies.map(indexName => (
      <div key={indexName} className='pb-6'>
        <p className=' text-lg p-0'>{indexName}</p>
        <Link href={`/api/stocks-info/${indexName}`}>
          <Button variant={'link'}>info</Button>
        </Link><br />
        <Link href={`/api/adjustments/${indexName}`}>
          <Button variant={'link'}>adjustments</Button>
        </Link><br />
        <Link href={`/api/index/${indexName}`}>
          <Button variant={'link'}>index</Button>
        </Link>
      </div>
    ))
  }
    </div>
  );
}
