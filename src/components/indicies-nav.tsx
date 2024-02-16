'use client';

import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';
// import { X, MenuIcon } from '../../node_modules/lucide-react';
import clsx from 'clsx';
import { ModeToggle } from './mode-toggle';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { indexNames } from '@/lib/index-names';

export function IndiciesNav({ className }: { className?: string }) {
  return (
    <>
      <div
        className={cn(
          `w-full flex h-12 flex-1 px-3 flex-row backdrop-blur-sm bg-background/70`,
          className
        )}
      >
        <nav className="px-2 align-bottom flex flex-row flex-wrap">
          {indexNames.map((item) => {
            return (
              <div key={item} className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-gray-400/80">
                <IndiciesNavItem item={item} />
              </div>
            );
          })}
        </nav>
        <div className="flex-grow"></div>
      </div>
    </>
  );
}

function IndiciesNavItem({ item }: { item: string }) {
  const segment = useSelectedLayoutSegment();
  const isActive = item === segment;

  return (
    <Link href={`/indicies/${item}`}>
      <Button variant={isActive ? 'secondary' : 'ghost'} size="sm" className="text-[0.8rem] my-2 capitalize">
        {item.split('-').join(' ')}
      </Button>
    </Link>
  );
}
