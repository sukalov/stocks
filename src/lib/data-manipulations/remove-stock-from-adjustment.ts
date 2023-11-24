import { db } from '../db';
import { adjustments } from '../db/schema';

export default async function removeStockFromAdjustment(adjustment: DataAdjustments, stock: string, date: Date) {
  // let comp1 = 0
  // Object.keys(adjustment.percents).forEach(sym => {
  // comp1 += Number(adjustment.percents[sym])
  // })
  const length = Object.keys(adjustment.percents).length - 1;
  const addition = Number(adjustment.percents[stock]) / length;
  // console.log({addition}, adjustment.percents, stock)
  const newAdjustment = JSON.parse(JSON.stringify(adjustment)) as any;
  delete newAdjustment.capitalizations[stock];
  delete newAdjustment.original_percents[stock];
  delete newAdjustment.percents[stock];
  delete newAdjustment.id;

  newAdjustment.date = new Date(date);
  newAdjustment.is_quartile = false;
  // let comp2 = 0
  Object.keys(newAdjustment.percents).forEach((sym) => {
    newAdjustment.percents[sym] = Number(newAdjustment.percents[sym]) + addition;
    // comp2 += Number(newAdjustment.percents[sym])
  });
  // console.log({comp1, comp2})

  await db.insert(adjustments).values(newAdjustment);

  return newAdjustment;
}
