import getDividents from './get-dividents';

export default function getIndexHistory(
  dataIndexPrices: any,
  dataAdjustments: any,
  dataDividents: any,
  indexName: any
) {
  while (new Date(dataIndexPrices[0].date) < new Date('2022-12-31')) {
    dataIndexPrices.shift();
  }
  let baseIndexPrice = 0;
  let basePercent = 100;
  let switchDay = false;
  let i = 0;
  let dividents = 0;
  let indexHistory: { date: any; adjustment: any; index_price: number; index: number; name: string }[] = [];

  dataIndexPrices.forEach((day: any, ind: number) => {
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
      });
      // console.log(`${index_price}, ${baseIndexPrice}, ${basePercent}`)
      basePercent = (index_price / baseIndexPrice) * basePercent;
    }

    const percents = dataAdjustments[i].percents;
    let index_price = 0;
    Object.keys(percents).forEach((symbol) => {
      index_price += day[symbol] * percents[symbol];
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
      // check: `${index_price}, ${baseIndexPrice}, ${basePercent}`,
    });
  });
  const indexHistoryNoWeekends = indexHistory.filter((day) => new Date(day.date).getDay() !== 0 && new Date(day.date).getDay() !== 6);

  return indexHistoryNoWeekends;
}
