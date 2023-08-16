import get from "../get-from-eod";

export default async function getDividents (data: DataOnlySymbol[], startDate: string) {
    try {
        const requests = data.map((stock) => get.dividentsAsync(stock.symbol, startDate));
        const responses = await Promise.all(requests);
        const errors = responses.filter((response: Response) => !response.ok);
  
        if (errors.length > 0) {
          throw errors.map((response: Response) => Error(response.statusText));
        }
        const json = responses.map((response: Response) => response.json());
        const result = (await Promise.all(json)) as Array<ResponseDividents[]>;

        let newData: any[] = [];
        result.forEach((divs, i) => {
            if (divs.length) {
                newData = [...newData, data[i]?.symbol, ...divs]
            }
        });

        return newData

    } catch (error) {
        console.error(error);
    }

};