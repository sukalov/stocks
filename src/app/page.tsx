import { Button } from '@/components/ui/button';
import Table from '@/components/stocks-table';
import { useState } from 'react';
import SearchTickers from '@/components/search-tickers';
import { DataTable } from '@/components/data-table';
import { ModeToggle } from '@/components/mode-toggle';
import Link from 'next/link';
import { GlobalNav } from '@/components/global-nav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  const indicies = ['kpop-25', 'cosmetics-15', 'consumer-50', 'entertainment-100', 'video-75', 'tech-100'];
  return (
    <div className="py-8 flex flex-1 gap-4 justify-center items-start flex-wrap">
      {indicies.map((indexName) => (
        <Card key={indexName} className="md:w-80 sm:w-[28rem] sm:mx-2 mx-2 w-[28rem] flex-grow">
          <CardHeader>
            <CardTitle className=" text-muted-foreground capitalize">{indexName.split('-').join(' ')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div key={indexName} className="pb-6">
              <Link href={`/api/stocks-info/${indexName}`}>
                <Button variant={'link'}>info</Button>
              </Link>
              <br />
              <Link href={`/api/adjustments/${indexName}`}>
                <Button variant={'link'}>adjustments</Button>
              </Link>
              <br />
              <Link href={`/api/index/${indexName}`}>
                <Button variant={'link'}>index</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
