
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  TrendingUp, 
  Map, 
  Users, 
  DollarSign,
  BarChart3,
  Activity,
  Globe,
  Zap,
  Target,
  Layers
} from "lucide-react";
import { LineChart, Line, AreaChart, Area, ScatterPlot, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Treemap, Cell } from 'recharts';

interface TimeSeriesData {
  timestamp: string;
  vesselCount: number;
  threatLevel: number;
  portActivity: number;
  economicImpact: number;
}

interface GeospatialData {
  region: string;
  activity: number;
  risk: number;
  vessels: number;
  coordinates: [number, number];
}

interface NetworkData {
  vessel: string;
  connections: number;
  centrality: number;
  suspiciousConnections: number;
}

const AdvancedAnalyticsDashboard: React.FC = () => {
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([]);
  const [geospatialData, setGeospatialData] = useState<GeospatialData[]>([]);
  const [networkData, setNetworkData] = useState<NetworkData[]>([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');

  useEffect(() => {
    // Generate time series data
    const generateTimeSeriesData = (): TimeSeriesData[] => {
      const data: TimeSeriesData[] = [];
      const now = new Date();
      
      for (let i = 23; i >= 0; i--) {
        const timestamp = new Date(now.getTime() - i * 3600000).toISOString();
        data.push({
          timestamp,
          vesselCount: 1200 + Math.floor(Math.random() * 300),
          threatLevel: 2 + Math.random() * 3,
          portActivity: 70 + Math.random() * 30,
          economicImpact: 5000000 + Math.random() * 2000000
        });
      }
      return data;
    };

    // Generate geospatial data
    const generateGeospatialData = (): GeospatialData[] => [
      { region: 'Baltic Sea North', activity: 85, risk: 23, vessels: 342, coordinates: [60.0, 20.0] },
      { region: 'Baltic Sea Central', activity: 92, risk: 45, vessels: 567, coordinates: [58.0, 18.0] },
      { region: 'Baltic Sea South', activity: 78, risk: 12, vessels: 234, coordinates: [56.0, 16.0] },
      { region: 'Gotland Basin', activity: 67, risk: 67, vessels: 123, coordinates: [57.0, 19.0] },
      { region: 'Gulf of Finland', activity: 89, risk: 34, vessels: 456, coordinates: [60.0, 27.0] },
      { region: 'Gulf of Bothnia', activity: 56, risk: 18, vessels: 189, coordinates: [63.0, 20.0] }
    ];

    // Generate network data
    const generateNetworkData = (): NetworkData[] => [
      { vessel: 'MV Baltic Explorer', connections: 23, centrality: 0.87, suspiciousConnections: 2 },
      { vessel: 'MSC Celestine', connections: 45, centrality: 0.92, suspiciousConnections: 0 },
      { vessel: 'Nordic Trader', connections: 12, centrality: 0.34, suspiciousConnections: 5 },
      { vessel: 'Arctic Voyager', connections: 34, centrality: 0.67, suspiciousConnections: 1 },
      { vessel: 'Baltic Star', connections: 18, centrality: 0.45, suspiciousConnections: 3 },
      { vessel: 'Scandinavian Express', connections: 67, centrality: 0.95, suspiciousConnections: 0 }
    ];

    setTimeSeriesData(generateTimeSeriesData());
    setGeospatialData(generateGeospatialData());
    setNetworkData(generateNetworkData());
  }, [selectedTimeRange]);

  const radarData = geospatialData.map(item => ({
    region: item.region.split(' ')[0], // Shorten names for radar
    activity: item.activity,
    risk: item.risk,
    vessels: Math.round(item.vessels / 10) // Scale down for visualization
  }));

  const treemapData = geospatialData.map(item => ({
    name: item.region,
    size: item.vessels,
    activity: item.activity
  }));

  const COLORS = ['#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <span className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-blue-400" />
            <span>Advanced Analytics Dashboard</span>
          </span>
          <div className="flex items-center space-x-2">
            <Button
              variant={selectedTimeRange === '24h' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTimeRange('24h')}
              className="text-xs"
            >
              24H
            </Button>
            <Button
              variant={selectedTimeRange === '7d' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTimeRange('7d')}
              className="text-xs"
            >
              7D
            </Button>
            <Button
              variant={selectedTimeRange === '30d' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTimeRange('30d')}
              className="text-xs"
            >
              30D
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="timeseries" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="timeseries">
              <TrendingUp className="h-4 w-4 mr-1" />
              Time Series
            </TabsTrigger>
            <TabsTrigger value="geospatial">
              <Map className="h-4 w-4 mr-1" />
              Geospatial
            </TabsTrigger>
            <TabsTrigger value="network">
              <Users className="h-4 w-4 mr-1" />
              Network
            </TabsTrigger>
            <TabsTrigger value="economic">
              <DollarSign className="h-4 w-4 mr-1" />
              Economic
            </TabsTrigger>
          </TabsList>

          <TabsContent value="timeseries" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="bg-slate-900 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white text-sm">Vessel Traffic Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={timeSeriesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis 
                        dataKey="timestamp" 
                        stroke="#9ca3af"
                        fontSize={10}
                        tickFormatter={(value) => new Date(value).getHours() + ':00'}
                      />
                      <YAxis stroke="#9ca3af" fontSize={10} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                        labelStyle={{ color: '#e2e8f0' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="vesselCount" 
                        stroke="#06b6d4" 
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-slate-900 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white text-sm">Threat Level Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={timeSeriesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis 
                        dataKey="timestamp" 
                        stroke="#9ca3af"
                        fontSize={10}
                        tickFormatter={(value) => new Date(value).getHours() + ':00'}
                      />
                      <YAxis stroke="#9ca3af" fontSize={10} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                        labelStyle={{ color: '#e2e8f0' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="threatLevel" 
                        stroke="#ef4444" 
                        fill="#ef4444"
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-slate-900 border-slate-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-sm">Multi-Metric Correlation</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="timestamp" 
                      stroke="#9ca3af"
                      fontSize={10}
                      tickFormatter={(value) => new Date(value).getHours() + ':00'}
                    />
                    <YAxis stroke="#9ca3af" fontSize={10} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                      labelStyle={{ color: '#e2e8f0' }}
                    />
                    <Line type="monotone" dataKey="vesselCount" stroke="#06b6d4" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="portActivity" stroke="#10b981" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="threatLevel" stroke="#ef4444" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="geospatial" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="bg-slate-900 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white text-sm">Regional Activity Radar</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="#374151" />
                      <PolarAngleAxis dataKey="region" tick={{ fill: '#9ca3af', fontSize: 10 }} />
                      <PolarRadiusAxis 
                        angle={90} 
                        domain={[0, 100]} 
                        tick={{ fill: '#9ca3af', fontSize: 8 }}
                      />
                      <Radar 
                        name="Activity" 
                        dataKey="activity" 
                        stroke="#06b6d4" 
                        fill="#06b6d4" 
                        fillOpacity={0.3} 
                      />
                      <Radar 
                        name="Risk" 
                        dataKey="risk" 
                        stroke="#ef4444" 
                        fill="#ef4444" 
                        fillOpacity={0.3} 
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-slate-900 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white text-sm">Vessel Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <Treemap
                      data={treemapData}
                      dataKey="size"
                      ratio={4/3}
                      stroke="#374151"
                      fill="#06b6d4"
                    >
                      {treemapData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Treemap>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <div className="bg-slate-900 p-4 rounded-lg">
              <h4 className="text-white font-medium mb-3">Regional Heat Map Data</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {geospatialData.map((region, index) => (
                  <div key={region.region} className="bg-slate-800 p-3 rounded">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium text-sm">{region.region}</span>
                      <Badge 
                        variant="outline" 
                        className={`${
                          region.risk > 50 ? 'text-red-400 border-red-400' :
                          region.risk > 25 ? 'text-yellow-400 border-yellow-400' :
                          'text-green-400 border-green-400'
                        }`}
                      >
                        Risk: {region.risk}
                      </Badge>
                    </div>
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Activity:</span>
                        <span className="text-white">{region.activity}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Vessels:</span>
                        <span className="text-white">{region.vessels}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="network" className="space-y-4">
            <div className="bg-slate-900 p-4 rounded-lg">
              <h4 className="text-white font-medium mb-3">Vessel Network Analysis</h4>
              <ScrollArea className="h-64">
                <div className="space-y-3">
                  {networkData.map((vessel, index) => (
                    <div key={vessel.vessel} className="bg-slate-800 p-3 rounded flex items-center justify-between">
                      <div>
                        <span className="text-white font-medium">{vessel.vessel}</span>
                        <div className="text-xs text-slate-400 mt-1">
                          Centrality: {(vessel.centrality * 100).toFixed(1)}%
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white text-sm">{vessel.connections} connections</div>
                        {vessel.suspiciousConnections > 0 && (
                          <Badge variant="outline" className="text-red-400 border-red-400 text-xs">
                            {vessel.suspiciousConnections} suspicious
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="economic" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card className="bg-slate-900 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white text-sm flex items-center">
                    <DollarSign className="h-4 w-4 mr-2 text-green-400" />
                    Economic Impact
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white mb-1">
                    $6.2M
                  </div>
                  <p className="text-sm text-slate-400">Daily trade volume</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                    <span className="text-green-400 text-sm">+12.3%</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white text-sm flex items-center">
                    <Activity className="h-4 w-4 mr-2 text-blue-400" />
                    Efficiency Gains
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white mb-1">
                    18.5%
                  </div>
                  <p className="text-sm text-slate-400">Route optimization</p>
                  <div className="flex items-center mt-2">
                    <Target className="h-4 w-4 text-blue-400 mr-1" />
                    <span className="text-blue-400 text-sm">+3.2% this week</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white text-sm flex items-center">
                    <Zap className="h-4 w-4 mr-2 text-yellow-400" />
                    Fuel Savings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white mb-1">
                    847K L
                  </div>
                  <p className="text-sm text-slate-400">Fuel saved today</p>
                  <div className="flex items-center mt-2">
                    <Layers className="h-4 w-4 text-yellow-400 mr-1" />
                    <span className="text-yellow-400 text-sm">892 tons CO₂</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-slate-900 border-slate-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-sm">Economic Impact Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="timestamp" 
                      stroke="#9ca3af"
                      fontSize={10}
                      tickFormatter={(value) => new Date(value).getHours() + ':00'}
                    />
                    <YAxis stroke="#9ca3af" fontSize={10} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                      labelStyle={{ color: '#e2e8f0' }}
                      formatter={(value) => [`$${(value as number / 1000000).toFixed(1)}M`, 'Economic Impact']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="economicImpact" 
                      stroke="#10b981" 
                      fill="#10b981"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AdvancedAnalyticsDashboard;
