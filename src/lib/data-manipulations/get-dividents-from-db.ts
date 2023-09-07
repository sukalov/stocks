import { db } from "../db";
import { dividents } from "../db/schema";

export default async function getDividentsFromDB (): Promise<DataDividents> {
    const dataDivs: DataDividents = {}
    const divs = await db.select().from(dividents) as DividentsDB[]
    for (let row in divs) {
        const date = divs[row]!.date.toISOString().slice(0,10)
        dataDivs[date] = divs[row]!.dividents
    }
    return dataDivs
}