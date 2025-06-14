
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { BehaviorPattern } from "@/services/patternRecognitionService";

interface ConfidenceDistributionChartProps {
  patterns: BehaviorPattern[];
}

const ConfidenceDistributionChart = ({ patterns }: ConfidenceDistributionChartProps) => {
  const confidenceData = [
    { range: '90-100%', count: patterns.filter(p => p.confidence >= 0.9).length },
    { range: '80-89%', count: patterns.filter(p => p.confidence >= 0.8 && p.confidence < 0.9).length },
    { range: '70-79%', count: patterns.filter(p => p.confidence >= 0.7 && p.confidence < 0.8).length },
    { range: '60-69%', count: patterns.filter(p => p.confidence >= 0.6 && p.confidence < 0.7).length },
  ];

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Shield className="h-5 w-5 mr-2" />
          Detection Confidence Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={confidenceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="range" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
              />
              <Bar dataKey="count" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConfidenceDistributionChart;
