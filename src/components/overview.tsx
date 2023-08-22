'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useTheme } from 'next-themes';
import { themes } from '@/registry/themes';
import { useConfig } from '@/hooks/use-config';
import { Separator } from './ui/separator';

export type LineChartProps = {
  [x: string | number]: number | string;
};

interface OverviewProps {
  data: LineChartProps[];
  indexName: string;
}

export const Overview: React.FC<OverviewProps> = ({ data, indexName }) => {
  const { theme: mode } = useTheme();
  const [config] = useConfig();
  const theme = themes.find((theme) => theme.name === config.theme);

  return (
    <ResponsiveContainer width="100%" height={600}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="2 10" strokeOpacity={mode === 'dark' ? 0.3 : 0.9} />
        <XAxis
          dataKey="name"
          minTickGap={31}
          tickLine={false}
          tickFormatter={(tick) => {
            const date = new Date(tick);
            const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
            return formattedDate;
          }}
        />
        <YAxis domain={[75, 150]} tickLine={false} tickCount={4} />

        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border bg-background p-4 shadow-sm">
                  <div className=" grid grid-cols-2">
                    <span className="text-[.9rem] uppercase text-muted-foreground">DATE</span>
                    <span className="font-bold text-right">{payload[0]?.payload.name}</span>
                  </div>
                  <Separator className="my-1" />
                  <div className=" grid grid-cols-2">
                    <span className="text-[.9rem] uppercase text-muted-foreground">TOTAL RETURN</span>
                    <span className="font-bold text-muted-foreground text-right">
                      {payload[0]?.payload.total_return}
                    </span>
                    <span className="text-[.9rem] uppercase text-muted-foreground">
                      {String(indexName.split('-').join(' ')).toUpperCase()}
                    </span>
                    <span className="font-bold text-right text-primary">{payload[0]?.value}</span>
                  </div>
                </div>
              );
            }

            return null;
          }}
        />
        <Line
          type="monotone"
          strokeWidth={2}
          dataKey="index"
          dot={<></>}
          activeDot={{
            r: 8,
            style: { fill: 'var(--theme-primary)', opacity: 0.85 },
          }}
          style={
            {
              stroke: 'var(--theme-primary)',
              '--theme-primary': `hsl(${theme?.cssVars[mode === 'dark' ? 'dark' : 'light'].primary})`,
            } as React.CSSProperties
          }
        />
        <Line
          type="monotone"
          strokeWidth={2}
          dataKey="total_return"
          dot={<></>}
          activeDot={{
            r: 8,
            style: { fill: 'var(--theme-secondary)', opacity: 0.85 },
          }}
          style={
            {
              stroke: 'var(--theme-secondary)',
              '--theme-secondary': `hsl(${theme?.cssVars[mode === 'dark' ? 'dark' : 'light']['muted-foreground']})`,
            } as React.CSSProperties
          }
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
