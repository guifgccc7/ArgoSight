
import React from 'react';
import PredictiveAnalytics from '@/components/analytics/PredictiveAnalytics';
import AdvancedDataSources from '@/components/analytics/AdvancedDataSources';
import CollaborativeIntelligence from '@/components/collaboration/CollaborativeIntelligence';
import MobileOperationsCenter from '@/components/mobile/MobileOperationsCenter';
import AdvancedAnalyticsDashboard from '@/components/analytics/AdvancedAnalyticsDashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdvancedAnalytics = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Advanced Analytics & Machine Learning</h1>
      </div>
      
      <Tabs defaultValue="predictive" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="predictive">Predictive AI</TabsTrigger>
          <TabsTrigger value="datasources">Data Sources</TabsTrigger>
          <TabsTrigger value="collaboration">Collaboration</TabsTrigger>
          <TabsTrigger value="mobile">Mobile Ops</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="predictive" className="space-y-4">
          <PredictiveAnalytics />
        </TabsContent>
        
        <TabsContent value="datasources" className="space-y-4">
          <AdvancedDataSources />
        </TabsContent>
        
        <TabsContent value="collaboration" className="space-y-4">
          <CollaborativeIntelligence />
        </TabsContent>
        
        <TabsContent value="mobile" className="space-y-4">
          <MobileOperationsCenter />
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <AdvancedAnalyticsDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedAnalytics;
