
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import ClimateSecurityPanel from "@/components/ClimateSecurityPanel";
import MapboxMap from "@/components/maps/MapboxMap";
import VesselTrackingPanel from "@/components/maps/VesselTrackingPanel";
import { Ship, Satellite, AlertTriangle, TrendingUp, Activity } from "lucide-react";
import { liveDataService } from "@/services/liveDataService";
import { alertsService, Alert } from "@/services/alertsService";

const Index = () => {
  const [liveData, setLiveData] = useState<any>(null);
  const [isLiveDataActive, setIsLiveDataActive] = useState(false);
  const [selectedVessel, setSelectedVessel] = useState<string>('');
  const [recentAlerts, setRecentAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    // Start live data feed
    liveDataService.startLiveDataFeed();
    setIsLiveDataActive(true);

    // Subscribe to live data updates
    const unsubscribe = liveDataService.subscribe((data) => {
      setLiveData(data);
      console.log('Dashboard live data update:', data);
    });

    // Subscribe to alerts
    const unsubscribeAlerts = alertsService.subscribe((alerts) => {
      setRecentAlerts(alerts.slice(0, 5)); // Show only 5 most recent
    });

    // Start alerts simulation
    alertsService.startAlertSimulation();

    // Cleanup
    return () => {
      unsubscribe();
      unsubscribeAlerts();
      liveDataService.stopLiveDataFeed();
      setIsLiveDataActive(false);
    };
  }, []);

  const vesselCount = liveData?.vessels?.length || 2847;
  const alertCount = recentAlerts.filter(a => a.status === 'new').length;
  const satelliteCoverage = liveDataService.getSatelliteCoverage().coverage;

  const getTimeAgo = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-400';
      case 'high': return 'bg-orange-400';
      case 'medium': return 'bg-yellow-400';
      case 'low': return 'bg-green-400';
      default: return 'bg-slate-400';
    }
  };

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
            <CardTitle className="text-sm font-medium text-slate-300">Active Alerts</CardTitle>
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

      {/* Enhanced Real-Time Alerts Activity Feed */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span>Live Intelligence Activity</span>
            <Badge variant="outline" className="text-green-400 border-green-400">
              REAL-TIME ALERTS
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentAlerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between py-2 border-b border-slate-700 last:border-b-0">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${getSeverityColor(alert.severity)}`} />
                  <div>
                    <span className="text-slate-300">{alert.title}</span>
                    <p className="text-xs text-slate-500">{alert.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-cyan-400 border-cyan-400 text-xs">
                    {alert.status.toUpperCase()}
                  </Badge>
                  <span className="text-xs text-slate-500">{getTimeAgo(alert.timestamp)}</span>
                </div>
              </div>
            ))}
            {recentAlerts.length === 0 && (
              <div className="text-center py-8 text-slate-400">
                <AlertTriangle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No recent alerts</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
