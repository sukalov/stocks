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
    <>
    {
    indicies.map(indexName => (
      <div key={indexName} className="gap-3 items-center justify-left p-8 text-muted-foreground">
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
    {/* <div className="h-[calc(100vh-4rem)] gap-3 items-center justify-left p-8 min-w-screen text-muted-foreground">
      <Link href={'/api/stocks-info/kpop-25'}>
        <Button variant={'link'}>info kpop-25</Button>
      </Link><br />
      <Link href={'/api/stocks-info/cosmetics-15'}>
        <Button variant={'link'}>info cosmetics-15</Button>
      </Link><br />
      <Link href={'/api/adjustments/kpop-25'}>
        <Button variant={'link'}>adjustments kpop-25</Button>
      </Link><br />
      <Link href={'/api/adjustments/cosmetics-15'}>
        <Button variant={'link'}>adjustments cosmetics-15</Button>
      </Link><br />
      <Link href={'/api/index/kpop-25'}>
        <Button variant={'link'}>index kpop-25</Button>
      </Link><br />
      <Link href={'/api/index/cosmetics-15'}>
        <Button variant={'link'}>index cosmetics-15</Button>
      </Link><br />
    </div> */}
    </>
  );
}
