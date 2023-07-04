import { mysqlTable, serial, text, int, date, decimal } from 'drizzle-orm/mysql-core'

/**
 * This is a sample schema.
 * Replace this with your own schema and then run migrations.
 */

export const stock = mysqlTable('stock', {
  id: serial('id').primaryKey(),
  symbol: text('symbol'),
  currency: text('currency'),
  exchange: text('exchange'),
  mic: text('mic'),
  date: date('date'),
  open: decimal('open'),
  high: decimal('high'),
  low: decimal('low'),
  close: decimal('close'),
  volume: int('volume'),
})