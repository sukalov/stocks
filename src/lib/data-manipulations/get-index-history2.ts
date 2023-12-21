export default function getIndexHistory2(
  dataIndexPrices: any,
  dataAdjustments: any,
  dataDividents: DataDividents,
  indexName: any
) {
  while (new Date(dataIndexPrices[0].date) < new Date('2022-12-31')) {
    dataIndexPrices.shift();
  }

  // return dataIndexPrices

  let index = 100; // ex basePercent
  let index_prev = 100;
  let total_return = 100; // ex basePercentWithDividents
  let total_return_prev = 100;
  let i = 0;
  let indexHistory: IndexDay[] = [];

  //   return dataIndexPrices

  dataIndexPrices.forEach((day: IndexDay, ind: number) => {
    let day_previous: IndexDay = day;
    if (ind > 0) day_previous = dataIndexPrices[ind - 1];
    const dayDate = new Date(day.date);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    let checkAdjDate;

    if (i < dataAdjustments.length - 1) {
      checkAdjDate = dataAdjustments[i + 1].date;
    } else {
      checkAdjDate = tomorrow;
    }
    if (dayDate.toLocaleDateString() === checkAdjDate.toLocaleDateString()) {
      i += 1;
    }

    const percents = dataAdjustments[i].percents;
    let index_change = 0;
    let index_return_change = 0;
    Object.keys(percents).forEach((symbol) => {
      let symbol_change = (day[symbol] / day_previous[symbol]) * percents[symbol];
      if (isNaN(symbol_change)) symbol_change = 0
      // if (isNaN(symbol_change)) console.log(symbol, percents[symbol], day_previous[symbol], day[symbol])
      // if (symbol === '420770.KQ') console.log({symbol}, percents[symbol], day_previous[symbol], day[symbol], {index_change, symbol_change, ADJ: dataAdjustments[i].date})
      index_change += symbol_change;
      let symbol_return_change;
      if (
        dataDividents[day.date] !== undefined &&
        dataDividents[day.date]?.[symbol] !== undefined &&
        percents[symbol] !== undefined
      ) {
        // console.log(day.date, symbol, dataDividents[day.date][symbol])
        // dividents += (dataDividents[day.date]?.[symbol] ?? 0) * percents[symbol];
        symbol_return_change =
          ((day[symbol] + dataDividents[day.date]?.[symbol]) / day_previous[symbol]) * percents[symbol] ??
          symbol_change;
      } else {
        symbol_return_change = symbol_change;
      }
      index_return_change += symbol_return_change;
    });

    // if (ind === 0 || switchDay) {
    //   baseIndexPrice = index_price;
    //   switchDay = false;
    // }
    index = index_prev * index_change;
    // console.log(ind, index_prev, index_change)
    index_prev = index;
    total_return = total_return_prev * index_return_change;
    total_return_prev = total_return;

    indexHistory.push({
      date: day.date,
      name: indexName,
      adjustment: dataAdjustments[i].date.toISOString().slice(0, 10),
      index,
      total_return,
    });
  });

  const indexHistoryNoWeekends = indexHistory.filter(
    (day, i) => i === 0 || (new Date(day.date).getDay() !== 5 && new Date(day.date).getDay() !== 6)
  );

  return indexHistoryNoWeekends;
}
