  // const jakota = await csv.read('JKT_COMPLETE_FILTERED') as DataSharesOutstanding[]
  // const korea = await csv.read('complete_korea') as {
  //   no: number,
  //   code: number,
  //   name: string,
  //   industry_code: number,
  //   industry: string,
  //   shares: number
  // }[]
  // let counter = 0
  // korea.forEach(row => {
  //   let symbol = String(row.code)
  //   while (symbol.length < 6) {
  //     symbol = `0${symbol}`
  //   }
  //   const index = jakota.findIndex(jrow => jrow.symbol === `${symbol}.KO` || jrow.symbol === `${symbol}.KQ`)
  //   if (index >= 0) {
  //     counter += 1
  //     console.log({counter, symbol, index, shares: row.shares, old_shares: jakota[index].shares})
  //     jakota[index].shares = row.shares
  // }
  // })