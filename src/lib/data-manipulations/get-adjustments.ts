export function getAdjustments(dataForAdjustments: any, dataSharesOutstanding: any, indexName: any) {
  const indexVolume = Number(indexName.split('-')[1]);
  const newAdjustments: any[] = [];
  dataForAdjustments.forEach((adjDay: any) => {
    const data = JSON.parse(JSON.stringify(dataSharesOutstanding)) as any[];
    data.forEach((stock) => {
      stock.MC = adjDay[stock.symbol] * stock.shares;
    });
    data.sort((a, b) => Number(b.MC) - Number(a.MC)).splice(indexVolume);

    const totalMC = data.reduce((acc: number, current: DataSharesInitialDay) => {
      if (current.MC) return acc + current.MC;
      else return acc;
    }, 0);

    data.forEach((stock: DataSharesInitialDay, i: number) => {
      stock.share = Number(stock.MC) / totalMC;
      stock.share_adj = Number(stock.MC) / totalMC;
    });

    const dataCopy = JSON.parse(JSON.stringify(data)) as DataShareAdjusted[];
    let remainingSUM = totalMC;
    data.forEach((stock, i: number) => {
      if (stock.share > 0.1) {
        stock.share_adj = 0.1;
        const remains = stock.MC - totalMC / 10; // то что надо раскидать по всем оставшимся акциям
        remainingSUM -= stock.MC;
        stock.MC = totalMC / 10;
        data.forEach((el: DataSharesInitialDay, j: number) => {
          if (j > i) {
            const addition = (el.MC / remainingSUM) * remains;
            el.MC = el.MC + addition;
            el.share = el.MC / totalMC;
          }
        });
        remainingSUM = remainingSUM + remains;
      } else {
        stock.share_adj = stock.share;
      }
    });

    data.forEach((stock, i) => {
      stock.MC = dataCopy[i]?.MC ?? 0;
      stock.share = dataCopy[i]?.share ?? 0;
    });

    const adjustment = data.reduce((acc, current, i) => {
      acc.capitalizations = acc?.capitalizations || {};
      acc.original_percents = acc?.original_percents || {};
      acc.percents = acc?.percents || {};

      acc.capitalizations[current.symbol] = current.MC;
      acc.original_percents[current.symbol] = current.share;
      acc.percents[current.symbol] = current.share_adj;

      return acc;
    }, {});

    const finalAdjustment = {
      date: adjDay.date,
      index: indexName,
      ...adjustment,
    };

    newAdjustments.push(finalAdjustment);
  });

  return newAdjustments;
}
