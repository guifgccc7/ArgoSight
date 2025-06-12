
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Activity, 
  Database, 
  Zap, 
  Wifi, 
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  RefreshCw
} from "lucide-react";
import { realTimeDataProcessor, DataSource, ProcessingMetrics } from '@/services/realTimeDataProcessor';
import { intelligentAlertingSystem, AlertCorrelation } from '@/services/intelligentAlertingSystem';

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
  const [isLiveMode, setIsLiveMode] = useState(false);

  useEffect(() => {
    // Initialize data sources
    setDataSources(realTimeDataProcessor.getDataSources());

    // Subscribe to metrics updates
    const unsubscribeMetrics = realTimeDataProcessor.subscribeToMetrics((newMetrics) => {
      setMetrics(newMetrics);
    });

    // Subscribe to correlations
    const unsubscribeCorrelations = intelligentAlertingSystem.subscribe((correlation) => {
      setCorrelations(prev => [correlation, ...prev.slice(0, 9)]);
    });

    return () => {
      unsubscribeMetrics();
      unsubscribeCorrelations();
    };
  }, []);

  const handleStartLiveData = () => {
    setIsLiveMode(true);
    realTimeDataProcessor.simulateLiveData();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-400" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-400 border-green-400';
      case 'error':
        return 'text-red-400 border-red-400';
      default:
        return 'text-yellow-400 border-yellow-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Real-Time Data Processing</h2>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className={isLiveMode ? 'text-green-400 border-green-400' : 'text-slate-400 border-slate-400'}>
            {isLiveMode ? (
              <>
                <Activity className="h-3 w-3 mr-1" />
                LIVE
              </>
            ) : 'STANDBY'}
          </Badge>
          <Button 
            onClick={handleStartLiveData}
            className="bg-cyan-600 hover:bg-cyan-700"
            disabled={isLiveMode}
          >
            <Zap className="h-4 w-4 mr-2" />
            Start Live Processing
          </Button>
        </div>
      </div>

      {/* Processing Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-cyan-400" />
              <div>
                <p className="text-xs text-slate-400">Throughput</p>
                <p className="text-lg font-bold text-white">{metrics.throughput.toFixed(1)}/s</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Data Sources Status */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Database className="h-5 w-5 mr-2" />
              Data Sources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dataSources.map((source) => (
                <div key={source.id} className="p-3 bg-slate-900 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(source.status)}
                      <span className="text-white font-medium">{source.name}</span>
                    </div>
                    <Badge variant="outline" className={getStatusColor(source.status)}>
                      {source.status.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400">Reliability</span>
                      <div className="mt-1">
                        <Progress value={source.reliability * 100} className="h-2" />
                        <span className="text-white">{(source.reliability * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-400">Latency</span>
                      <p className="text-white font-medium">{source.latency}ms</p>
                    </div>
                  </div>
                  
                  <div className="mt-2 text-xs text-slate-400">
                    Last update: {new Date(source.lastUpdate).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alert Correlations */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <RefreshCw className="h-5 w-5 mr-2" />
              Alert Correlations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {correlations.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <AlertCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No correlations detected</p>
                </div>
              ) : (
                correlations.map((correlation) => (
                  <div key={correlation.id} className="p-3 bg-slate-900 rounded-lg border-l-4 border-orange-400">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">Pattern Correlation</span>
                      <Badge variant="outline" className="text-orange-400 border-orange-400">
                        {(correlation.confidence * 100).toFixed(0)}% CONF
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-300 mb-2">{correlation.summary}</p>
                    <p className="text-xs text-blue-400 italic">
                      Recommendation: {correlation.recommendedAction}
                    </p>
                    <div className="mt-2 text-xs text-slate-400">
                      Related alerts: {correlation.relatedAlerts.length}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LiveDataDashboard;
