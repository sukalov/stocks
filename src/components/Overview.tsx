"use client"

import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { useTheme } from "next-themes"
import { themes } from "@/registry/themes"
import { useConfig } from "@/hooks/use-config"

export type LineChartProps = {
[x: string | number]: number | string
}

interface OverviewProps {
  data: LineChartProps[]
};

export const Overview: React.FC<OverviewProps> = ({
  data
}) => {
  const { theme: mode } = useTheme()
  const [config] = useConfig()
  const theme = themes.find((theme) => theme.name === config.theme)
  return (
    <ResponsiveContainer width="100%" height={600}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="2 10" strokeOpacity={mode === 'dark' ? 0.3 : 0.9}/>
            <XAxis dataKey="name" minTickGap={31}/>
            <YAxis type="number" domain={[50, 150]}/>
            <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-4 shadow-sm">
                        <div className="grid grid-cols-2">
                          <div className="flex flex-col">
                            <span className="text-[.9rem] uppercase text-muted-foreground">
                              DATE
                            </span>
                            <span className="font-bold">
                            { payload[0]?.payload.name }
                            </span>
                          </div>
                          <div className="flex flex-col text-right">
                            <span className="text-[.9rem] uppercase text-muted-foreground">
                              KPOP 25
                            </span>
                            <span className="font-bold">
                            { payload[0]?.value }
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  }

                  return null
                }}
                />
            <Line
                type="monotone"
                strokeWidth={2}
                dataKey="kpop-25"
                dot={<></>}
                activeDot={{
                  r: 8,
                  style: { fill: "var(--theme-primary)", opacity: 0.85 },
                }}
                style={
                  {
                    stroke: "var(--theme-primary)",
                    "--theme-primary": `hsl(${
                      theme?.cssVars[mode === "dark" ? "dark" : "light"].primary
                    })`,
                  } as React.CSSProperties
                }
              />
          </LineChart>
    </ResponsiveContainer>
  ) 
};