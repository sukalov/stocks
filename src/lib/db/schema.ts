import {
  mysqlTable,
  serial,
  text,
  int,
  date,
  decimal,
} from "drizzle-orm/mysql-core";

export const stocks_data = mysqlTable("stocks_data", {
  id: serial("id").primaryKey(),
  symbol: text("symbol"),
  currency: text("currency"),
  exchange: text("exchange"),
  mic: text("mic"),
  date: date("date"),
  open: decimal("open"),
  high: decimal("high"),
  low: decimal("low"),
  close: decimal("close"),
  volume: int("volume"),
});

export const stocks_info = mysqlTable("stocks_info", {
  id: serial("id").primaryKey(),
  symbol: text("symbol"),
  name: text("name"),
  currency: text("currency"),
  exchange: text("exchange"),
  mic_code: text("mic_code"),
  country: text("country"),
  type: text("type"),
});
