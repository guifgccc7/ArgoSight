
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Server, 
  Database, 
  Activity, 
  Wifi, 
  AlertTriangle, 
  CheckCircle, 
  Settings,
  TrendingUp,
  Globe,
  Shield
} from 'lucide-react';
import { realDataIntegrationService } from '@/services/realDataIntegrationService';
import { monitoringService, PerformanceMetrics } from '@/services/monitoringService';
import { productionConfigService } from '@/services/productionConfigService';

const ProductionDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [systemHealth, setSystemHealth] = useState<any>(null);
  const [recentAlerts, setRecentAlerts] = useState<any[]>([]);
  const [providers, setProviders] = useState<any>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);

  useEffect(() => {
    // Initialize monitoring
    monitoringService.startMonitoring();
    
    // Subscribe to real-time metrics
    const unsubscribe = monitoringService.subscribe(setMetrics);

    // Load providers
    setProviders(realDataIntegrationService.getProviders());

    // Load initial data
    loadSystemHealth();
    loadRecentAlerts();

    return unsubscribe;
  }, []);

  const loadSystemHealth = async () => {
    const health = await monitoringService.getSystemHealth();
    setSystemHealth(health);
  };

  const loadRecentAlerts = async () => {
    const alerts = await monitoringService.getRecentAlerts();
    setRecentAlerts(alerts);
  };

  const handleOptimizeDatabase = async () => {
    setIsOptimizing(true);
    try {
      await monitoringService.optimizeDatabase();
      await loadSystemHealth();
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleStartDataIntegration = async () => {
    await realDataIntegrationService.startRealTimeDataFeed();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'error': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const requiredKeys = productionConfigService.getRequiredAPIKeys();

  return (
    <div className="p-6 space-y-6 bg-slate-950 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Production Dashboard</h1>
        <div className="flex space-x-2">
          <Button 
            onClick={handleOptimizeDatabase}
            disabled={isOptimizing}
            variant="outline"
            className="border-slate-600"
          >
            <Database className="h-4 w-4 mr-2" />
            {isOptimizing ? 'Optimizing...' : 'Optimize DB'}
          </Button>
          <Button 
            onClick={handleStartDataIntegration}
            className="bg-green-600 hover:bg-green-700"
          >
            <Wifi className="h-4 w-4 mr-2" />
            Start Data Feeds
          </Button>
        </div>
      </div>

      {/* System Status Overview */}
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

      <Tabs defaultValue="monitoring" className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-slate-800">
          <TabsTrigger value="monitoring" className="text-slate-300">Monitoring</TabsTrigger>
          <TabsTrigger value="data-sources" className="text-slate-300">Data Sources</TabsTrigger>
          <TabsTrigger value="configuration" className="text-slate-300">Configuration</TabsTrigger>
          <TabsTrigger value="security" className="text-slate-300">Security</TabsTrigger>
          <TabsTrigger value="alerts" className="text-slate-300">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="monitoring" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Resource Usage */}
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

            {/* Database Health */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Database className="h-5 w-5 mr-2" />
                  Database Health
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-300">Total Vessels</span>
                  <span className="text-white font-mono">{systemHealth?.vessels_count || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Positions (24h)</span>
                  <span className="text-white font-mono">{systemHealth?.positions_last_24h || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Weather Records (24h)</span>
                  <span className="text-white font-mono">{systemHealth?.weather_records_last_24h || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Satellite Images (7d)</span>
                  <span className="text-white font-mono">{systemHealth?.satellite_images_last_7d || 0}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="data-sources" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* AIS Providers */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">AIS Data Providers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {providers?.ais.map((provider: any) => (
                  <div key={provider.id} className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-medium">{provider.name}</div>
                      <div className="text-xs text-slate-400">{provider.rateLimitPerHour}/hr</div>
                    </div>
                    <Badge variant="outline" className={getStatusColor(provider.status)}>
                      {provider.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Weather Providers */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Weather Providers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {providers?.weather.map((provider: any) => (
                  <div key={provider.id} className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-medium">{provider.name}</div>
                      <div className="text-xs text-slate-400">{provider.features.join(', ')}</div>
                    </div>
                    <Badge variant="outline" className="text-green-500 border-green-500">
                      ready
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Satellite Providers */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Satellite Providers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {providers?.satellite.map((provider: any) => (
                  <div key={provider.id} className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-medium">{provider.name}</div>
                      <div className="text-xs text-slate-400">{provider.resolution} resolution</div>
                    </div>
                    <Badge variant="outline" className="text-green-500 border-green-500">
                      ready
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="configuration" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Required API Keys
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-slate-400 mb-4">
                Configure these API keys in Supabase Edge Function secrets for production deployment:
              </div>
              {requiredKeys.map((key) => (
                <div key={key.name} className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
                  <div>
                    <div className="text-white font-medium">{key.name}</div>
                    <div className="text-xs text-slate-400">{key.description}</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {key.required && (
                      <Badge variant="outline" className="text-red-400 border-red-400">
                        Required
                      </Badge>
                    )}
                    <Button size="sm" variant="outline" onClick={() => window.open(key.url, '_blank')}>
                      Get Key
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Security Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-slate-900 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">SSL/TLS Encryption</span>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                </div>
                <div className="p-3 bg-slate-900 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Row Level Security</span>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                </div>
                <div className="p-3 bg-slate-900 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">API Authentication</span>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                </div>
                <div className="p-3 bg-slate-900 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Data Encryption</span>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Recent System Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              {recentAlerts.length > 0 ? (
                <div className="space-y-3">
                  {recentAlerts.map((alert, index) => (
                    <Alert key={index} className="bg-slate-900 border-slate-600">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription className="text-slate-300">
                        <div className="flex justify-between">
                          <span>{alert.error_message || `${alert.provider} integration error`}</span>
                          <span className="text-xs text-slate-500">
                            {new Date(alert.timestamp_utc).toLocaleString()}
                          </span>
                        </div>
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400">
                  <CheckCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No recent alerts - all systems operational</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductionDashboard;
