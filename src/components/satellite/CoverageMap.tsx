
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MapboxMap from "@/components/maps/MapboxMap";
import { Satellite } from "lucide-react";

const CoverageMap = () => {
  const activeSatellites = [
    { name: "Sentinel-2A", status: "active", coverage: "Europe, Asia", nextPass: "14:32" },
    { name: "Landsat 8", status: "active", coverage: "Americas", nextPass: "16:45" },
    { name: "WorldView-3", status: "active", coverage: "Arctic", nextPass: "12:18" },
    { name: "SPOT-7", status: "maintenance", coverage: "Africa", nextPass: "18:22" },
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Satellite className="h-5 w-5 mr-2" />
            Real-time Satellite Coverage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 rounded-lg overflow-hidden">
            <MapboxMap 
              className="w-full h-full"
              showVessels={false}
              showRoutes={false}
              showAlerts={false}
              center={[0, 30]}
              zoom={2}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Active Satellites</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activeSatellites.map((satellite, index) => (
              <div key={index} className="p-3 bg-slate-900 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-white">{satellite.name}</span>
                  <Badge 
                    variant="outline" 
                    className={`${satellite.status === 'active' ? 'text-green-400 border-green-400' : 'text-yellow-400 border-yellow-400'}`}
                  >
                    {satellite.status.toUpperCase()}
                  </Badge>
                </div>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-300">Coverage:</span>
                    <span className="text-white">{satellite.coverage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Next Pass:</span>
                    <span className="text-cyan-400">{satellite.nextPass} UTC</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CoverageMap;
