
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Brain, 
  Network, 
  Zap, 
  Shield, 
  Activity, 
  TrendingUp,
  Database,
  AlertTriangle,
  Globe,
  Users,
  Clock,
  Target
} from "lucide-react";
import AIAnalyticsDashboard from "@/components/intelligence/AIAnalyticsDashboard";
import NetworkAnalysisPanel from "@/components/intelligence/NetworkAnalysisPanel";
import RealTimeAlertsCenter from "@/components/intelligence/RealTimeAlertsCenter";
import ThreatIntelligenceHub from "@/components/intelligence/ThreatIntelligenceHub";
import OperationalInsights from "@/components/intelligence/OperationalInsights";

const IntegratedIntel = () => {
  const [activeTab, setActiveTab] = useState("overview");
  
  const platformStats = {
    aiModelsActive: 12,
    networkNodes: 2847,
    activeAlerts: 23,
    threatLevel: "medium",
    dataProcessed: "15.2TB",
    responseTime: "0.34s",
    accuracy: 94.7,
    uptime: 99.9
  };

  const capabilities = [
    {
      icon: Brain,
      title: "AI-Powered Analytics",
      description: "Advanced machine learning algorithms for pattern recognition and predictive analysis",
      status: "active",
      metrics: { models: 12, accuracy: "94.7%", processing: "Real-time" }
    },
    {
      icon: Network,
      title: "Network Intelligence",
      description: "Complex relationship mapping and network topology analysis",
      status: "active", 
      metrics: { nodes: "2.8K", connections: "15.7K", clusters: 47 }
    },
    {
      icon: Shield,
      title: "Threat Detection",
      description: "Real-time threat identification and risk assessment",
      status: "active",
      metrics: { threats: 23, blocked: "1.2K", success: "98.5%" }
    },
    {
      icon: Zap,
      title: "Rapid Response",
      description: "Instant alert generation and automated response protocols",
      status: "active",
      metrics: { alerts: 156, response: "0.34s", automation: "85%" }
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Integrated Intelligence Platform</h1>
          <p className="text-slate-400 mt-2">Advanced AI-driven intelligence analysis and threat detection</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-slate-300">All Systems Operational</span>
          </div>
          <Badge variant="outline" className="text-green-400 border-green-400">
            THREAT LEVEL: {platformStats.threatLevel.toUpperCase()}
          </Badge>
        </div>
      </div>

      {/* Platform Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Brain className="h-8 w-8 text-purple-400" />
              <div>
                <p className="text-sm text-slate-400">AI Models Active</p>
                <p className="text-2xl font-bold text-white">{platformStats.aiModelsActive}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Network className="h-8 w-8 text-cyan-400" />
              <div>
                <p className="text-sm text-slate-400">Network Nodes</p>
                <p className="text-2xl font-bold text-white">{platformStats.networkNodes.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-8 w-8 text-red-400" />
              <div>
                <p className="text-sm text-slate-400">Active Alerts</p>
                <p className="text-2xl font-bold text-white">{platformStats.activeAlerts}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-8 w-8 text-green-400" />
              <div>
                <p className="text-sm text-slate-400">Accuracy Rate</p>
                <p className="text-2xl font-bold text-white">{platformStats.accuracy}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Capability Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {capabilities.map((capability, index) => {
          const IconComponent = capability.icon;
          return (
            <Card key={index} className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <div className="p-2 bg-slate-900 rounded-lg">
                    <IconComponent className="h-6 w-6 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-white">{capability.title}</h3>
                    <Badge variant="outline" className="text-green-400 border-green-400 mt-1">
                      {capability.status.toUpperCase()}
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 mb-4">{capability.description}</p>
                <div className="grid grid-cols-3 gap-4 text-center">
                  {Object.entries(capability.metrics).map(([key, value]) => (
                    <div key={key}>
                      <p className="text-xs text-slate-400 uppercase">{key}</p>
                      <p className="text-sm font-medium text-white">{value}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Intelligence Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <Activity className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="ai-analytics" className="flex items-center space-x-2">
            <Brain className="h-4 w-4" />
            <span>AI Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="network" className="flex items-center space-x-2">
            <Network className="h-4 w-4" />
            <span>Network Analysis</span>
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center space-x-2">
            <Zap className="h-4 w-4" />
            <span>Real-Time Alerts</span>
          </TabsTrigger>
          <TabsTrigger value="threats" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Threat Intelligence</span>
          </TabsTrigger>
          <TabsTrigger value="operations" className="flex items-center space-x-2">
            <Target className="h-4 w-4" />
            <span>Operations</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OperationalInsights />
        </TabsContent>

        <TabsContent value="ai-analytics">
          <AIAnalyticsDashboard />
        </TabsContent>

        <TabsContent value="network">
          <NetworkAnalysisPanel />
        </TabsContent>

        <TabsContent value="alerts">
          <RealTimeAlertsCenter />
        </TabsContent>

        <TabsContent value="threats">
          <ThreatIntelligenceHub />
        </TabsContent>

        <TabsContent value="operations">
          <OperationalInsights />
        </TabsContent>
      </Tabs>

      {/* Platform Status Footer */}
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div className="flex items-center justify-center space-x-2">
              <Database className="h-5 w-5 text-cyan-400" />
              <div>
                <p className="text-xs text-slate-400">Data Processed</p>
                <p className="text-sm font-medium text-white">{platformStats.dataProcessed}</p>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Clock className="h-5 w-5 text-green-400" />
              <div>
                <p className="text-xs text-slate-400">Avg Response Time</p>
                <p className="text-sm font-medium text-white">{platformStats.responseTime}</p>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Activity className="h-5 w-5 text-blue-400" />
              <div>
                <p className="text-xs text-slate-400">System Uptime</p>
                <p className="text-sm font-medium text-white">{platformStats.uptime}%</p>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Users className="h-5 w-5 text-purple-400" />
              <div>
                <p className="text-xs text-slate-400">Active Analysts</p>
                <p className="text-sm font-medium text-white">47</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntegratedIntel;
