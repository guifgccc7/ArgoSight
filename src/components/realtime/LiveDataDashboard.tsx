
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

const LiveDataDashboard: React.FC = () => {
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [metrics, setMetrics] = useState<ProcessingMetrics>({
    throughput: 0,
    latency: 0,
    errorRate: 0,
    queueSize: 0,
    activeConnections: 0
  });
  const [correlations, setCorrelations] = useState<AlertCorrelation[]>([]);

  useEffect(() => {
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
  }, []);

  const handleRefreshData = async () => {
    console.log('Refreshing real-time data feeds...');
    await realDataIntegrationService.startRealTimeDataFeed();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Real-Time Data Processing</h2>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-green-400 border-green-400">
            <Activity className="h-3 w-3 mr-1" />
            LIVE - REAL DATA
          </Badge>
          <Button 
            onClick={handleRefreshData}
            className="bg-cyan-600 hover:bg-cyan-700"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Feeds
          </Button>
        </div>
      </div>

      {/* Processing Metrics */}
      <ProcessingMetricsPanel metrics={metrics} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Data Sources Status */}
        <DataSourcesPanel dataSources={dataSources} />

        {/* Alert Correlations */}
        <AlertCorrelationsPanel correlations={correlations} />

        {/* System Health Monitor */}
        <SystemHealthMonitor />
      </div>
    </div>
  );
};

export default LiveDataDashboard;
