
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Network, 
  GitBranch, 
  Users, 
  Globe,
  Share2,
  Link,
  Activity,
  Shield
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter } from "recharts";

const NetworkAnalysisPanel = () => {
  const networkNodes = [
    { id: "NODE_001", type: "Vessel Hub", connections: 47, risk: "low", region: "North Sea" },
    { id: "NODE_002", type: "Port Authority", connections: 156, risk: "medium", region: "Mediterranean" },
    { id: "NODE_003", type: "Command Center", connections: 89, risk: "low", region: "Arctic" },
    { id: "NODE_004", type: "Intelligence Source", connections: 23, risk: "high", region: "Atlantic" },
    { id: "NODE_005", type: "Monitoring Station", connections: 67, risk: "medium", region: "Pacific" }
  ];

  const networkMetrics = [
    { metric: "Total Nodes", value: "2,847", change: "+12" },
    { metric: "Active Connections", value: "15,763", change: "+156" },
    { metric: "Network Clusters", value: "47", change: "+3" },
    { metric: "Isolated Nodes", value: "23", change: "-5" }
  ];

  const connectionStrength = [
    { source: "Maritime Traffic", target: "Port Operations", strength: 92 },
    { source: "Intelligence Feeds", target: "Threat Analysis", strength: 87 },
    { source: "Weather Data", target: "Route Planning", strength: 78 },
    { source: "Vessel Tracking", target: "Security Alerts", strength: 95 },
    { source: "Communication", target: "Command Control", strength: 89 }
  ];

  const clusterData = [
    { cluster: "Maritime Operations", size: 156, density: 0.78, x: 45, y: 67 },
    { cluster: "Intelligence Network", size: 89, density: 0.92, x: 23, y: 34 },
    { cluster: "Security Infrastructure", size: 123, density: 0.65, x: 78, y: 12 },
    { cluster: "Communication Hub", size: 67, density: 0.84, x: 56, y: 89 },
    { cluster: "Command Centers", size: 34, density: 0.95, x: 12, y: 56 }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {networkMetrics.map((metric, index) => (
          <Card key={index} className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">{metric.metric}</p>
                  <p className="text-2xl font-bold text-white">{metric.value}</p>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className={
                    metric.change.startsWith('+') ? "text-green-400 border-green-400" :
                    "text-red-400 border-red-400"
                  }>
                    {metric.change}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Network className="h-5 w-5 mr-2" />
              Network Topology
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {networkNodes.map((node, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      node.risk === "low" ? "bg-green-400" :
                      node.risk === "medium" ? "bg-yellow-400" :
                      "bg-red-400"
                    }`}></div>
                    <div>
                      <h4 className="text-white font-medium text-sm">{node.type}</h4>
                      <p className="text-xs text-slate-400">{node.id} • {node.region}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      <GitBranch className="h-4 w-4 text-cyan-400" />
                      <span className="text-white font-medium">{node.connections}</span>
                    </div>
                    <Badge variant="outline" className={
                      node.risk === "low" ? "text-green-400 border-green-400" :
                      node.risk === "medium" ? "text-yellow-400 border-yellow-400" :
                      "text-red-400 border-red-400"
                    }>
                      {node.risk.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Link className="h-5 w-5 mr-2" />
              Connection Strength Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={connectionStrength} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis type="number" stroke="#9CA3AF" />
                  <YAxis dataKey="source" type="category" stroke="#9CA3AF" width={100} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F9FAFB'
                    }}
                  />
                  <Bar dataKey="strength" fill="#06B6D4" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Network Clusters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart data={clusterData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="x" stroke="#9CA3AF" />
                  <YAxis dataKey="y" stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F9FAFB'
                    }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-slate-800 p-3 rounded-lg border border-slate-600">
                            <p className="text-white font-medium">{data.cluster}</p>
                            <p className="text-slate-300">Size: {data.size} nodes</p>
                            <p className="text-slate-300">Density: {data.density}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Scatter dataKey="size" fill="#8B5CF6" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Network Health Monitoring
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-24 h-24 bg-green-900 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="h-12 w-12 text-green-400" />
                </div>
                <h3 className="text-lg font-medium text-white mb-1">Network Status</h3>
                <Badge variant="outline" className="text-green-400 border-green-400">
                  HEALTHY
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-green-400">99.7%</p>
                  <p className="text-xs text-slate-400">Uptime</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-cyan-400">0.24s</p>
                  <p className="text-xs text-slate-400">Avg Latency</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-400">156</p>
                  <p className="text-xs text-slate-400">Active Paths</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-400">3</p>
                  <p className="text-xs text-slate-400">Redundancies</p>
                </div>
              </div>

              <Button className="w-full bg-cyan-600 hover:bg-cyan-700">
                <Globe className="h-4 w-4 mr-2" />
                View Network Map
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NetworkAnalysisPanel;
