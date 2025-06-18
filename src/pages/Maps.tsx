
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LiveVesselMap from '@/components/maps/LiveVesselMap';
import VesselTrackingPanel from '@/components/maps/VesselTrackingPanel';

const Maps = () => {
  const [selectedVessel, setSelectedVessel] = useState<string>('');

  return (
    <div className="p-6 bg-slate-950 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-white">Maritime Intelligence Maps</h1>
      </div>

      <Tabs defaultValue="live-tracking" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800">
          <TabsTrigger value="live-tracking" className="text-slate-300">Live Vessel Tracking</TabsTrigger>
          <TabsTrigger value="threat-analysis" className="text-slate-300">Threat Analysis</TabsTrigger>
          <TabsTrigger value="intelligence" className="text-slate-300">Intelligence Overlay</TabsTrigger>
        </TabsList>

        <TabsContent value="live-tracking" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[calc(100vh-200px)]">
            <div className="lg:col-span-3">
              <Card className="bg-slate-800 border-slate-700 h-full">
                <CardHeader>
                  <CardTitle className="text-white">Live AIS Vessel Tracking</CardTitle>
                </CardHeader>
                <CardContent className="p-0 h-[calc(100%-80px)]">
                  <LiveVesselMap />
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-1">
              <VesselTrackingPanel 
                selectedVessel={selectedVessel}
                onVesselSelect={setSelectedVessel}
                focusMode="all"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="threat-analysis" className="space-y-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Threat Analysis Map</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96 bg-slate-900 rounded-lg flex items-center justify-center">
                <p className="text-slate-400">Threat analysis overlay will be implemented here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="intelligence" className="space-y-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Intelligence Overlay</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96 bg-slate-900 rounded-lg flex items-center justify-center">
                <p className="text-slate-400">Intelligence data overlay will be implemented here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Maps;
