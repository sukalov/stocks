import { mysqlTable, serial, text, int, date, decimal, json, bigint } from 'drizzle-orm/mysql-core';

export const stocks_prices = mysqlTable('stocks_prices', {
  id: serial('id').primaryKey(),
  symbol: text('symbol').primaryKey(),
  currency: text('currency'),
  date: date('date'),
  close: decimal('close'),
});

export const stocks_info = mysqlTable('stocks_info', {
  id: serial('id').primaryKey(),
  symbol: text('symbol'),
  name: text('name'),
  currency: text('currency'),
  country: text('country'),
  shares: bigint('shares', { mode: 'number' }),
  cap_index: text('cap_index'),
  indicies: json('indicies')
});
