
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { 
  TrendingUp,
  Clock,
  AlertCircle,
  Database,
  Wifi
} from "lucide-react";
import { ProcessingMetrics } from '@/services/realTimeDataProcessor';

interface ProcessingMetricsPanelProps {
  metrics: ProcessingMetrics;
}

const ProcessingMetricsPanel: React.FC<ProcessingMetricsPanelProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-cyan-400" />
            <div>
              <p className="text-xs text-slate-400">Throughput</p>
              <p className="text-lg font-bold text-white">{metrics.throughput.toFixed(1)}/min</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-yellow-400" />
            <div>
              <p className="text-xs text-slate-400">Latency</p>
              <p className="text-lg font-bold text-white">{metrics.latency.toFixed(0)}ms</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div>
              <p className="text-xs text-slate-400">Error Rate</p>
              <p className="text-lg font-bold text-white">{metrics.errorRate.toFixed(1)}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Database className="h-5 w-5 text-blue-400" />
            <div>
              <p className="text-xs text-slate-400">Queue Size</p>
              <p className="text-lg font-bold text-white">{metrics.queueSize}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Wifi className="h-5 w-5 text-green-400" />
            <div>
              <p className="text-xs text-slate-400">Connections</p>
              <p className="text-lg font-bold text-white">{metrics.activeConnections}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProcessingMetricsPanel;
