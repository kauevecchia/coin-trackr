"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { BarChart3 } from "lucide-react";
import { useFormatters } from "@/hooks/useFormatters";

interface PnLData {
  name: string;
  pnl: number;
  percentage: number;
}

interface PnLChartProps {
  data: PnLData[];
}

export function PnLChart({ data }: PnLChartProps) {
  const { formatCurrency } = useFormatters();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>P&L by Cryptocurrency</CardTitle>
        <BarChart3 className="size-5 text-muted-foreground" />
      </CardHeader>
      <CardContent className="pl-0 pr-6">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid 
                strokeDasharray="4 4" 
                stroke="var(--muted-foreground)" 
                opacity={0.5} 
              />
              <XAxis 
                dataKey="name" 
                tick={{ fill: 'var(--foreground)', fontSize: 12 }}
                axisLine={{ stroke: 'var(--muted-foreground)' }}
                tickLine={{ stroke: 'var(--muted-foreground)' }}
              />
              <YAxis 
                tick={{ fill: 'var(--foreground)', fontSize: 12 }}
                axisLine={{ stroke: 'var(--muted-foreground)' }}
                tickLine={{ stroke: 'var(--muted-foreground)' }}
              />
              <Tooltip 
                formatter={(value: number) => [formatCurrency(value), 'P&L']}
                labelFormatter={(label) => `${label}`}
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  color: '#111827',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
                labelStyle={{
                  color: '#111827',
                  fontWeight: 'bold'
                }}
                wrapperStyle={{
                  outline: 'none'
                }}
              />
              <Bar 
                dataKey="pnl" 
                radius={[4, 4, 0, 0]}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.pnl >= 0 ? "#10b981" : "#ef4444"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}