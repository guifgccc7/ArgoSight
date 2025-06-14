
import React, { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Activity, 
  RefreshCw
} from "lucide-react";
import { realTimeDataProcessor, DataSource, ProcessingMetrics } from '@/services/realTimeDataProcessor';
import { intelligentAlertingSystem, AlertCorrelation } from '@/services/intelligentAlertingSystem';
import { realDataIntegrationService } from '@/services/realDataIntegrationService';
import SystemHealthMonitor from '@/components/SystemHealthMonitor';
import ProcessingMetricsPanel from './ProcessingMetricsPanel';
import DataSourcesPanel from './DataSourcesPanel';
import AlertCorrelationsPanel from './AlertCorrelationsPanel';
import { liveDataService } from "@/services/liveDataService";

interface LiveDataDashboardProps {
  isDemoMode?: boolean; // If not provided, defaults to false (live)
}

const LiveDataDashboard: React.FC<LiveDataDashboardProps> = ({ isDemoMode = false }) => {
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [metrics, setMetrics] = useState<ProcessingMetrics>({
    throughput: 0,
    latency: 0,
    errorRate: 0,
    queueSize: 0,
    activeConnections: 0
  });
  const [correlations, setCorrelations] = useState<AlertCorrelation[]>([]);
  // For demo mode dashboard stats (simulate activity)
  const [demoStats, setDemoStats] = useState({
    throughput: 1100 + Math.random() * 500,
    latency: 80 + Math.random() * 20,
    errorRate: Math.random(),
    queueSize: 3 + Math.floor(Math.random() * 10),
    activeConnections: 8 + Math.floor(Math.random() * 5)
  });

  useEffect(() => {
    if (isDemoMode) {
      // Simulate changing metrics every 10s in demo mode
      const interval = setInterval(() => {
        setDemoStats({
          throughput: 1200 + Math.random() * 400,
          latency: 70 + Math.random() * 30,
          errorRate: 0.3 + Math.random(),
          queueSize: 5 + Math.floor(Math.random() * 7),
          activeConnections: 5 + Math.floor(Math.random() * 6),
        });
      }, 10000);
      return () => clearInterval(interval);
    } else {
      setDataSources(realTimeDataProcessor.getDataSources());
      const unsubscribeMetrics = realTimeDataProcessor.subscribeToMetrics((newMetrics) => {
        setMetrics(newMetrics);
      });
      const unsubscribeCorrelations = intelligentAlertingSystem.subscribe((correlation) => {
        setCorrelations(prev => [correlation, ...prev.slice(0, 9)]);
      });

      // Start real-time data feeds automatically
      realDataIntegrationService.startRealTimeDataFeed();

      return () => {
        unsubscribeMetrics();
        unsubscribeCorrelations();
      };
    }
  }, [isDemoMode]);

  const handleRefreshData = async () => {
    if (isDemoMode) {
      setDemoStats({
        throughput: 1200 + Math.random() * 400,
        latency: 70 + Math.random() * 30,
        errorRate: Math.random(),
        queueSize: 2 + Math.floor(Math.random() * 6),
        activeConnections: 5 + Math.floor(Math.random() * 8),
      });
      return;
    }
    await realDataIntegrationService.startRealTimeDataFeed();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Real-Time Data Processing</h2>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className={isDemoMode ? "text-yellow-400 border-yellow-400" : "text-green-400 border-green-400"}>
            <Activity className="h-3 w-3 mr-1" />
            {isDemoMode ? "SIMULATION MODE" : "LIVE - REAL DATA"}
          </Badge>
          <Button 
            onClick={handleRefreshData}
            className={isDemoMode ? "bg-yellow-600 hover:bg-yellow-700" : "bg-cyan-600 hover:bg-cyan-700"}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            {isDemoMode ? "Simulate Update" : "Refresh Feeds"}
          </Button>
        </div>
      </div>

      {/* Processing Metrics */}
      <ProcessingMetricsPanel metrics={isDemoMode ? demoStats : metrics} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Data Sources Status */}
        <DataSourcesPanel dataSources={isDemoMode 
          ? [
            { 
              id: "sim_ais", 
              name: "Simulated AIS Feed", 
              type: "ais",
              status: "active", 
              reliability: 1, 
              latency: 42, 
              lastUpdate: new Date().toISOString() 
            },
            { 
              id: "sim_weather", 
              name: "Simulated Weather Feed", 
              type: "weather",
              status: "active", 
              reliability: 1, 
              latency: 19, 
              lastUpdate: new Date().toISOString() 
            }
          ] 
          : dataSources} />

        {/* Alert Correlations */}
        <AlertCorrelationsPanel correlations={isDemoMode
          ? [{
            id: "sim-1",
            confidence: 0.98,
            summary: "Simulated correlation of vessel ghosting and suspicious weather activity.",
            recommendedAction: "Monitor region, increase scan frequency.",
            relatedAlerts: ["mock-alert-1", "mock-alert-2"]
          }]
          : correlations} />

        {/* System Health Monitor */}
        <SystemHealthMonitor />
      </div>
    </div>
  );
};

export default LiveDataDashboard;
