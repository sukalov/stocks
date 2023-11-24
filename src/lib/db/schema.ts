import { mysqlTable, serial, text, date, json, bigint, float, boolean, varchar } from 'drizzle-orm/mysql-core';

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
  market_cap: bigint('market_cap', { mode: 'number' }),
  last_price: float('last_price'),
  cap_index: text('cap_index'),
  indicies: json('indicies'),
  is_delisted: boolean('is_delisted'),
});

export const adjustments = mysqlTable('adjustments', {
  id: serial('id').primaryKey(),
  date: date('date').notNull(),
  index: text('index').notNull(),
  capitalizations: json('capitalizations').notNull(),
  original_percents: json('original_percents').notNull(),
  percents: json('percents').notNull(),
  is_quartile: boolean('is_quartile'),
});

export const indicies = mysqlTable('indicies', {
  id: serial('id').primaryKey(),
  date: date('date').notNull(),
  name: text('name').notNull(),
  adjustment: date('adjustment'),
  index: float('index'),
  total_return: float('total_return'),
});

export const dividents = mysqlTable('dividents', {
  date: date('date').notNull(),
  dividents: json('dividents').notNull(),
});

export const indexnames = mysqlTable('indexnames', {
  id: varchar('id', {length: 20}).primaryKey(),
});

export const indexprices = mysqlTable('indexprices', {
  type: varchar('type', {length: 20}),
  json: json('json')
})
