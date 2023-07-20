import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-between py-8  min-w-screen">
      <Skeleton className="w-full h-full" />
    </div>
  );
}
