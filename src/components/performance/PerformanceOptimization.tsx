
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Zap, 
  Database, 
  Cpu, 
  HardDrive, 
  Wifi, 
  Smartphone,
  CloudDownload,
  Gauge,
  TrendingUp,
  Settings,
  RefreshCw,
  Layers
} from "lucide-react";

interface PerformanceMetrics {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  networkLatency: number;
  cacheHitRate: number;
  apiResponseTime: number;
  pageLoadTime: number;
  dataProcessingSpeed: number;
  mlModelLatency: number;
  compressionRatio: number;
}

interface OptimizationFeature {
  id: string;
  name: string;
  description: string;
  status: 'enabled' | 'disabled' | 'optimizing';
  impact: 'high' | 'medium' | 'low';
  savings: string;
}

const PerformanceOptimization: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    cpuUsage: 45,
    memoryUsage: 67,
    diskUsage: 23,
    networkLatency: 28,
    cacheHitRate: 94,
    apiResponseTime: 245,
    pageLoadTime: 1.2,
    dataProcessingSpeed: 2847,
    mlModelLatency: 89,
    compressionRatio: 78
  });

  const [optimizations, setOptimizations] = useState<OptimizationFeature[]>([
    {
      id: 'pwa',
      name: 'Progressive Web App',
      description: 'Enable offline functionality and app-like experience',
      status: 'enabled',
      impact: 'high',
      savings: '40% faster load times'
    },
    {
      id: 'compression',
      name: 'Data Compression',
      description: 'Compress API responses and static assets',
      status: 'enabled',
      impact: 'high',
      savings: '65% bandwidth reduction'
    },
    {
      id: 'caching',
      name: 'Intelligent Caching',
      description: 'Multi-layer caching with smart invalidation',
      status: 'enabled',
      impact: 'high',
      savings: '80% cache hit rate'
    },
    {
      id: 'ml-optimization',
      name: 'ML Model Optimization',
      description: 'WebAssembly-based ML acceleration',
      status: 'optimizing',
      impact: 'medium',
      savings: '60% inference speed'
    },
    {
      id: 'lazy-loading',
      name: 'Progressive Loading',
      description: 'Load data and components on demand',
      status: 'enabled',
      impact: 'medium',
      savings: '30% initial load time'
    },
    {
      id: 'cdn',
      name: 'Global CDN',
      description: 'Distribute assets via edge locations',
      status: 'disabled',
      impact: 'high',
      savings: '50% global latency'
    }
  ]);

  useEffect(() => {
    // Simulate real-time performance monitoring
    const interval = setInterval(() => {
      setMetrics(prev => ({
        cpuUsage: Math.max(20, Math.min(80, prev.cpuUsage + (Math.random() - 0.5) * 10)),
        memoryUsage: Math.max(40, Math.min(90, prev.memoryUsage + (Math.random() - 0.5) * 8)),
        diskUsage: Math.max(10, Math.min(50, prev.diskUsage + (Math.random() - 0.5) * 5)),
        networkLatency: Math.max(15, Math.min(100, prev.networkLatency + (Math.random() - 0.5) * 15)),
        cacheHitRate: Math.max(85, Math.min(99, prev.cacheHitRate + (Math.random() - 0.5) * 3)),
        apiResponseTime: Math.max(100, Math.min(500, prev.apiResponseTime + (Math.random() - 0.5) * 50)),
        pageLoadTime: Math.max(0.8, Math.min(3.0, prev.pageLoadTime + (Math.random() - 0.5) * 0.3)),
        dataProcessingSpeed: Math.max(2000, Math.min(5000, prev.dataProcessingSpeed + (Math.random() - 0.5) * 200)),
        mlModelLatency: Math.max(50, Math.min(200, prev.mlModelLatency + (Math.random() - 0.5) * 20)),
        compressionRatio: Math.max(70, Math.min(85, prev.compressionRatio + (Math.random() - 0.5) * 2))
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: OptimizationFeature['status']) => {
    switch (status) {
      case 'enabled': return 'text-green-400 border-green-400';
      case 'disabled': return 'text-red-400 border-red-400';
      case 'optimizing': return 'text-yellow-400 border-yellow-400';
      default: return 'text-slate-400 border-slate-400';
    }
  };

  const getImpactColor = (impact: OptimizationFeature['impact']) => {
    switch (impact) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-slate-400';
    }
  };

  const toggleOptimization = (id: string) => {
    setOptimizations(prev => prev.map(opt => {
      if (opt.id === id) {
        const newStatus = opt.status === 'enabled' ? 'disabled' : 
                         opt.status === 'disabled' ? 'optimizing' : 'enabled';
        return { ...opt, status: newStatus };
      }
      return opt;
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Performance Optimization Center</h2>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-green-400 border-green-400">
            <Zap className="h-3 w-3 mr-1" />
            OPTIMIZED
          </Badge>
          <Badge variant="outline" className="text-cyan-400 border-cyan-400">
            PWA ENABLED
          </Badge>
        </div>
      </div>

      {/* Performance Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Cpu className="h-6 w-6 text-blue-400" />
              <div>
                <p className="text-xs text-slate-400">CPU Usage</p>
                <p className="text-lg font-bold text-white">{metrics.cpuUsage.toFixed(1)}%</p>
                <Progress value={metrics.cpuUsage} className="w-full h-1 mt-1" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <HardDrive className="h-6 w-6 text-purple-400" />
              <div>
                <p className="text-xs text-slate-400">Memory</p>
                <p className="text-lg font-bold text-white">{metrics.memoryUsage.toFixed(1)}%</p>
                <Progress value={metrics.memoryUsage} className="w-full h-1 mt-1" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Wifi className="h-6 w-6 text-green-400" />
              <div>
                <p className="text-xs text-slate-400">Latency</p>
                <p className="text-lg font-bold text-white">{metrics.networkLatency}ms</p>
                <Progress value={100 - metrics.networkLatency} className="w-full h-1 mt-1" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Database className="h-6 w-6 text-cyan-400" />
              <div>
                <p className="text-xs text-slate-400">Cache Hit</p>
                <p className="text-lg font-bold text-white">{metrics.cacheHitRate.toFixed(1)}%</p>
                <Progress value={metrics.cacheHitRate} className="w-full h-1 mt-1" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Gauge className="h-6 w-6 text-orange-400" />
              <div>
                <p className="text-xs text-slate-400">Load Time</p>
                <p className="text-lg font-bold text-white">{metrics.pageLoadTime.toFixed(1)}s</p>
                <Progress value={Math.max(0, 100 - (metrics.pageLoadTime * 30))} className="w-full h-1 mt-1" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <Gauge className="h-4 w-4" />
            <span>Performance Overview</span>
          </TabsTrigger>
          <TabsTrigger value="optimizations" className="flex items-center space-x-2">
            <Zap className="h-4 w-4" />
            <span>Optimizations</span>
          </TabsTrigger>
          <TabsTrigger value="pwa" className="flex items-center space-x-2">
            <Smartphone className="h-4 w-4" />
            <span>PWA Features</span>
          </TabsTrigger>
          <TabsTrigger value="caching" className="flex items-center space-x-2">
            <Database className="h-4 w-4" />
            <span>Caching Strategy</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Real-Time Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">API Response Time</span>
                    <span className="text-white font-mono">{metrics.apiResponseTime}ms</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Data Processing Speed</span>
                    <span className="text-white font-mono">{metrics.dataProcessingSpeed.toLocaleString()}/s</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">ML Model Latency</span>
                    <span className="text-white font-mono">{metrics.mlModelLatency}ms</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Compression Ratio</span>
                    <span className="text-white font-mono">{metrics.compressionRatio}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Optimization Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400 mb-2">67%</div>
                    <p className="text-slate-400">Overall Performance Improvement</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-cyan-400">-45%</div>
                      <p className="text-xs text-slate-400">Load Time</p>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-green-400">+80%</div>
                      <p className="text-xs text-slate-400">Cache Hit Rate</p>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-blue-400">-60%</div>
                      <p className="text-xs text-slate-400">Bandwidth Usage</p>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-purple-400">+120%</div>
                      <p className="text-xs text-slate-400">Processing Speed</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="optimizations">
          <div className="space-y-4">
            {optimizations.map((optimization) => (
              <Card key={optimization.id} className="bg-slate-800 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-slate-900 rounded-lg">
                        <Zap className="h-6 w-6 text-cyan-400" />
                      </div>
                      <div>
                        <h3 className="text-white font-medium">{optimization.name}</h3>
                        <p className="text-sm text-slate-400">{optimization.description}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-slate-500">Impact:</span>
                          <span className={`text-xs font-medium ${getImpactColor(optimization.impact)}`}>
                            {optimization.impact.toUpperCase()}
                          </span>
                          <span className="text-xs text-slate-500">•</span>
                          <span className="text-xs text-green-400">{optimization.savings}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline" className={getStatusColor(optimization.status)}>
                        {optimization.status === 'optimizing' && <RefreshCw className="h-3 w-3 mr-1 animate-spin" />}
                        {optimization.status.toUpperCase()}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleOptimization(optimization.id)}
                        className="text-white border-slate-600"
                      >
                        {optimization.status === 'enabled' ? 'Disable' : 'Enable'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pwa">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">PWA Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Offline Functionality</span>
                  <Badge variant="outline" className="text-green-400 border-green-400">ENABLED</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Push Notifications</span>
                  <Badge variant="outline" className="text-green-400 border-green-400">ENABLED</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">App-like Experience</span>
                  <Badge variant="outline" className="text-green-400 border-green-400">ACTIVE</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Background Sync</span>
                  <Badge variant="outline" className="text-cyan-400 border-cyan-400">CONFIGURED</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Offline Capabilities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-slate-400">
                  <CloudDownload className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">Critical Data Cached</h3>
                  <p className="mb-4">Essential maritime intelligence available offline</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-white font-medium">156 MB</div>
                      <div className="text-xs">Cached Data</div>
                    </div>
                    <div>
                      <div className="text-white font-medium">48 hours</div>
                      <div className="text-xs">Offline Duration</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="caching">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Multi-Layer Caching Strategy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-slate-900 rounded-lg border border-slate-700">
                  <Layers className="h-12 w-12 mx-auto mb-4 text-blue-400" />
                  <h3 className="text-white font-medium mb-2">Browser Cache</h3>
                  <p className="text-sm text-slate-400 mb-4">Static assets and resources</p>
                  <div className="text-2xl font-bold text-green-400">95%</div>
                  <p className="text-xs text-slate-400">Hit Rate</p>
                </div>
                <div className="text-center p-6 bg-slate-900 rounded-lg border border-slate-700">
                  <Database className="h-12 w-12 mx-auto mb-4 text-purple-400" />
                  <h3 className="text-white font-medium mb-2">Memory Cache</h3>
                  <p className="text-sm text-slate-400 mb-4">Frequently accessed data</p>
                  <div className="text-2xl font-bold text-green-400">89%</div>
                  <p className="text-xs text-slate-400">Hit Rate</p>
                </div>
                <div className="text-center p-6 bg-slate-900 rounded-lg border border-slate-700">
                  <HardDrive className="h-12 w-12 mx-auto mb-4 text-green-400" />
                  <h3 className="text-white font-medium mb-2">Disk Cache</h3>
                  <p className="text-sm text-slate-400 mb-4">Large datasets and files</p>
                  <div className="text-2xl font-bold text-green-400">76%</div>
                  <p className="text-xs text-slate-400">Hit Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PerformanceOptimization;
