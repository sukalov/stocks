import { LineChartProps, Overview } from "@/components/overview";
import { ResponsiveContainer } from "recharts";

export default async function KpopIndex() {

  async function fetchData() {
  const res = await fetch('/api/index/kpop-25')
  const preData = await res.json() as any[]
  const data = preData.map(el => {
    const date = new Date(el.date)
    const date2 = date.toISOString().slice(0,10)
    return {name: date2, 'kpop-25': Math.round(Number(el.index))}
  })
  return data
}

  return (
    <div className="py-8">
        <ResponsiveContainer>
          <Overview data={await fetchData()} />
      </ResponsiveContainer>
    </div>
  );
}