
import { Card, CardContent } from "@/components/ui/card";
import { Activity, AlertTriangle, Target, Zap } from "lucide-react";
import { AnalyticsMetrics } from "@/services/patternRecognitionService";

interface AIMetricsGridProps {
  metrics: AnalyticsMetrics | null;
}

const AIMetricsGrid = ({ metrics }: AIMetricsGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <Activity className="h-8 w-8 text-cyan-400" />
            <div>
              <p className="text-sm text-slate-400">ML Patterns Detected</p>
              <p className="text-2xl font-bold text-white">{metrics?.totalPatterns || 0}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-8 w-8 text-red-400" />
            <div>
              <p className="text-sm text-slate-400">Critical Threats</p>
              <p className="text-2xl font-bold text-white">{metrics?.criticalThreats || 0}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <Target className="h-8 w-8 text-green-400" />
            <div>
              <p className="text-sm text-slate-400">ML Accuracy</p>
              <p className="text-2xl font-bold text-white">{metrics?.detectionAccuracy || 0}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <Zap className="h-8 w-8 text-yellow-400" />
            <div>
              <p className="text-sm text-slate-400">Processing Speed</p>
              <p className="text-2xl font-bold text-white">{metrics?.responseTime || 0}s</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIMetricsGrid;
