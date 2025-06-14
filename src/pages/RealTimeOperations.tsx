
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LiveDataDashboard from '@/components/realtime/LiveDataDashboard';
import DataFusionPanel from '@/components/realtime/DataFusionPanel';
import AIAnalyticsDashboard from '@/components/intelligence/AIAnalyticsDashboard';
import RealTimeAlertsCenter from '@/components/intelligence/RealTimeAlertsCenter';
import DemoModeToggle from "@/components/DemoModeToggle";

const RealTimeOperations = () => {
  // Lift demo mode state to provide to all main dashboards
  const [isDemoMode, setIsDemoMode] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Real-Time Operations Center</h1>
        </div>
        <div className="flex items-center space-x-3">
          <DemoModeToggle isDemoMode={isDemoMode} onChange={setIsDemoMode} />
          <div className={`w-2 h-2 rounded-full ${isDemoMode ? "bg-yellow-400 animate-pulse" : "bg-green-400 animate-pulse"}`} />
          <span className={`text-sm ${isDemoMode ? "text-yellow-400" : "text-slate-300"}`}>{isDemoMode ? "Simulation Mode" : "Live Data Active"}</span>
        </div>
      </div>
      <Tabs defaultValue="live-data" className="space-y-6">
        <TabsList className="bg-slate-800 border-slate-700 grid grid-cols-4 w-full">
          <TabsTrigger value="live-data">Live Data Processing</TabsTrigger>
          <TabsTrigger value="data-fusion">Data Fusion</TabsTrigger>
          <TabsTrigger value="ai-analytics">AI Analytics</TabsTrigger>
          <TabsTrigger value="alerts">Alert Management</TabsTrigger>
        </TabsList>

        <TabsContent value="live-data">
          <LiveDataDashboard isDemoMode={isDemoMode} />
        </TabsContent>
        <TabsContent value="data-fusion">
          <DataFusionPanel />
        </TabsContent>
        <TabsContent value="ai-analytics">
          <AIAnalyticsDashboard />
        </TabsContent>
        <TabsContent value="alerts">
          <RealTimeAlertsCenter />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RealTimeOperations;
