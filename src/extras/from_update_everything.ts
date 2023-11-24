
    // const dataNewDividents = await getDividents(dataSharesOutstanding, currData, '2022-12-31');
    // const newDividents = Object.keys(dataNewDividents).map(el => {
    //   return {date: el, dividents: dataNewDividents[el]}
    // })
    // newData = newDividents
    // await db.delete(dividents)
    // await db.insert(dividents).values(newData)

    // await db.insert(indicies).values(newData)

    //   for (let i = 0; i < indexNames.length; i++) {
    //     const indexName = String(indexNames[i]);
    //     const nameForSQL = `"${indexName}"`;
    //     const dataSharesOutstanding = (await db
    //       .select()
    //       .from(stocks_info)
    //       .where(sql`JSON_CONTAINS(${stocks_info.indicies}, ${nameForSQL})`)) as DataSharesOutstanding[];
    //     const currData = (await db.select().from(currencies)) as CurrenciesPrice[];
    //     const oldAdjustments = await db
    //       .select()
    //       .from(adjustments)
    //       .where(eq(adjustments.index, indexName))
    //       .orderBy(adjustments.date);
    //     const dataDividents = await getDividents(dataSharesOutstanding, currData, '2022-12-31');
    //     const dataIndexPrices = await getIndexPrices(dataSharesOutstanding, currData, '2022-12-28');
    //     const indexHistory = getIndexHistory(dataIndexPrices, oldAdjustments, dataDividents, indexName) as any[];
    //     newData = [...newData, ...indexHistory];

    //   }