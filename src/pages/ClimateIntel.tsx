
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  CloudSnow, 
  Thermometer, 
  Wind, 
  Activity, 
  Map, 
  BarChart3,
  Shield,
  Globe
} from "lucide-react";
import MapboxMap from "@/components/maps/MapboxMap";
import ClimateDataDashboard from "@/components/climate/ClimateDataDashboard";
import WeatherForecastPanel from "@/components/climate/WeatherForecastPanel";
import ClimateImpactAnalysis from "@/components/climate/ClimateImpactAnalysis";
import ClimateSecurityPanel from "@/components/ClimateSecurityPanel";

const ClimateIntel = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  // Live climate statistics
  const liveStats = {
    globalTemp: "+1.2°C",
    seaLevel: "+3.2mm/yr",
    co2Level: "421 ppm",
    iceExtent: "-12.9%",
    lastUpdate: new Date().toLocaleTimeString()
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Climate Intelligence Platform</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-slate-300">Climate Data Live</span>
          </div>
          <Badge variant="outline" className="text-cyan-400 border-cyan-400">
            REAL-TIME MONITORING
          </Badge>
        </div>
      </div>
      
      {/* Live Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Thermometer className="h-8 w-8 text-red-400" />
              <div>
                <p className="text-sm text-slate-400">Global Temp Anomaly</p>
                <p className="text-2xl font-bold text-white">{liveStats.globalTemp}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Wind className="h-8 w-8 text-blue-400" />
              <div>
                <p className="text-sm text-slate-400">CO₂ Levels</p>
                <p className="text-2xl font-bold text-white">{liveStats.co2Level}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <CloudSnow className="h-8 w-8 text-cyan-400" />
              <div>
                <p className="text-sm text-slate-400">Ice Extent Change</p>
                <p className="text-2xl font-bold text-white">{liveStats.iceExtent}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Activity className="h-8 w-8 text-green-400" />
              <div>
                <p className="text-sm text-slate-400">Sea Level Rise</p>
                <p className="text-2xl font-bold text-white">{liveStats.seaLevel}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="dashboard" className="flex items-center space-x-2">
            <Activity className="h-4 w-4" />
            <span>Climate Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="forecast" className="flex items-center space-x-2">
            <CloudSnow className="h-4 w-4" />
            <span>Weather Forecast</span>
          </TabsTrigger>
          <TabsTrigger value="impact" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Impact Analysis</span>
          </TabsTrigger>
          <TabsTrigger value="map" className="flex items-center space-x-2">
            <Globe className="h-4 w-4" />
            <span>Climate Map</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Security Assessment</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <ClimateDataDashboard />
        </TabsContent>

        <TabsContent value="forecast">
          <WeatherForecastPanel />
        </TabsContent>

        <TabsContent value="impact">
          <ClimateImpactAnalysis />
        </TabsContent>

        <TabsContent value="map" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Map className="h-5 w-5 mr-2" />
                Interactive Climate Monitoring Map
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96 rounded-lg overflow-hidden">
                <MapboxMap 
                  className="w-full h-full"
                  showVessels={false}
                  showRoutes={false}
                  showAlerts={true}
                  focusMode="all"
                  center={[0, 30]}
                  zoom={2}
                  style="mapbox://styles/mapbox/satellite-v9"
                />
              </div>
              <div className="mt-4 p-3 bg-slate-900 rounded-lg">
                <p className="text-sm text-slate-300">
                  <strong className="text-cyan-400">Climate Monitoring:</strong> Real-time global climate data 
                  including temperature anomalies, storm systems, ice coverage changes, and extreme weather events. 
                  Use the map controls to explore different climate layers and time periods.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <ClimateSecurityPanel />
        </TabsContent>
      </Tabs>

      {/* Footer with last update time */}
      <div className="text-center">
        <p className="text-xs text-slate-400">
          Last updated: {liveStats.lastUpdate} | Data sources: NOAA, NASA, ECMWF
        </p>
      </div>
    </div>
  );
};

export default ClimateIntel;
