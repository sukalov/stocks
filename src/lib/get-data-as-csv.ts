export default function getAllDataAsCSV(indexPrices: IndexDay[], divs: DividentsDB[], oldAdjustments: any[]) {
  const totalArray = ['symbol,avg_price,divident,blue_chip_weight'];
  const totalData: any = {};

  const totalDivs = divs.reduce((prev: DataDividents, curr) => {
    const currentDivs: any = curr.dividents;
    for (let div in currentDivs as any) {
      prev[div] !== undefined ? (prev[div] = prev[div] + currentDivs[div]) : (prev[div] = currentDivs[div]);
    }
    return prev;
  }, {});

  indexPrices.forEach((el) => {
    Object.keys(el).forEach((key, i) => {
      if (i !== 0) {
        if (totalData[key] === undefined) totalData[key] = {};
        totalData[key].avg_price !== undefined && totalData[key].avg_price !== null
          ? (totalData[key].avg_price = totalData[key].avg_price + el[key])
          : (totalData[key].avg_price = el[key]);
      }
    });
  });

  for (let symbol in totalData) {
    totalData[symbol].avg_price = totalData[symbol].avg_price / indexPrices.length;
  }

  for (let symbol in totalDivs) {
    totalData[symbol].divident = totalDivs[symbol];
  }

  let adjustment: any = oldAdjustments.at(-1)!.percents;

  for (let symbol in adjustment) {
    totalData[symbol].percent = adjustment[symbol];
  }

  for (let symbol in totalData) {
    const avg_price = totalData[symbol].avg_price ?? 0;
    const divident = totalData[symbol].divident ?? 0;
    const percent = totalData[symbol].percent ?? 0;
    const resultString = `${symbol},${avg_price},${divident},${percent}`;
    totalArray.push(resultString);
  }

  const res = totalArray.join('\r\n');
  return res;
}
