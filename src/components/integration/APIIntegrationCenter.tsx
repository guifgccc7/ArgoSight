
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Globe, 
  Webhook, 
  Database, 
  Code, 
  Key, 
  Activity,
  Send,
  Download,
  Upload,
  Link,
  Shield,
  Zap,
  Clock,
  CheckCircle,
  AlertTriangle
} from "lucide-react";

interface APIEndpoint {
  id: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  status: 'active' | 'deprecated' | 'maintenance';
  requests24h: number;
  avgResponseTime: number;
  successRate: number;
}

interface Integration {
  id: string;
  name: string;
  type: 'maritime-authority' | 'port-system' | 'weather-service' | 'satellite-provider';
  status: 'connected' | 'disconnected' | 'error';
  lastSync: string;
  dataPoints: number;
  reliability: number;
}

const APIIntegrationCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  
  const [apiEndpoints] = useState<APIEndpoint[]>([
    {
      id: 'vessels',
      name: 'Vessel Tracking API',
      method: 'GET',
      path: '/api/v1/vessels',
      description: 'Real-time vessel position and status data',
      status: 'active',
      requests24h: 15847,
      avgResponseTime: 89,
      successRate: 99.7
    },
    {
      id: 'alerts',
      name: 'Alert Management API',
      method: 'POST',
      path: '/api/v1/alerts',
      description: 'Create and manage security alerts',
      status: 'active',
      requests24h: 3421,
      avgResponseTime: 156,
      successRate: 98.9
    },
    {
      id: 'intelligence',
      name: 'Intelligence Data API',
      method: 'GET',
      path: '/api/v1/intelligence',
      description: 'Access processed intelligence reports',
      status: 'active',
      requests24h: 8762,
      avgResponseTime: 234,
      successRate: 99.2
    },
    {
      id: 'routes',
      name: 'Route Optimization API',
      method: 'POST',
      path: '/api/v1/routes/optimize',
      description: 'Calculate optimal shipping routes',
      status: 'maintenance',
      requests24h: 2156,
      avgResponseTime: 1247,
      successRate: 97.8
    }
  ]);

  const [integrations] = useState<Integration[]>([
    {
      id: 'imo',
      name: 'International Maritime Organization',
      type: 'maritime-authority',
      status: 'connected',
      lastSync: '2025-06-12T10:30:00Z',
      dataPoints: 2847562,
      reliability: 99.1
    },
    {
      id: 'noaa',
      name: 'NOAA Weather Service',
      type: 'weather-service',
      status: 'connected',
      lastSync: '2025-06-12T10:25:00Z',
      dataPoints: 1567834,
      reliability: 98.7
    },
    {
      id: 'port-hamburg',
      name: 'Port of Hamburg System',
      type: 'port-system',
      status: 'connected',
      lastSync: '2025-06-12T10:20:00Z',
      dataPoints: 845267,
      reliability: 97.5
    },
    {
      id: 'satellite-feed',
      name: 'Satellite Imagery Provider',
      type: 'satellite-provider',
      status: 'error',
      lastSync: '2025-06-12T09:45:00Z',
      dataPoints: 3421876,
      reliability: 85.4
    }
  ]);

  const apiStats = {
    totalRequests: 156842,
    avgResponseTime: 167,
    uptime: 99.8,
    activeIntegrations: integrations.filter(i => i.status === 'connected').length
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'connected': return 'text-green-400 border-green-400';
      case 'maintenance': return 'text-yellow-400 border-yellow-400';
      case 'deprecated':
      case 'disconnected':
      case 'error': return 'text-red-400 border-red-400';
      default: return 'text-slate-400 border-slate-400';
    }
  };

  const getMethodColor = (method: APIEndpoint['method']) => {
    switch (method) {
      case 'GET': return 'bg-blue-600';
      case 'POST': return 'bg-green-600';
      case 'PUT': return 'bg-yellow-600';
      case 'DELETE': return 'bg-red-600';
      default: return 'bg-slate-600';
    }
  };

  const getIntegrationIcon = (type: Integration['type']) => {
    switch (type) {
      case 'maritime-authority': return <Shield className="h-4 w-4" />;
      case 'port-system': return <Database className="h-4 w-4" />;
      case 'weather-service': return <Activity className="h-4 w-4" />;
      case 'satellite-provider': return <Globe className="h-4 w-4" />;
      default: return <Link className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">API & Integration Center</h2>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-green-400 border-green-400">
            <Globe className="h-3 w-3 mr-1" />
            {apiStats.activeIntegrations} CONNECTED
          </Badge>
          <Badge variant="outline" className="text-cyan-400 border-cyan-400">
            {apiStats.uptime}% UPTIME
          </Badge>
        </div>
      </div>

      {/* API Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Send className="h-8 w-8 text-blue-400" />
              <div>
                <p className="text-sm text-slate-400">API Requests (24h)</p>
                <p className="text-2xl font-bold text-white">{apiStats.totalRequests.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Clock className="h-8 w-8 text-green-400" />
              <div>
                <p className="text-sm text-slate-400">Avg Response Time</p>
                <p className="text-2xl font-bold text-white">{apiStats.avgResponseTime}ms</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Activity className="h-8 w-8 text-purple-400" />
              <div>
                <p className="text-sm text-slate-400">System Uptime</p>
                <p className="text-2xl font-bold text-white">{apiStats.uptime}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Link className="h-8 w-8 text-cyan-400" />
              <div>
                <p className="text-sm text-slate-400">Active Integrations</p>
                <p className="text-2xl font-bold text-white">{apiStats.activeIntegrations}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <Activity className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="endpoints" className="flex items-center space-x-2">
            <Code className="h-4 w-4" />
            <span>API Endpoints</span>
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center space-x-2">
            <Globe className="h-4 w-4" />
            <span>External Integrations</span>
          </TabsTrigger>
          <TabsTrigger value="webhooks" className="flex items-center space-x-2">
            <Webhook className="h-4 w-4" />
            <span>Webhooks</span>
          </TabsTrigger>
          <TabsTrigger value="keys" className="flex items-center space-x-2">
            <Key className="h-4 w-4" />
            <span>API Keys</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">API Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Success Rate</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={99.2} className="w-20 h-2" />
                      <span className="text-green-400 font-mono">99.2%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Error Rate</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={0.8} className="w-20 h-2" />
                      <span className="text-red-400 font-mono">0.8%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Cache Hit Rate</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={87.4} className="w-20 h-2" />
                      <span className="text-cyan-400 font-mono">87.4%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Integration Health</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-400">{integrations.filter(i => i.status === 'connected').length}</div>
                    <p className="text-xs text-slate-400">Connected</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-400">{integrations.filter(i => i.status === 'error').length}</div>
                    <p className="text-xs text-slate-400">Error</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-cyan-400">8.2M</div>
                    <p className="text-xs text-slate-400">Data Points/Day</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-400">97.8%</div>
                    <p className="text-xs text-slate-400">Avg Reliability</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="endpoints">
          <div className="space-y-4">
            {apiEndpoints.map((endpoint) => (
              <Card key={endpoint.id} className="bg-slate-800 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Badge className={`${getMethodColor(endpoint.method)} text-white`}>
                        {endpoint.method}
                      </Badge>
                      <div>
                        <h3 className="text-white font-medium">{endpoint.name}</h3>
                        <p className="text-sm text-slate-400 font-mono">{endpoint.path}</p>
                        <p className="text-sm text-slate-500">{endpoint.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6 text-right">
                      <div>
                        <p className="text-sm text-slate-400">Requests (24h)</p>
                        <p className="text-white font-medium">{endpoint.requests24h.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">Avg Response</p>
                        <p className="text-white font-medium">{endpoint.avgResponseTime}ms</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">Success Rate</p>
                        <p className="text-green-400 font-medium">{endpoint.successRate}%</p>
                      </div>
                      <Badge variant="outline" className={getStatusColor(endpoint.status)}>
                        {endpoint.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="integrations">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {integrations.map((integration) => (
              <Card key={integration.id} className="bg-slate-800 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-slate-900 rounded-lg">
                        {getIntegrationIcon(integration.type)}
                      </div>
                      <div>
                        <h3 className="text-white font-medium">{integration.name}</h3>
                        <p className="text-sm text-slate-400 capitalize">{integration.type.replace('-', ' ')}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className={getStatusColor(integration.status)}>
                      {integration.status === 'connected' && <CheckCircle className="h-3 w-3 mr-1" />}
                      {integration.status === 'error' && <AlertTriangle className="h-3 w-3 mr-1" />}
                      {integration.status.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Last Sync</span>
                      <span className="text-white">
                        {new Date(integration.lastSync).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Data Points</span>
                      <span className="text-white font-mono">
                        {(integration.dataPoints / 1000000).toFixed(1)}M
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Reliability</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={integration.reliability} className="w-16 h-2" />
                        <span className="text-cyan-400 font-mono">{integration.reliability}%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="webhooks">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Webhook Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-slate-400">
                <Webhook className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Real-Time Notifications</h3>
                <p className="mb-4">Configure webhooks for instant alerts and data updates</p>
                <Button className="bg-cyan-600 hover:bg-cyan-700">
                  <Webhook className="h-4 w-4 mr-2" />
                  Configure Webhooks
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="keys">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">API Key Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-900 rounded-lg border border-slate-700">
                  <div className="flex items-center space-x-3">
                    <Key className="h-6 w-6 text-cyan-400" />
                    <div>
                      <h4 className="text-white font-medium">Production API Key</h4>
                      <p className="text-sm text-slate-400 font-mono">mk_prod_••••••••••••••••••••••••</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline" className="text-green-400 border-green-400">ACTIVE</Badge>
                    <Button variant="outline" size="sm" className="text-white border-slate-600">
                      Regenerate
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-900 rounded-lg border border-slate-700">
                  <div className="flex items-center space-x-3">
                    <Key className="h-6 w-6 text-purple-400" />
                    <div>
                      <h4 className="text-white font-medium">Development API Key</h4>
                      <p className="text-sm text-slate-400 font-mono">mk_dev_••••••••••••••••••••••••</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline" className="text-green-400 border-green-400">ACTIVE</Badge>
                    <Button variant="outline" size="sm" className="text-white border-slate-600">
                      Regenerate
                    </Button>
                  </div>
                </div>

                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <Key className="h-4 w-4 mr-2" />
                  Generate New API Key
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default APIIntegrationCenter;
