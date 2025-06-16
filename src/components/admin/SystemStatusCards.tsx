
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  CheckCircle, 
  TrendingUp,
  Activity,
  AlertTriangle
} from 'lucide-react';
import { PerformanceMetrics } from '@/services/monitoringService';

interface SystemStatusCardsProps {
  metrics: PerformanceMetrics | null;
}

export const SystemStatusCards: React.FC<SystemStatusCardsProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-300">System Status</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-500">Operational</div>
          <p className="text-xs text-slate-400">All systems running</p>
        </CardContent>
      </Card>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-300">Response Time</CardTitle>
          <TrendingUp className="h-4 w-4 text-cyan-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">
            {metrics?.responseTime.toFixed(0) || '--'}ms
          </div>
          <p className="text-xs text-slate-400">Average response time</p>
        </CardContent>
      </Card>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-300">Throughput</CardTitle>
          <Activity className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">
            {metrics?.throughput.toFixed(1) || '--'}/s
          </div>
          <p className="text-xs text-slate-400">Requests per second</p>
        </CardContent>
      </Card>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-300">Error Rate</CardTitle>
          <AlertTriangle className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">
            {metrics?.errorRate.toFixed(2) || '--'}%
          </div>
          <p className="text-xs text-slate-400">Error percentage</p>
        </CardContent>
      </Card>
    </div>
  );
};
