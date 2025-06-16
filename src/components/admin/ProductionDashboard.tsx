import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Database, Wifi } from 'lucide-react';
import { realDataIntegrationService } from '@/services/realDataIntegrationService';
import { monitoringService, PerformanceMetrics } from '@/services/monitoringService';
import { productionConfigService } from '@/services/productionConfigService';
import { supabase } from '@/integrations/supabase/client';
import { SystemStatusCards } from './SystemStatusCards';
import { ResourceUsageCard } from './ResourceUsageCard';
import { DatabaseHealthCard } from './DatabaseHealthCard';
import { DataSourcesGrid } from './DataSourcesGrid';
import { ApiKeysStatus } from './ApiKeysStatus';
import { SecurityStatus } from './SecurityStatus';
import { AlertsPanel } from './AlertsPanel';

const ProductionDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [systemHealth, setSystemHealth] = useState<any>(null);
  const [recentAlerts, setRecentAlerts] = useState<any[]>([]);
  const [providers, setProviders] = useState<any>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [configuredSecrets, setConfiguredSecrets] = useState<string[]>([]);

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
    checkConfiguredSecrets();

    return unsubscribe;
  }, []);

  const checkConfiguredSecrets = async () => {
    const secrets = [];
    
    try {
      // Check AISStream integration - look for recent vessel positions from aisstream
      const { data: recentAisData } = await supabase
        .from('vessel_positions')
        .select('id')
        .eq('source_feed', 'aisstream')
        .gte('timestamp_utc', new Date(Date.now() - 300000).toISOString()) // Last 5 minutes
        .limit(1);

      if (recentAisData && recentAisData.length > 0) {
        secrets.push('AISSTREAM_API_KEY');
        console.log('✅ AISStream API key is working - found recent data');
      } else {
        console.log('⚠️ No recent AISStream data found');
      }
    } catch (e) {
      console.error('Error checking AISStream data:', e);
    }

    try {
      // Test weather API
      const { error: weatherError } = await supabase.functions.invoke('weather-data', {
        body: { lat: 0, lng: 0 }
      });
      if (!weatherError || !weatherError.message?.includes('API key')) {
        secrets.push('OPENWEATHER_API_KEY');
        console.log('✅ OpenWeather API key is working');
      }
    } catch (e) {
      console.log('⚠️ OpenWeather API key not working or not configured');
    }

    try {
      // Test satellite API
      const { error: satError } = await supabase.functions.invoke('satellite-data', {
        body: { bbox: { coordinates: [[[-1, 50], [1, 50], [1, 52], [-1, 52], [-1, 50]]] } }
      });
      if (!satError || !satError.message?.includes('API key')) {
        secrets.push('PLANET_API_KEY');
        console.log('✅ Planet API key is working');
      }
    } catch (e) {
      console.log('⚠️ Planet API key not working or not configured');
    }

    console.log('📊 Configured API keys:', secrets);
    setConfiguredSecrets(secrets);
  };

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
      <SystemStatusCards metrics={metrics} />

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
            <ResourceUsageCard metrics={metrics} />
            <DatabaseHealthCard systemHealth={systemHealth} />
          </div>
        </TabsContent>

        <TabsContent value="data-sources" className="space-y-6">
          <DataSourcesGrid providers={providers} />
        </TabsContent>

        <TabsContent value="configuration" className="space-y-6">
          <ApiKeysStatus 
            configuredSecrets={configuredSecrets} 
            requiredKeys={requiredKeys} 
          />
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <SecurityStatus />
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <AlertsPanel recentAlerts={recentAlerts} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductionDashboard;
