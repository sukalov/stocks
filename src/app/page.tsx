import { Button } from '@/components/ui/button'
import Table from '@/components/stocks-table'
import { useState } from 'react'
import getDataFromEOD from '@/lib/getDataFromEOD'
import SearchTickers from '@/components/search-tickers'
import { DataTable } from '@/components/data-table'
import { ModeToggle } from '@/components/mode-toggle'

export default function Home() {
  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-between p-8  min-w-screen">
      <p>use navigation</p>
    </div>
  )
}
