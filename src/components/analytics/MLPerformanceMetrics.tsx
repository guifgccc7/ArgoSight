
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Brain } from "lucide-react";
import { AnalyticsMetrics } from "@/services/patternRecognitionService";

interface MLPerformanceMetricsProps {
  metrics: AnalyticsMetrics | null;
}

const MLPerformanceMetrics = ({ metrics }: MLPerformanceMetricsProps) => {
  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Brain className="h-5 w-5 mr-2" />
          Machine Learning Performance Analytics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">ML Detection Accuracy</span>
              <span className="text-green-400 font-bold">{metrics?.detectionAccuracy || 0}%</span>
            </div>
            <Progress value={metrics?.detectionAccuracy || 0} className="h-2" />
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Model Confidence</span>
              <span className="text-blue-400 font-bold">87.3%</span>
            </div>
            <Progress value={87.3} className="h-2" />
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Feature Quality</span>
              <span className="text-purple-400 font-bold">92.1%</span>
            </div>
            <Progress value={92.1} className="h-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MLPerformanceMetrics;
