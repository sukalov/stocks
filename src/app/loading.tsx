import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className=' w-full mt-16 sm:px-16 lg:px-32'>
        <Skeleton className='w-full h-full' />
    </div>
  )
}
