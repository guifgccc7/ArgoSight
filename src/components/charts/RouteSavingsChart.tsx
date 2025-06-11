
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const chartConfig = {
  time: {
    label: "Time Savings",
    color: "#06b6d4",
  },
  distance: {
    label: "Distance Reduction", 
    color: "#10b981",
  },
  fuel: {
    label: "Fuel Efficiency",
    color: "#8b5cf6",
  },
  cost: {
    label: "Cost Reduction",
    color: "#f59e0b",
  },
};

const RouteSavingsChart = () => {
  const data = [
    { name: "Time Savings", value: 35, color: "#06b6d4" },
    { name: "Distance Reduction", value: 40, color: "#10b981" },
    { name: "Fuel Efficiency", value: 28, color: "#8b5cf6" },
    { name: "Cost Reduction", value: 32, color: "#f59e0b" },
  ];

  return (
    <ChartContainer config={chartConfig} className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: ${value}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <ChartTooltip content={<ChartTooltipContent />} />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default RouteSavingsChart;
