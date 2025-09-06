"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { PieChart as PieChartIcon } from "lucide-react";
import { useFormatters } from "@/hooks/useFormatters";

interface PortfolioDistributionData {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

interface PortfolioDistributionChartProps {
  data: PortfolioDistributionData[];
}

export function PortfolioDistributionChart({ data }: PortfolioDistributionChartProps) {
  const { formatCurrency, formatPercentage } = useFormatters();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Portfolio Distribution</CardTitle>
        <PieChartIcon className="size-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={60}
                paddingAngle={6}
                strokeWidth={0}
                label={({ name, value, percentage }) => `${name} $${value?.toFixed(2)} (${percentage.toFixed(2)}%)`}
                isAnimationActive={true}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [formatCurrency(value), 'Value']}
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
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-4">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm font-medium">{item.name}</span>
              <span className="text-sm text-muted-foreground ml-auto">
                {formatPercentage(item.percentage)}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}