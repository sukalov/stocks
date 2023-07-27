import { Button } from '@/components/ui/button';
import Table from '@/components/stocks-table';
import { useState } from 'react';
import SearchTickers from '@/components/search-tickers';
import { DataTable } from '@/components/data-table';
import { ModeToggle } from '@/components/mode-toggle';
import Link from 'next/link';
import { GlobalNav } from '@/components/global-nav';

export default function Home() {
  return (
    <div className="flex h-[calc(100vh-4rem)] flex-row flex-wrap flex-1 gap-3 items-center justify-center p-8 min-w-screen text-muted-foreground">
      <Link href={'/api'}>
        <Button variant={'link'}>api</Button>
      </Link>
      <Button>collect outstanding shares</Button>
      <Button></Button>
      <Button>jhjh</Button>
    </div>
  );
}
