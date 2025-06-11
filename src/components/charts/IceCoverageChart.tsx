
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const chartConfig = {
  northeast: {
    label: "Northeast Passage",
    color: "#06b6d4",
  },
  northwest: {
    label: "Northwest Passage", 
    color: "#10b981",
  },
  transpolar: {
    label: "Transpolar Route",
    color: "#8b5cf6",
  },
};

const IceCoverageChart = () => {
  const data = [
    { month: "Jan", northeast: 85, northwest: 95, transpolar: 98 },
    { month: "Feb", northeast: 88, northwest: 96, transpolar: 99 },
    { month: "Mar", northeast: 82, northwest: 94, transpolar: 97 },
    { month: "Apr", northeast: 75, northwest: 89, transpolar: 95 },
    { month: "May", northeast: 65, northwest: 82, transpolar: 92 },
    { month: "Jun", northeast: 45, northwest: 75, transpolar: 88 },
    { month: "Jul", northeast: 25, northwest: 68, transpolar: 85 },
    { month: "Aug", northeast: 15, northwest: 65, transpolar: 83 },
    { month: "Sep", northeast: 20, northwest: 70, transpolar: 86 },
    { month: "Oct", northeast: 35, northwest: 78, transpolar: 89 },
    { month: "Nov", northeast: 65, northwest: 85, transpolar: 93 },
    { month: "Dec", northeast: 80, northwest: 92, transpolar: 96 },
  ];

  return (
    <ChartContainer config={chartConfig} className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="month" 
            stroke="#9ca3af"
            fontSize={12}
          />
          <YAxis 
            stroke="#9ca3af"
            fontSize={12}
            label={{ value: 'Ice Coverage (%)', angle: -90, position: 'insideLeft' }}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line 
            type="monotone" 
            dataKey="northeast" 
            stroke="var(--color-northeast)"
            strokeWidth={2}
            dot={{ fill: "var(--color-northeast)", strokeWidth: 2, r: 4 }}
          />
          <Line 
            type="monotone" 
            dataKey="northwest" 
            stroke="var(--color-northwest)"
            strokeWidth={2}
            dot={{ fill: "var(--color-northwest)", strokeWidth: 2, r: 4 }}
          />
          <Line 
            type="monotone" 
            dataKey="transpolar" 
            stroke="var(--color-transpolar)"
            strokeWidth={2}
            dot={{ fill: "var(--color-transpolar)", strokeWidth: 2, r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default IceCoverageChart;
