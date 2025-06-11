
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Waves, Users, AlertTriangle, MapPin, Clock, Activity } from "lucide-react";
import MapboxMap from "@/components/maps/MapboxMap";
import MigrationDashboard from "@/components/mediterranean/MigrationDashboard";
import RiskAssessment from "@/components/mediterranean/RiskAssessment";
import TimelineAnalysis from "@/components/mediterranean/TimelineAnalysis";

const MediterraneanRoutes = () => {
  const [activeTab, setActiveTab] = useState("map");

  // Mock real-time data
  const liveStats = {
    activeRescues: 3,
    vesselsTracked: 47,
    peopleAtSea: 892,
    weatherAlert: "moderate",
    lastUpdate: new Date().toLocaleTimeString()
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Mediterranean Migration Monitor</h1>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm text-slate-300">Live Data Active</span>
        </div>
      </div>
      
      {/* Real-time Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Activity className="h-8 w-8 text-red-400" />
              <div>
                <p className="text-sm text-slate-400">Active Rescues</p>
                <p className="text-2xl font-bold text-white">{liveStats.activeRescues}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <MapPin className="h-8 w-8 text-blue-400" />
              <div>
                <p className="text-sm text-slate-400">Vessels Tracked</p>
                <p className="text-2xl font-bold text-white">{liveStats.vesselsTracked}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Users className="h-8 w-8 text-cyan-400" />
              <div>
                <p className="text-sm text-slate-400">People at Sea</p>
                <p className="text-2xl font-bold text-white">{liveStats.peopleAtSea.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-8 w-8 text-yellow-400" />
              <div>
                <p className="text-sm text-slate-400">Weather Risk</p>
                <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                  {liveStats.weatherAlert.toUpperCase()}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="map" className="flex items-center space-x-2">
            <Waves className="h-4 w-4" />
            <span>Migration Routes</span>
          </TabsTrigger>
          <TabsTrigger value="humanitarian" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Humanitarian Aid</span>
          </TabsTrigger>
          <TabsTrigger value="risk" className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4" />
            <span>Risk Assessment</span>
          </TabsTrigger>
          <TabsTrigger value="timeline" className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>Timeline Analysis</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="map" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Waves className="h-5 w-5 mr-2" />
                Real-time Migration Route Tracking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96 rounded-lg overflow-hidden">
                <MapboxMap 
                  className="w-full h-full"
                  showVessels={true}
                  showRoutes={true}
                  showAlerts={true}
                  focusMode="mediterranean"
                  center={[15, 35]}
                  zoom={6}
                />
              </div>
              <div className="mt-4 p-3 bg-slate-900 rounded-lg">
                <p className="text-sm text-slate-300">
                  <strong className="text-cyan-400">Live Tracking:</strong> Mediterranean migration routes with real-time vessel positions, 
                  rescue operations, and humanitarian zones. Red markers indicate distress calls, blue markers show rescue vessels.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="humanitarian">
          <MigrationDashboard />
        </TabsContent>

        <TabsContent value="risk">
          <RiskAssessment />
        </TabsContent>

        <TabsContent value="timeline">
          <TimelineAnalysis />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MediterraneanRoutes;
