
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Wifi, 
  Cloud, 
  Anchor, 
  Newspaper, 
  Satellite,
  WifiOff,
  AlertCircle,
  CheckCircle,
  RefreshCw
} from "lucide-react";

interface DataSource {
  id: string;
  name: string;
  type: 'ais' | 'weather' | 'port' | 'news' | 'satellite';
  status: 'connected' | 'disconnected' | 'error' | 'syncing';
  provider: string;
  lastUpdate: string;
  dataPoints: number;
  reliability: number;
  latency: number;
  enabled: boolean;
}

const AdvancedDataSources: React.FC = () => {
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [activeTab, setActiveTab] = useState<string>('ais');

  useEffect(() => {
    // Initialize data sources
    const initSources: DataSource[] = [
      {
        id: 'exactearth-ais',
        name: 'ExactEarth AIS Feed',
        type: 'ais',
        status: 'connected',
        provider: 'ExactEarth',
        lastUpdate: '2024-01-15T10:45:23Z',
        dataPoints: 45672,
        reliability: 98.5,
        latency: 2.3,
        enabled: true
      },
      {
        id: 'spire-ais',
        name: 'Spire Global AIS',
        type: 'ais',
        status: 'connected',
        provider: 'Spire Global',
        lastUpdate: '2024-01-15T10:45:18Z',
        dataPoints: 38541,
        reliability: 96.8,
        latency: 3.1,
        enabled: true
      },
      {
        id: 'openweather',
        name: 'OpenWeatherMap',
        type: 'weather',
        status: 'connected',
        provider: 'OpenWeather',
        lastUpdate: '2024-01-15T10:30:00Z',
        dataPoints: 1247,
        reliability: 94.2,
        latency: 1.8,
        enabled: true
      },
      {
        id: 'noaa-weather',
        name: 'NOAA Marine Weather',
        type: 'weather',
        status: 'syncing',
        provider: 'NOAA',
        lastUpdate: '2024-01-15T10:25:45Z',
        dataPoints: 892,
        reliability: 99.1,
        latency: 4.2,
        enabled: true
      },
      {
        id: 'portcall-api',
        name: 'Port Call Optimization API',
        type: 'port',
        status: 'connected',
        provider: 'Port Authority Network',
        lastUpdate: '2024-01-15T10:40:12Z',
        dataPoints: 634,
        reliability: 91.7,
        latency: 5.6,
        enabled: true
      },
      {
        id: 'lloyd-intel',
        name: "Lloyd's Intelligence",
        type: 'news',
        status: 'error',
        provider: "Lloyd's List",
        lastUpdate: '2024-01-15T09:15:30Z',
        dataPoints: 156,
        reliability: 87.3,
        latency: 12.4,
        enabled: false
      },
      {
        id: 'sentinel-hub',
        name: 'Sentinel Hub Satellite',
        type: 'satellite',
        status: 'connected',
        provider: 'ESA Copernicus',
        lastUpdate: '2024-01-15T08:30:00Z',
        dataPoints: 89,
        reliability: 96.4,
        latency: 45.2,
        enabled: true
      }
    ];
    setDataSources(initSources);
  }, []);

  const toggleDataSource = (sourceId: string) => {
    setDataSources(prev => prev.map(source => 
      source.id === sourceId 
        ? { ...source, enabled: !source.enabled }
        : source
    ));
  };

  const refreshDataSource = (sourceId: string) => {
    setDataSources(prev => prev.map(source => 
      source.id === sourceId 
        ? { ...source, status: 'syncing' as const }
        : source
    ));

    // Simulate refresh
    setTimeout(() => {
      setDataSources(prev => prev.map(source => 
        source.id === sourceId 
          ? { 
              ...source, 
              status: 'connected' as const,
              lastUpdate: new Date().toISOString(),
              dataPoints: source.dataPoints + Math.floor(Math.random() * 100)
            }
          : source
      ));
    }, 2000);
  };

  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'ais': return Wifi;
      case 'weather': return Cloud;
      case 'port': return Anchor;
      case 'news': return Newspaper;
      case 'satellite': return Satellite;
      default: return Wifi;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return CheckCircle;
      case 'syncing': return RefreshCw;
      case 'error': return AlertCircle;
      case 'disconnected': return WifiOff;
      default: return AlertCircle;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-400 border-green-400';
      case 'syncing': return 'text-yellow-400 border-yellow-400';
      case 'error': return 'text-red-400 border-red-400';
      case 'disconnected': return 'text-slate-400 border-slate-400';
      default: return 'text-slate-400 border-slate-400';
    }
  };

  const sourcesByType = dataSources.reduce((acc, source) => {
    if (!acc[source.type]) acc[source.type] = [];
    acc[source.type].push(source);
    return acc;
  }, {} as Record<string, DataSource[]>);

  const typeLabels = {
    ais: 'AIS Feeds',
    weather: 'Weather Data',
    port: 'Port Authorities',
    news: 'Intelligence Sources',
    satellite: 'Satellite Imagery'
  };

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <span className="flex items-center space-x-2">
            <Satellite className="h-5 w-5 text-blue-400" />
            <span>Advanced Data Sources</span>
          </span>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-blue-400 border-blue-400">
              {dataSources.filter(s => s.status === 'connected').length} ACTIVE
            </Badge>
            <Badge variant="outline" className="text-green-400 border-green-400">
              {dataSources.reduce((sum, s) => sum + s.dataPoints, 0).toLocaleString()} DATA POINTS
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            {Object.entries(typeLabels).map(([type, label]) => {
              const Icon = getSourceIcon(type);
              return (
                <TabsTrigger key={type} value={type} className="text-xs">
                  <Icon className="h-3 w-3 mr-1" />
                  {label.split(' ')[0]}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {Object.entries(sourcesByType).map(([type, sources]) => (
            <TabsContent key={type} value={type} className="space-y-4">
              <div className="space-y-3">
                {sources.map(source => {
                  const StatusIcon = getStatusIcon(source.status);
                  return (
                    <div key={source.id} className="bg-slate-900 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <Switch
                            checked={source.enabled}
                            onCheckedChange={() => toggleDataSource(source.id)}
                          />
                          <div>
                            <h4 className="text-white font-medium">{source.name}</h4>
                            <p className="text-sm text-slate-400">{source.provider}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className={getStatusColor(source.status)}>
                            <StatusIcon className={`h-3 w-3 mr-1 ${source.status === 'syncing' ? 'animate-spin' : ''}`} />
                            {source.status.toUpperCase()}
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => refreshDataSource(source.id)}
                            disabled={source.status === 'syncing'}
                            className="text-xs"
                          >
                            <RefreshCw className={`h-3 w-3 ${source.status === 'syncing' ? 'animate-spin' : ''}`} />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-slate-400">Data Points</span>
                          <div className="text-white font-mono">{source.dataPoints.toLocaleString()}</div>
                        </div>
                        <div>
                          <span className="text-slate-400">Reliability</span>
                          <div className="text-white">{source.reliability}%</div>
                          <Progress value={source.reliability} className="h-1 mt-1" />
                        </div>
                        <div>
                          <span className="text-slate-400">Latency</span>
                          <div className="text-white">{source.latency}s</div>
                        </div>
                        <div>
                          <span className="text-slate-400">Last Update</span>
                          <div className="text-white">
                            {new Date(source.lastUpdate).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AdvancedDataSources;
