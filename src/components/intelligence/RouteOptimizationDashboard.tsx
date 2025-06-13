
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Navigation, 
  AlertTriangle, 
  Route,
  Clock,
  Fuel,
  Shield,
  MapPin,
  Wind,
  Eye,
  Waves,
  Thermometer,
  TrendingDown,
  TrendingUp,
  CheckCircle
} from "lucide-react";
import { routeOptimizationService, RouteRecommendation, SafetyAlert } from "@/services/routeOptimizationService";

const RouteOptimizationDashboard = () => {
  const [recommendations, setRecommendations] = useState<RouteRecommendation[]>([]);
  const [safetyAlerts, setSafetyAlerts] = useState<SafetyAlert[]>([]);
  const [activeTab, setActiveTab] = useState("alerts");

  useEffect(() => {
    const unsubscribe = routeOptimizationService.subscribe(({ recommendations, alerts }) => {
      setRecommendations(recommendations);
      setSafetyAlerts(alerts);
    });

    // Load initial data
    setRecommendations(routeOptimizationService.getRouteRecommendations());
    setSafetyAlerts(routeOptimizationService.getSafetyAlerts());

    return unsubscribe;
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "text-red-400 border-red-400 bg-red-900/20";
      case "high": return "text-orange-400 border-orange-400 bg-orange-900/20";
      case "medium": return "text-yellow-400 border-yellow-400 bg-yellow-900/20";
      case "low": return "text-green-400 border-green-400 bg-green-900/20";
      default: return "text-slate-400 border-slate-400";
    }
  };

  const getHazardIcon = (type: string) => {
    switch (type) {
      case 'weather_warning': return <Wind className="h-4 w-4" />;
      case 'route_deviation': return <Route className="h-4 w-4" />;
      case 'hazard_proximity': return <AlertTriangle className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Route Optimization & Safety Alerts</h2>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-cyan-400 border-cyan-400">
            WEATHER-INTEGRATED
          </Badge>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-8 w-8 text-red-400" />
              <div>
                <p className="text-sm text-slate-400">Active Alerts</p>
                <p className="text-2xl font-bold text-white">{safetyAlerts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Route className="h-8 w-8 text-cyan-400" />
              <div>
                <p className="text-sm text-slate-400">Route Optimizations</p>
                <p className="text-2xl font-bold text-white">{recommendations.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Fuel className="h-8 w-8 text-green-400" />
              <div>
                <p className="text-sm text-slate-400">Avg Fuel Savings</p>
                <p className="text-2xl font-bold text-white">
                  {recommendations.length > 0 
                    ? `${(recommendations.reduce((sum, r) => sum + r.fuelSaving, 0) / recommendations.length).toFixed(1)}%`
                    : '0%'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Clock className="h-8 w-8 text-yellow-400" />
              <div>
                <p className="text-sm text-slate-400">Avg Time Saved</p>
                <p className="text-2xl font-bold text-white">
                  {recommendations.length > 0 
                    ? `${(recommendations.reduce((sum, r) => sum + r.timeSaving, 0) / recommendations.length).toFixed(1)}h`
                    : '0h'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="alerts" className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4" />
            <span>Safety Alerts</span>
          </TabsTrigger>
          <TabsTrigger value="optimization" className="flex items-center space-x-2">
            <Route className="h-4 w-4" />
            <span>Route Optimization</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="alerts">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Weather-Based Safety Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {safetyAlerts.length === 0 ? (
                    <div className="text-center py-8 text-slate-400">
                      <CheckCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No active safety alerts</p>
                      <p className="text-xs">All maritime routes clear</p>
                    </div>
                  ) : (
                    safetyAlerts.map((alert) => (
                      <div key={alert.id} className="p-4 bg-slate-900 rounded-lg border border-slate-700">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            {getHazardIcon(alert.type)}
                            <div>
                              <div className="flex items-center space-x-2 mb-1">
                                <Badge variant="outline" className={getSeverityColor(alert.severity)}>
                                  {alert.severity.toUpperCase()}
                                </Badge>
                                <h4 className="text-white font-medium">{alert.title}</h4>
                              </div>
                              <p className="text-sm text-slate-300 mb-2">{alert.description}</p>
                            </div>
                          </div>
                          <span className="text-xs text-slate-400">{getTimeAgo(alert.timestamp)}</span>
                        </div>

                        {/* Weather Conditions */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3 p-3 bg-slate-800 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <Wind className="h-4 w-4 text-blue-400" />
                            <div>
                              <p className="text-xs text-slate-400">Wind</p>
                              <p className="text-sm text-white">{alert.weatherConditions.windSpeed.toFixed(1)} m/s</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Waves className="h-4 w-4 text-cyan-400" />
                            <div>
                              <p className="text-xs text-slate-400">Waves</p>
                              <p className="text-sm text-white">{alert.weatherConditions.waveHeight.toFixed(1)}m</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Eye className="h-4 w-4 text-green-400" />
                            <div>
                              <p className="text-xs text-slate-400">Visibility</p>
                              <p className="text-sm text-white">{(alert.weatherConditions.visibility / 1000).toFixed(1)}km</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Thermometer className="h-4 w-4 text-red-400" />
                            <div>
                              <p className="text-xs text-slate-400">Temp</p>
                              <p className="text-sm text-white">{alert.weatherConditions.temperature.toFixed(1)}°C</p>
                            </div>
                          </div>
                        </div>

                        {/* Recommendations */}
                        <div className="space-y-2">
                          <h5 className="text-sm font-medium text-cyan-400">Recommendations:</h5>
                          <ul className="space-y-1">
                            {alert.recommendations.map((rec, index) => (
                              <li key={index} className="text-xs text-slate-300 flex items-start space-x-2">
                                <span className="text-cyan-400 mt-1">•</span>
                                <span>{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="mt-3 pt-3 border-t border-slate-700 flex items-center justify-between text-xs text-slate-400">
                          <span>📍 {alert.location[1].toFixed(2)}, {alert.location[0].toFixed(2)}</span>
                          <span>Valid until: {new Date(alert.validUntil).toLocaleString()}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimization">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Navigation className="h-5 w-5 mr-2" />
                Weather-Optimized Route Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {recommendations.length === 0 ? (
                    <div className="text-center py-8 text-slate-400">
                      <Route className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No route optimizations available</p>
                      <p className="text-xs">Current routes are optimal for weather conditions</p>
                    </div>
                  ) : (
                    recommendations.map((rec) => (
                      <div key={rec.id} className="p-4 bg-slate-900 rounded-lg border border-slate-700">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="text-white font-medium mb-1">Route Optimization #{rec.id.slice(-6)}</h4>
                            <p className="text-sm text-slate-300">{rec.reasoning}</p>
                          </div>
                          <Badge variant="outline" className="text-cyan-400 border-cyan-400">
                            {Math.round(rec.confidence * 100)}% CONFIDENCE
                          </Badge>
                        </div>

                        {/* Optimization Metrics */}
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div className="p-3 bg-slate-800 rounded-lg">
                            <div className="flex items-center space-x-2 mb-2">
                              <Clock className="h-4 w-4 text-green-400" />
                              <span className="text-sm text-slate-400">Time Saving</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <TrendingDown className="h-4 w-4 text-green-400" />
                              <span className="text-lg font-bold text-white">{rec.timeSaving.toFixed(1)}h</span>
                            </div>
                          </div>

                          <div className="p-3 bg-slate-800 rounded-lg">
                            <div className="flex items-center space-x-2 mb-2">
                              <Fuel className="h-4 w-4 text-blue-400" />
                              <span className="text-sm text-slate-400">Fuel Saving</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <TrendingDown className="h-4 w-4 text-green-400" />
                              <span className="text-lg font-bold text-white">{rec.fuelSaving.toFixed(1)}%</span>
                            </div>
                          </div>

                          <div className="p-3 bg-slate-800 rounded-lg">
                            <div className="flex items-center space-x-2 mb-2">
                              <Shield className="h-4 w-4 text-cyan-400" />
                              <span className="text-sm text-slate-400">Safety Score</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <TrendingUp className="h-4 w-4 text-green-400" />
                              <span className="text-lg font-bold text-white">{rec.safetyImprovement}</span>
                            </div>
                          </div>
                        </div>

                        {/* Weather Hazards */}
                        {rec.weatherHazards.length > 0 && (
                          <div className="mb-4">
                            <h5 className="text-sm font-medium text-orange-400 mb-2">Weather Hazards Avoided:</h5>
                            <div className="space-y-2">
                              {rec.weatherHazards.slice(0, 3).map((hazard, index) => (
                                <div key={index} className="flex items-center space-x-3 p-2 bg-slate-800 rounded-lg">
                                  <Badge variant="outline" className={getSeverityColor(hazard.severity)}>
                                    {hazard.type.replace('_', ' ').toUpperCase()}
                                  </Badge>
                                  <span className="text-sm text-slate-300">{hazard.description}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span>Generated: {getTimeAgo(rec.generatedAt)}</span>
                          <span>Vessel: {rec.vesselId}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RouteOptimizationDashboard;
