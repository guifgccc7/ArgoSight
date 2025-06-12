
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LiveDataDashboard from '@/components/realtime/LiveDataDashboard';
import DataFusionPanel from '@/components/realtime/DataFusionPanel';
import AIAnalyticsDashboard from '@/components/intelligence/AIAnalyticsDashboard';
import RealTimeAlertsCenter from '@/components/intelligence/RealTimeAlertsCenter';

const RealTimeOperations = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Real-Time Operations Center</h1>
      </div>

      <Tabs defaultValue="live-data" className="space-y-6">
        <TabsList className="bg-slate-800 border-slate-700 grid grid-cols-4 w-full">
          <TabsTrigger value="live-data">Live Data Processing</TabsTrigger>
          <TabsTrigger value="data-fusion">Data Fusion</TabsTrigger>
          <TabsTrigger value="ai-analytics">AI Analytics</TabsTrigger>
          <TabsTrigger value="alerts">Alert Management</TabsTrigger>
        </TabsList>

        <TabsContent value="live-data">
          <LiveDataDashboard />
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
