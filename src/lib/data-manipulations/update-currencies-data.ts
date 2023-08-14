import { sql } from "drizzle-orm";
import { db } from "../db";
import { currencies } from "../db/schema";
import getCurrenencyPrices from "./get-currencies";

export const initialSteps = async () => {
    const last_date = await db
      .select()
      .from(currencies)
      .orderBy(sql`${currencies.date} desc limit 1`);
    let a = []
    const today = new Date();
    
    console.log(today.getUTCDate(), last_date[0]?.date.getUTCDate(), today.getUTCDay(), last_date[0]?.date.getUTCDay())
    if (today.getUTCDate() > last_date[0]!.date.getUTCDate()) {
      a = await getCurrenencyPrices() || [];
    }
    return a
  };