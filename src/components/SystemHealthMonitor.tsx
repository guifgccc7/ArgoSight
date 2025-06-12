
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Cpu, 
  HardDrive, 
  Wifi, 
  Zap, 
  AlertTriangle,
  CheckCircle
} from "lucide-react";

interface SystemMetrics {
  cpuUsage: number;
  memoryUsage: number;
  networkLatency: number;
  apiResponseTime: number;
  activeConnections: number;
  status: 'healthy' | 'warning' | 'critical';
}

const SystemHealthMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpuUsage: 0,
    memoryUsage: 0,
    networkLatency: 0,
    apiResponseTime: 0,
    activeConnections: 0,
    status: 'healthy'
  });

  useEffect(() => {
    const updateMetrics = () => {
      const newMetrics: SystemMetrics = {
        cpuUsage: 15 + Math.random() * 20,
        memoryUsage: 40 + Math.random() * 30,
        networkLatency: 20 + Math.random() * 50,
        apiResponseTime: 100 + Math.random() * 200,
        activeConnections: Math.floor(8 + Math.random() * 15),
        status: Math.random() > 0.9 ? 'warning' : 'healthy'
      };
      setMetrics(newMetrics);
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = () => {
    switch (metrics.status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-400" />;
      default:
        return <CheckCircle className="h-4 w-4 text-green-400" />;
    }
  };

  const getStatusColor = () => {
    switch (metrics.status) {
      case 'healthy':
        return 'text-green-400 border-green-400';
      case 'warning':
        return 'text-yellow-400 border-yellow-400';
      case 'critical':
        return 'text-red-400 border-red-400';
      default:
        return 'text-green-400 border-green-400';
    }
  };

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader className="pb-3">
        <CardTitle className="text-white flex items-center justify-between">
          <span className="flex items-center">
            <Zap className="h-5 w-5 mr-2" />
            System Health
          </span>
          <Badge variant="outline" className={getStatusColor()}>
            {getStatusIcon()}
            {metrics.status.toUpperCase()}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Cpu className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-slate-300">CPU</span>
              </div>
              <span className="text-sm text-white font-medium">
                {metrics.cpuUsage.toFixed(1)}%
              </span>
            </div>
            <Progress value={metrics.cpuUsage} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <HardDrive className="h-4 w-4 text-purple-400" />
                <span className="text-sm text-slate-300">Memory</span>
              </div>
              <span className="text-sm text-white font-medium">
                {metrics.memoryUsage.toFixed(1)}%
              </span>
            </div>
            <Progress value={metrics.memoryUsage} className="h-2" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-2">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Wifi className="h-3 w-3 text-green-400" />
              <span className="text-xs text-slate-400">Latency</span>
            </div>
            <p className="text-sm font-medium text-white">
              {metrics.networkLatency.toFixed(0)}ms
            </p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Zap className="h-3 w-3 text-yellow-400" />
              <span className="text-xs text-slate-400">API</span>
            </div>
            <p className="text-sm font-medium text-white">
              {metrics.apiResponseTime.toFixed(0)}ms
            </p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <CheckCircle className="h-3 w-3 text-cyan-400" />
              <span className="text-xs text-slate-400">Connections</span>
            </div>
            <p className="text-sm font-medium text-white">
              {metrics.activeConnections}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemHealthMonitor;
