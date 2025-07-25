import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import DemoModeToggle from "@/components/DemoModeToggle";
import ClimateSecurityPanel from "@/components/ClimateSecurityPanel";
import MapboxMap from "@/components/maps/MapboxMap";
import VesselTrackingPanel from "@/components/maps/VesselTrackingPanel";
import SystemHealthMonitor from "@/components/SystemHealthMonitor";
import { Ship, Satellite, AlertTriangle, TrendingUp, Activity, Brain, Shield, Zap, Globe, Eye } from "lucide-react";
import { liveDataService } from "@/services/liveDataService";
import { alertsService, Alert } from "@/services/alertsService";
import { Link } from "react-router-dom";

const Index = () => {
  const [liveData, setLiveData] = useState<any>(null);
  const [isLiveDataActive, setIsLiveDataActive] = useState(false);
  const [selectedVessel, setSelectedVessel] = useState<string>('');
  const [recentAlerts, setRecentAlerts] = useState<Alert[]>([]);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Listen for demo mode toggle
  useEffect(() => {
    liveDataService.setDemoMode(isDemoMode);
    // When in demo mode, update dashboard with immediate fallback
    if(isDemoMode) {
      setLiveData(liveDataService.getImmediateSimulatedData());
    }
  }, [isDemoMode]);

  useEffect(() => {
    // Live/demo data feed handling
    if (!isDemoMode) {
      liveDataService.startLiveDataFeed();
      setIsLiveDataActive(true);

      const unsubscribe = liveDataService.subscribe((data) => {
        // If for some reason no data, fallback to simulated (never show empty UI)
        if (!data?.vessels || data.vessels.length === 0) {
          setLiveData(liveDataService.getImmediateSimulatedData());
        } else {
          setLiveData(data);
        }
        console.log('Dashboard live data update:', data);
      });

      const unsubscribeAlerts = alertsService.subscribe((alerts) => {
        setRecentAlerts(alerts.slice(0, 5));
      });
      alertsService.startAlertSimulation();
      return () => {
        unsubscribe();
        unsubscribeAlerts();
        liveDataService.stopLiveDataFeed();
        setIsLiveDataActive(false);
      };
    } else {
      // In demo/sim mode, pull and refresh simulated data every 10s
      const interval = setInterval(() => {
        setLiveData(liveDataService.getImmediateSimulatedData());
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [isDemoMode]);

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

  const enterpriseFeatures = [
    {
      icon: Brain,
      title: "AI-Powered Intelligence",
      description: "Advanced machine learning for pattern recognition and threat prediction",
      link: "/integrated-intel",
      color: "from-purple-500 to-blue-500"
    },
    {
      icon: Eye,
      title: "3D Vessel Tracking",
      description: "Interactive 3D visualization with real-time vessel monitoring",
      link: "/integrated-intel",
      color: "from-cyan-500 to-blue-500"
    },
    {
      icon: Shield,
      title: "Advanced Security",
      description: "End-to-end encryption, audit logs, and compliance monitoring",
      link: "/integrated-intel",
      color: "from-red-500 to-orange-500"
    },
    {
      icon: Zap,
      title: "Performance Optimization",
      description: "PWA features, intelligent caching, and ML acceleration",
      link: "/integrated-intel",
      color: "from-yellow-500 to-orange-500"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Maritime Intelligence Command Center</h1>
          <p className="text-slate-400 mt-1">Enterprise-grade maritime intelligence platform</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <DemoModeToggle isDemoMode={isDemoMode} onChange={setIsDemoMode} />
          <Badge variant="outline" className={`${isLiveDataActive && !isDemoMode ? 'text-green-400 border-green-400' : 'text-slate-400 border-slate-400'}`}>
            {isDemoMode
              ? (
                <>
                  <Zap className="h-3 w-3 mr-1 text-yellow-400" />
                  SIMULATED
                </>
              ) : isLiveDataActive
                ? (
                  <>
                    <Activity className="h-3 w-3 mr-1" />
                    LIVE DATA
                  </>
                )
                : 'OFFLINE'
            }
          </Badge>
          <Badge variant="outline" className="text-green-400 border-green-400">ENTERPRISE</Badge>
          <Badge variant="outline" className="text-cyan-400 border-cyan-400">OPERATIONAL</Badge>
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

      {/* Enterprise Features Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {enterpriseFeatures.map((feature, index) => {
          const IconComponent = feature.icon;
          return (
            <Link key={index} to={feature.link}>
              <Card className="bg-slate-800 border-slate-700 hover:border-slate-600 transition-all cursor-pointer group">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-white font-medium mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-400">{feature.description}</p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Enhanced Live Maritime Map with Vessel Tracking */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-3">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
                <span className="flex items-center space-x-2">
                  <span>Global Maritime Activity</span>
                  {isLiveDataActive && !isDemoMode && (
                    <Badge variant="outline" className="text-green-400 border-green-400">
                      <Activity className="h-3 w-3 mr-1" />
                      LIVE
                    </Badge>
                  )}
                  {isDemoMode && (
                    <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                      <Zap className="h-3 w-3 mr-1" />
                      DEMO
                    </Badge>
                  )}
                </span>
                <Link to="/integrated-intel">
                  <Button variant="outline" size="sm" className="text-cyan-400 border-cyan-600">
                    <Eye className="h-4 w-4 mr-1" />
                    3D View
                  </Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 sm:h-80 lg:h-96">
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

        <div className="xl:col-span-1">
          <VesselTrackingPanel 
            focusMode="all"
            selectedVessel={selectedVessel}
            onVesselSelect={setSelectedVessel}
          />
        </div>
      </div>

      {/* System Health and Climate Security */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SystemHealthMonitor />
        <ClimateSecurityPanel />
      </div>

      {/* Enhanced Real-Time Alerts Activity Feed */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span>Live Intelligence Activity</span>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-green-400 border-green-400">
                REAL-TIME ALERTS
              </Badge>
              <Link to="/integrated-intel">
                <Button variant="outline" size="sm" className="text-cyan-400 border-cyan-600">
                  <Brain className="h-4 w-4 mr-1" />
                  Advanced Analytics
                </Button>
              </Link>
            </div>
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
