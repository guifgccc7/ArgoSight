
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Database, 
  FileText, 
  BarChart3,
  Network,
  Shield,
  Brain
} from "lucide-react";
import SearchInterface from "@/components/intelligence/SearchInterface";
import IntelligenceDashboard from "@/components/intelligence/IntelligenceDashboard";
import DataCorrelation from "@/components/intelligence/DataCorrelation";
import ReportsManager from "@/components/intelligence/ReportsManager";

const IntelligenceDB = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  // Intelligence statistics
  const stats = {
    totalRecords: "2.4M",
    activeAlerts: 23,
    reportsGenerated: 156,
    correlations: 89,
    lastUpdate: new Date().toLocaleTimeString()
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Intelligence Database Platform</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-slate-300">Intelligence Systems Online</span>
          </div>
          <Badge variant="outline" className="text-cyan-400 border-cyan-400">
            SECURE ACCESS
          </Badge>
        </div>
      </div>

      {/* Overview Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Database className="h-8 w-8 text-blue-400" />
              <div>
                <p className="text-sm text-slate-400">Total Records</p>
                <p className="text-2xl font-bold text-white">{stats.totalRecords}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-red-400" />
              <div>
                <p className="text-sm text-slate-400">Active Alerts</p>
                <p className="text-2xl font-bold text-white">{stats.activeAlerts}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <FileText className="h-8 w-8 text-green-400" />
              <div>
                <p className="text-sm text-slate-400">Reports Generated</p>
                <p className="text-2xl font-bold text-white">{stats.reportsGenerated}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Network className="h-8 w-8 text-purple-400" />
              <div>
                <p className="text-sm text-slate-400">Data Correlations</p>
                <p className="text-2xl font-bold text-white">{stats.correlations}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Brain className="h-8 w-8 text-cyan-400" />
              <div>
                <p className="text-sm text-slate-400">AI Analysis</p>
                <p className="text-2xl font-bold text-white">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="dashboard" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Intelligence Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="search" className="flex items-center space-x-2">
            <Search className="h-4 w-4" />
            <span>Advanced Search</span>
          </TabsTrigger>
          <TabsTrigger value="correlation" className="flex items-center space-x-2">
            <Network className="h-4 w-4" />
            <span>Data Correlation</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Reports Manager</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <IntelligenceDashboard />
        </TabsContent>

        <TabsContent value="search">
          <SearchInterface />
        </TabsContent>

        <TabsContent value="correlation">
          <DataCorrelation />
        </TabsContent>

        <TabsContent value="reports">
          <ReportsManager />
        </TabsContent>
      </Tabs>

      {/* Footer with last update time */}
      <div className="text-center">
        <p className="text-xs text-slate-400">
          Last system update: {stats.lastUpdate} | Secure intelligence platform v2.1.0
        </p>
      </div>
    </div>
  );
};

export default IntelligenceDB;
