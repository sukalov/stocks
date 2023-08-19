import getDividents from './get-dividents';

export default function getIndexHistory(
  dataIndexPrices: any,
  dataAdjustments: any,
  dataDividents: DataDividents,
  indexName: any
) {

  while (new Date(dataIndexPrices[0].date) < new Date('2022-12-31')) {
    dataIndexPrices.shift();
  }
  let baseIndexPrice = 0;
  let basePercent = 100;
  let basePercentWithDividents = 100;
  let switchDay = false;
  let i = 0;
  let dividents = 0;
  let indexHistory: { date: any; adjustment: any; index_price: number; index: number; name: string, total_return: number }[] = [];

  dataIndexPrices.forEach((day: IndexDay, ind: number) => {
    const dayDate = new Date(day.date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    let checkAdjDate;
    if (i < dataAdjustments.length - 1) {
      checkAdjDate = dataAdjustments[i + 1].date;
    } else {
      checkAdjDate = tomorrow;
    }
    if (dayDate.toLocaleDateString() === checkAdjDate.toLocaleDateString()) {
      switchDay = true;
      i += 1;
      const percents = dataAdjustments[i - 1].percents;
      let index_price = 0;
      Object.keys(percents).forEach((symbol) => {
        index_price += day[symbol] * percents[symbol];
        // if ( !day[symbol] ) {
        //   console.log(symbol, day[symbol], percents[symbol])
        //   console.log({day})
        // };
      });
      basePercent = (index_price / baseIndexPrice) * basePercent;
      basePercentWithDividents = ((index_price + dividents) / baseIndexPrice) * basePercentWithDividents;
      dividents = 0;
    }

    const percents = dataAdjustments[i].percents;
    let index_price = 0;
    Object.keys(percents).forEach((symbol) => {
      index_price += day[symbol] * percents[symbol];
      if (dataDividents[day.date] !== undefined && dataDividents[day.date]?.[symbol] !== undefined) {
        // console.log(day.date, symbol, dataDividents[day.date][symbol])
        dividents += (dataDividents[day.date]?.[symbol] ?? 0) * percents[symbol]
      }
    });
    if (ind === 0 || switchDay) {
      baseIndexPrice = index_price;
      switchDay = false;
    }

    indexHistory.push({
      date: day.date,
      name: indexName,
      adjustment: dataAdjustments[i].date.toISOString().slice(0, 10),
      index_price,
      index: (index_price / baseIndexPrice) * basePercent,
      total_return: ((index_price + dividents) / baseIndexPrice) * basePercentWithDividents,
      // check: `${index_price}, ${baseIndexPrice}, ${basePercent}`,
    });
  });
  const indexHistoryNoWeekends = indexHistory.filter(
    (day, i) => i === 0 || (new Date(day.date).getDay() !== 0 && new Date(day.date).getDay() !== 6)
  );

  return indexHistoryNoWeekends;
}
