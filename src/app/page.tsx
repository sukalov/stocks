
import { Button } from '@/components/ui/button'
import Table from '@/components/StocksTable'
import { useState } from 'react'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between sm:p-24">
      <Table />
    </main>
  )
}
