
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Play, 
  Square, 
  Settings, 
  Activity, 
  Database,
  Wifi,
  MapPin,
  Satellite,
  CloudRain,
  Ship
} from 'lucide-react';
import { realTimeDataFeedManager } from '@/services/realTimeDataFeedManager';
import { toast } from 'sonner';

const DataFeedController: React.FC = () => {
  const [feedStatus, setFeedStatus] = useState(realTimeDataFeedManager.getStatus());
  const [metrics, setMetrics] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMetrics();
    const interval = setInterval(() => {
      setFeedStatus(realTimeDataFeedManager.getStatus());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const loadMetrics = async () => {
    const data = await realTimeDataFeedManager.getDataFeedMetrics();
    setMetrics(data);
  };

  const handleStartFeeds = async () => {
    setLoading(true);
    try {
      await realTimeDataFeedManager.startDataFeeds();
      setFeedStatus(realTimeDataFeedManager.getStatus());
      toast.success('Real-time data feeds started successfully!');
      setTimeout(loadMetrics, 1000);
    } catch (error: any) {
      toast.error(`Failed to start data feeds: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleStopFeeds = () => {
    setLoading(true);
    try {
      realTimeDataFeedManager.stopDataFeeds();
      setFeedStatus(realTimeDataFeedManager.getStatus());
      toast.success('Real-time data feeds stopped');
      setTimeout(loadMetrics, 1000);
    } catch (error: any) {
      toast.error(`Failed to stop data feeds: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleConfigChange = (type: 'ais' | 'weather' | 'satellite', enabled: boolean) => {
    const newConfig = {
      ...feedStatus.config,
      [type]: { ...feedStatus.config[type], enabled }
    };
    realTimeDataFeedManager.updateConfig(newConfig);
    setFeedStatus(realTimeDataFeedManager.getStatus());
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-cyan-400" />
              <span>Real-Time Data Feed Controller</span>
            </div>
            <Badge variant="outline" className={feedStatus.isRunning ? 'text-green-400 border-green-400' : 'text-slate-400 border-slate-400'}>
              {feedStatus.isRunning ? (
                <>
                  <Activity className="h-3 w-3 mr-1 animate-pulse" />
                  ACTIVE
                </>
              ) : 'STOPPED'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Control Buttons */}
            <div className="flex space-x-3">
              <Button
                onClick={handleStartFeeds}
                disabled={loading || feedStatus.isRunning}
                className="bg-green-600 hover:bg-green-700"
              >
                <Play className="h-4 w-4 mr-2" />
                Start Data Feeds
              </Button>
              <Button
                onClick={handleStopFeeds}
                disabled={loading || !feedStatus.isRunning}
                variant="destructive"
              >
                <Square className="h-4 w-4 mr-2" />
                Stop Data Feeds
              </Button>
            </div>

            {/* Feed Configuration */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-900 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Ship className="h-4 w-4 text-blue-400" />
                    <span className="text-white font-medium">AIS Data</span>
                  </div>
                  <Switch
                    checked={feedStatus.config.ais.enabled}
                    onCheckedChange={(enabled) => handleConfigChange('ais', enabled)}
                  />
                </div>
                <div className="space-y-1 text-sm text-slate-300">
                  <p>Interval: {feedStatus.config.ais.interval} minutes</p>
                  <p>Providers: {feedStatus.config.ais.providers.length}</p>
                  <p>Regions: {feedStatus.config.ais.regions.length}</p>
                </div>
              </div>

              <div className="p-4 bg-slate-900 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <CloudRain className="h-4 w-4 text-green-400" />
                    <span className="text-white font-medium">Weather Data</span>
                  </div>
                  <Switch
                    checked={feedStatus.config.weather.enabled}
                    onCheckedChange={(enabled) => handleConfigChange('weather', enabled)}
                  />
                </div>
                <div className="space-y-1 text-sm text-slate-300">
                  <p>Interval: {feedStatus.config.weather.interval} minutes</p>
                  <p>Locations: {feedStatus.config.weather.locations.length}</p>
                </div>
              </div>

              <div className="p-4 bg-slate-900 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Satellite className="h-4 w-4 text-purple-400" />
                    <span className="text-white font-medium">Satellite Data</span>
                  </div>
                  <Switch
                    checked={feedStatus.config.satellite.enabled}
                    onCheckedChange={(enabled) => handleConfigChange('satellite', enabled)}
                  />
                </div>
                <div className="space-y-1 text-sm text-slate-300">
                  <p>Interval: {feedStatus.config.satellite.interval} hours</p>
                  <p>Regions: {feedStatus.config.satellite.regions.length}</p>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            {metrics.length > 0 && (
              <div>
                <h3 className="text-white font-medium mb-3 flex items-center">
                  <Settings className="h-4 w-4 mr-2" />
                  Recent Activity
                </h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {metrics.slice(0, 5).map((metric, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-slate-900 rounded text-sm">
                      <span className="text-slate-300">
                        {metric.metadata?.activity || 'System activity'}
                      </span>
                      <span className="text-slate-400">
                        {new Date(metric.timestamp_utc).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Status Information */}
            <div className="p-4 bg-slate-900 rounded-lg">
              <h3 className="text-white font-medium mb-3 flex items-center">
                <Wifi className="h-4 w-4 mr-2" />
                System Status
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-400">Data Feeds:</span>
                  <span className="text-white ml-2">
                    {feedStatus.isRunning ? 'Running' : 'Stopped'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Active Sources:</span>
                  <span className="text-white ml-2">
                    {Object.values(feedStatus.config).filter(config => config.enabled).length}/3
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataFeedController;
