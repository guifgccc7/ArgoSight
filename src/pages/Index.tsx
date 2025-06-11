
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import ClimateSecurityPanel from "@/components/ClimateSecurityPanel";
import MapboxMap from "@/components/maps/MapboxMap";
import VesselTrackingPanel from "@/components/maps/VesselTrackingPanel";
import { Ship, Satellite, AlertTriangle, TrendingUp, Activity } from "lucide-react";
import { liveDataService } from "@/services/liveDataService";

const Index = () => {
  const [liveData, setLiveData] = useState<any>(null);
  const [isLiveDataActive, setIsLiveDataActive] = useState(false);
  const [selectedVessel, setSelectedVessel] = useState<string>('');

  useEffect(() => {
    // Start live data feed
    liveDataService.startLiveDataFeed();
    setIsLiveDataActive(true);

    // Subscribe to live data updates
    const unsubscribe = liveDataService.subscribe((data) => {
      setLiveData(data);
      console.log('Dashboard live data update:', data);
    });

    // Cleanup
    return () => {
      unsubscribe();
      liveDataService.stopLiveDataFeed();
      setIsLiveDataActive(false);
    };
  }, []);

  const vesselCount = liveData?.vessels?.length || 2847;
  const alertCount = liveData?.alerts?.length || 23;
  const satelliteCoverage = liveDataService.getSatelliteCoverage().coverage;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Maritime Intelligence Dashboard</h1>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className={`${isLiveDataActive ? 'text-green-400 border-green-400' : 'text-slate-400 border-slate-400'}`}>
            {isLiveDataActive ? (
              <>
                <Activity className="h-3 w-3 mr-1" />
                LIVE DATA
              </>
            ) : 'OFFLINE'}
          </Badge>
          <Badge variant="outline" className="text-green-400 border-green-400">
            OPERATIONAL
          </Badge>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Active Vessels</CardTitle>
            <Ship className="h-4 w-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{vesselCount.toLocaleString()}</div>
            <p className="text-xs text-slate-400">
              <span className="text-green-400">+12%</span> from last week
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Satellite Coverage</CardTitle>
            <Satellite className="h-4 w-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{satelliteCoverage.toFixed(1)}%</div>
            <Progress value={satelliteCoverage} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Threat Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{alertCount}</div>
            <p className="text-xs text-slate-400">
              <span className="text-red-400">+{Math.floor(Math.random() * 5) + 1}</span> in last 24h
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Arctic Routes</CardTitle>
            <TrendingUp className="h-4 w-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">156</div>
            <p className="text-xs text-slate-400">
              <span className="text-cyan-400">+28%</span> seasonal increase
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Live Maritime Map with Vessel Tracking */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <span>Global Maritime Activity</span>
                {isLiveDataActive && (
                  <Badge variant="outline" className="text-green-400 border-green-400">
                    <Activity className="h-3 w-3 mr-1" />
                    LIVE
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <MapboxMap 
                  showVessels={true}
                  showRoutes={true}
                  showAlerts={true}
                  style="mapbox://styles/mapbox/dark-v11"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <VesselTrackingPanel 
            focusMode="all"
            selectedVessel={selectedVessel}
            onVesselSelect={setSelectedVessel}
          />
        </div>
      </div>

      {/* Climate Security Panel */}
      <ClimateSecurityPanel />

      {/* Live Data Activity Feed */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Live Intelligence Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {liveData?.alerts?.map((alert: any, index: number) => (
              <div key={alert.id || index} className="flex items-center justify-between py-2 border-b border-slate-700 last:border-b-0">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    alert.severity === 'critical' ? 'bg-red-400' :
                    alert.severity === 'high' ? 'bg-orange-400' :
                    alert.severity === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                  }`} />
                  <span className="text-slate-300">{alert.description}</span>
                </div>
                <span className="text-xs text-slate-500">Just now</span>
              </div>
            )) || [
              { time: "2 min ago", event: "Ghost fleet detected in North Pacific", severity: "high" },
              { time: "15 min ago", event: "Arctic route optimization completed", severity: "medium" },
              { time: "1 hour ago", event: "Satellite imagery updated for Mediterranean", severity: "low" },
              { time: "3 hours ago", event: "Climate risk assessment updated", severity: "medium" },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-slate-700 last:border-b-0">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.severity === 'high' ? 'bg-red-400' :
                    activity.severity === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                  }`} />
                  <span className="text-slate-300">{activity.event}</span>
                </div>
                <span className="text-xs text-slate-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
