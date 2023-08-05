import { mysqlTable, serial, text, date, json, bigint, float } from 'drizzle-orm/mysql-core';

export const currencies = mysqlTable('currencies', {
  date: date('date').primaryKey(),
  KRW: float('KRW'),
  JPY: float('JPY'),
  TWD: float('TWD'),
});

export const stocks_info = mysqlTable('stocks_info', {
  id: serial('id').notNull().unique(),
  symbol: text('symbol').primaryKey(),
  name: text('name'),
  currency: text('currency'),
  country: text('country'),
  shares: bigint('shares', { mode: 'number' }),
  cap_index: text('cap_index'),
  indicies: json('indicies'),
});

export const adjustments = mysqlTable('adjustments', {
  id: serial('id').primaryKey(),
  date: date('date').notNull(),
  index: text('index').notNull(),
  capitalizations: json('capitalizations').notNull(),
  original_percents: json('original_percents').notNull(),
  percents: json('percents').notNull(),
});
