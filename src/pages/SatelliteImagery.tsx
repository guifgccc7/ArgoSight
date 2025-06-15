
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Satellite, Image, Map, Settings } from "lucide-react";
import EnhancedSatelliteControls from "@/components/satellite/EnhancedSatelliteControls";
import ApiStatusPanel from "@/components/ApiStatusPanel";

const SatelliteImagery = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Satellite Imagery</h1>
          <p className="text-slate-400 mt-2">
            High-resolution satellite images for maritime intelligence analysis
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Available Satellites</p>
                <p className="text-2xl font-bold text-cyan-400">12</p>
              </div>
              <Satellite className="h-8 w-8 text-cyan-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Images Today</p>
                <p className="text-2xl font-bold text-green-400">847</p>
              </div>
              <Image className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Coverage Areas</p>
                <p className="text-2xl font-bold text-blue-400">23</p>
              </div>
              <Map className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Avg Resolution</p>
                <p className="text-2xl font-bold text-purple-400">3.2m</p>
              </div>
              <Settings className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Main Satellite Controls */}
        <div className="xl:col-span-3">
          <EnhancedSatelliteControls />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <ApiStatusPanel />
          
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-sm">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">New images processed</span>
                  <span className="text-cyan-400">+247</span>
                </div>
                <p className="text-xs text-slate-500">2 minutes ago</p>
              </div>
              <div className="text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Analysis completed</span>
                  <span className="text-green-400">✓ Arctic Route</span>
                </div>
                <p className="text-xs text-slate-500">15 minutes ago</p>
              </div>
              <div className="text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Cloud coverage updated</span>
                  <span className="text-yellow-400">12% avg</span>
                </div>
                <p className="text-xs text-slate-500">1 hour ago</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SatelliteImagery;
