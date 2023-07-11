import { Button } from '@/components/ui/button'
import Table from '@/components/stocks-table'
import { useState } from 'react'
import getDataFromEOD from '@/lib/getDataFromEOD'
import SearchTickers from '@/components/search-tickers'
import { DataTable } from '@/components/data-table'
import { ModeToggle } from '@/components/mode-toggle'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between sm:p-24">
      <Table />
      <DataTable />
      <ModeToggle />
    </main>
  )
}
