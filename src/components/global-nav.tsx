'use client'

import { pages, type Item } from '@/lib/pages';
import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';
import { X, MenuIcon } from 'lucide-react';
import clsx from 'clsx';
import { ModeToggle } from './mode-toggle';
import { Button } from './ui/button';

export function GlobalNav() {

  return (
    <>
      <div className="fixed top-0 z-10 w-full flex h-16 flex-1 p-3 flex-row border-b border-muted [background-color: #0000004d] [-webkit-backdrop-filter: blur(10px)] [backdrop-filter:blur(10px)]">
          <nav className="px-2 align-bottom flex flex-row">
            {pages.map((item) => {
              return (
                <div key={item.slug} className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400/80">
                    <GlobalNavItem item={item} />
                </div>
              );
            })}
          </nav>
          <div className='flex-grow'></div>
          <ModeToggle />
        </div>
      </>
  );
}

function GlobalNavItem({
  item,
}: {
  item: Item;
}) {
  const segment = useSelectedLayoutSegment();
  const isActive = item.slug === segment;

  return (
    <Link
      href={`/${item.slug}`}
      className={clsx(
        {
          'text-primary': isActive,
        },
      )}
    >
      <Button variant='ghost'>{item.name}</Button>
    </Link>
  );
}
