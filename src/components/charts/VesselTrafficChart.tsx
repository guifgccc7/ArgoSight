
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const chartConfig = {
  vessels: {
    label: "Vessels",
    color: "#06b6d4",
  },
  cargo: {
    label: "Cargo (Million Tons)",
    color: "#10b981",
  },
};

const VesselTrafficChart = () => {
  const data = [
    { year: "2019", vessels: 31, cargo: 8.5 },
    { year: "2020", vessels: 33, cargo: 9.2 },
    { year: "2021", vessels: 42, cargo: 11.8 },
    { year: "2022", vessels: 48, cargo: 13.1 },
    { year: "2023", vessels: 52, cargo: 14.7 },
    { year: "2024", vessels: 55, cargo: 16.2 },
  ];

  return (
    <ChartContainer config={chartConfig} className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="year" 
            stroke="#9ca3af"
            fontSize={12}
          />
          <YAxis 
            stroke="#9ca3af"
            fontSize={12}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar 
            dataKey="vessels" 
            fill="var(--color-vessels)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default VesselTrafficChart;
