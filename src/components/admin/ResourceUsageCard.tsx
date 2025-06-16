
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Server } from 'lucide-react';
import { PerformanceMetrics } from '@/services/monitoringService';

interface ResourceUsageCardProps {
  metrics: PerformanceMetrics | null;
}

export const ResourceUsageCard: React.FC<ResourceUsageCardProps> = ({ metrics }) => {
  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Server className="h-5 w-5 mr-2" />
          Resource Usage
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-sm text-slate-300 mb-1">
            <span>Memory Usage</span>
            <span>{metrics?.memoryUsage.toFixed(1) || '--'}%</span>
          </div>
          <Progress value={metrics?.memoryUsage || 0} className="h-2" />
        </div>
        <div>
          <div className="flex justify-between text-sm text-slate-300 mb-1">
            <span>CPU Usage</span>
            <span>{metrics?.cpuUsage.toFixed(1) || '--'}%</span>
          </div>
          <Progress value={metrics?.cpuUsage || 0} className="h-2" />
        </div>
        <div>
          <div className="flex justify-between text-sm text-slate-300 mb-1">
            <span>Disk Usage</span>
            <span>{metrics?.diskUsage.toFixed(1) || '--'}%</span>
          </div>
          <Progress value={metrics?.diskUsage || 0} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
};
