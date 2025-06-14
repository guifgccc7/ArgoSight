
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { BehaviorPattern } from "@/services/patternRecognitionService";

interface PatternDistributionChartProps {
  patterns: BehaviorPattern[];
}

const PatternDistributionChart = ({ patterns }: PatternDistributionChartProps) => {
  const patternDistribution = [
    { name: 'AIS Manipulation', value: patterns.filter(p => p.type === 'ais_manipulation').length, color: '#EF4444' },
    { name: 'Route Deviation', value: patterns.filter(p => p.type === 'route_deviation').length, color: '#F59E0B' },
    { name: 'Speed Anomaly', value: patterns.filter(p => p.type === 'speed_anomaly').length, color: '#8B5CF6' },
    { name: 'Loitering', value: patterns.filter(p => p.type === 'loitering').length, color: '#10B981' },
    { name: 'Rendezvous', value: patterns.filter(p => p.type === 'rendezvous').length, color: '#06B6D4' },
  ];

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Brain className="h-5 w-5 mr-2" />
          Pattern Type Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={patternDistribution}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => value > 0 ? `${name}: ${value}` : ''}
              >
                {patternDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatternDistributionChart;
