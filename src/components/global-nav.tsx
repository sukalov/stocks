'use client';

import { pages, type Item } from '@/lib/pages';
import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';
// import { X, MenuIcon } from '../../node_modules/lucide-react';
import clsx from 'clsx';
import { ModeToggle } from './mode-toggle';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

export function GlobalNav({ className }: {className: string}) {
  return (
    <>
      <div className={cn(`fixed top-0 z-10 w-full flex h-16 flex-1 p-3 flex-row border-b border-muted backdrop-blur-sm bg-background/70`, className)}>
        <nav className="px-2 align-bottom flex flex-row">
          <div className="my-1.5 text-lg pr-5 pl-2 font-extralight tracking-wider">
            <Link
              href={`/`}
              className={clsx('text-muted-foreground opacity-50 hover:opacity-80 transition-all duration-1000')}
            >
              JaKoTa
            </Link>
          </div>
          {pages.map((item) => {
            return (
              <div
                key={item.slug}
                className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-gray-400/80"
              >
                <GlobalNavItem item={item} />
              </div>
            );
          })}
        </nav>
        <div className="flex-grow"></div>
        <ModeToggle />
      </div>
    </>
  );
}

function GlobalNavItem({ item }: { item: Item }) {
  const segment = useSelectedLayoutSegment();
  const isActive = item.slug === segment;

  return (
    <Link href={`/${item.slug}`}>
      <Button variant={isActive ? 'secondary' : 'ghost'}>{item.name}</Button>
    </Link>
  );
}

// className={clsx({
//   ' text-accent-foreground  bg-muted' : isActive,
//   ' text-muted-foreground' : !isActive,
// })}
