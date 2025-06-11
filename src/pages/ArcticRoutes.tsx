import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Snowflake, Route, Thermometer, Wind, Ship, TrendingUp } from "lucide-react";
import IceCoverageChart from "@/components/charts/IceCoverageChart";
import VesselTrafficChart from "@/components/charts/VesselTrafficChart";
import RouteSavingsChart from "@/components/charts/RouteSavingsChart";
import WeatherPanel from "@/components/arctic/WeatherPanel";
import MapboxMap from "@/components/maps/MapboxMap";

const ArcticRoutes = () => {
  const routes = [
    { 
      name: "Northeast Passage", 
      status: "Open", 
      iceLevel: 15, 
      vessels: 47, 
      savings: "35%",
      risk: "medium"
    },
    { 
      name: "Northwest Passage", 
      status: "Restricted", 
      iceLevel: 68, 
      vessels: 8, 
      savings: "42%",
      risk: "high"
    },
    { 
      name: "Transpolar Route", 
      status: "Closed", 
      iceLevel: 85, 
      vessels: 0, 
      savings: "55%",
      risk: "critical"
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Arctic Routes Analysis</h1>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-cyan-400 border-cyan-400">
            ICE SEASON 2024
          </Badge>
          <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700">
            <Route className="h-4 w-4 mr-2" />
            Route Planner
          </Button>
        </div>
      </div>

      {/* Route Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {routes.map((route) => (
          <Card key={route.name} className="bg-slate-800 border-slate-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">{route.name}</CardTitle>
                <Badge 
                  variant="outline" 
                  className={`${
                    route.status === 'Open' ? 'text-green-400 border-green-400' :
                    route.status === 'Restricted' ? 'text-yellow-400 border-yellow-400' :
                    'text-red-400 border-red-400'
                  }`}
                >
                  {route.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-300">Ice Coverage</span>
                    <span className="text-white">{route.iceLevel}%</span>
                  </div>
                  <Progress value={route.iceLevel} className="h-2" />
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Active Vessels</span>
                  <span className="text-cyan-400 font-medium">{route.vessels}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Cost Savings</span>
                  <span className="text-green-400 font-medium">{route.savings}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Risk Level</span>
                  <Badge 
                    variant="outline" 
                    className={`${
                      route.risk === 'medium' ? 'text-yellow-400 border-yellow-400' :
                      route.risk === 'high' ? 'text-orange-400 border-orange-400' :
                      'text-red-400 border-red-400'
                    }`}
                  >
                    {route.risk.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="map" className="space-y-6">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="map">Route Map</TabsTrigger>
          <TabsTrigger value="conditions">Ice Conditions</TabsTrigger>
          <TabsTrigger value="traffic">Traffic Analysis</TabsTrigger>
          <TabsTrigger value="forecast">Weather Forecast</TabsTrigger>
          <TabsTrigger value="analytics">Route Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="map" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Arctic Navigation Map</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <MapboxMap 
                    className="h-96 rounded-b-lg"
                    focusMode="arctic"
                    showRoutes={true}
                    showVessels={true}
                    showAlerts={true}
                    center={[90, 75]}
                    zoom={3}
                  />
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Current Conditions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Thermometer className="h-4 w-4 text-blue-400" />
                        <span className="text-slate-300">Temperature</span>
                      </div>
                      <span className="text-white">-15°C</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Wind className="h-4 w-4 text-cyan-400" />
                        <span className="text-slate-300">Wind Speed</span>
                      </div>
                      <span className="text-white">25 kt</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Snowflake className="h-4 w-4 text-white" />
                        <span className="text-slate-300">Ice Thickness</span>
                      </div>
                      <span className="text-white">2.1m</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Ship className="h-4 w-4 text-green-400" />
                        <span className="text-slate-300">Icebreaker Support</span>
                      </div>
                      <Badge variant="outline" className="text-green-400 border-green-400">
                        AVAILABLE
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Route Efficiency</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-300">Distance Reduction</span>
                        <span className="text-green-400">40%</span>
                      </div>
                      <Progress value={40} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-300">Time Savings</span>
                        <span className="text-green-400">35%</span>
                      </div>
                      <Progress value={35} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-300">Fuel Efficiency</span>
                        <span className="text-green-400">28%</span>
                      </div>
                      <Progress value={28} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="conditions">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Annual Ice Coverage Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <IceCoverageChart />
              </CardContent>
            </Card>

            <WeatherPanel />
          </div>
        </TabsContent>

        <TabsContent value="traffic">
          <div className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Arctic Traffic Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="bg-slate-900 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-white">55</div>
                    <div className="text-sm text-slate-400">Vessels This Season</div>
                    <div className="text-xs text-green-400">+23% vs 2023</div>
                  </div>
                  <div className="bg-slate-900 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-white">12.4M</div>
                    <div className="text-sm text-slate-400">Tons Cargo</div>
                    <div className="text-xs text-green-400">+18% vs 2023</div>
                  </div>
                  <div className="bg-slate-900 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-white">156</div>
                    <div className="text-sm text-slate-400">Transit Days Saved</div>
                    <div className="text-xs text-cyan-400">Per route</div>
                  </div>
                  <div className="bg-slate-900 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-white">$2.1B</div>
                    <div className="text-sm text-slate-400">Cost Savings</div>
                    <div className="text-xs text-green-400">Industry total</div>
                  </div>
                </div>

                <div className="text-center py-8">
                  <TrendingUp className="h-16 w-16 text-green-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Traffic Trend Analysis</h3>
                  <p className="text-slate-400">Historical and predictive shipping traffic patterns in Arctic waters.</p>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Historical Vessel Traffic</CardTitle>
                </CardHeader>
                <CardContent>
                  <VesselTrafficChart />
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Route Efficiency Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <RouteSavingsChart />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="forecast">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">7-Day Arctic Forecast</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                  <div key={day} className="bg-slate-900 p-4 rounded-lg text-center">
                    <div className="text-sm text-slate-400 mb-2">{day}</div>
                    <Snowflake className="h-6 w-6 text-cyan-400 mx-auto mb-2" />
                    <div className="text-lg font-bold text-white">-{12 + index}°C</div>
                    <div className="text-xs text-slate-400">{15 + index * 2} kt wind</div>
                    <div className="text-xs text-cyan-400 mt-1">
                      {index < 3 ? 'Favorable' : index < 5 ? 'Caution' : 'Restricted'}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Route Performance Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-slate-900 p-4 rounded-lg">
                    <h4 className="text-white font-medium mb-2">Best Performing Route</h4>
                    <div className="text-cyan-400 text-lg font-bold">Northeast Passage</div>
                    <div className="text-sm text-slate-300">35% cost reduction vs traditional routes</div>
                  </div>
                  <div className="bg-slate-900 p-4 rounded-lg">
                    <h4 className="text-white font-medium mb-2">Peak Season</h4>
                    <div className="text-green-400 text-lg font-bold">July - September</div>
                    <div className="text-sm text-slate-300">Optimal ice conditions for navigation</div>
                  </div>
                  <div className="bg-slate-900 p-4 rounded-lg">
                    <h4 className="text-white font-medium mb-2">Safety Record</h4>
                    <div className="text-yellow-400 text-lg font-bold">99.2% Success Rate</div>
                    <div className="text-sm text-slate-300">2024 transit completion rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Environmental Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-300">CO₂ Emissions Reduction</span>
                      <span className="text-green-400">-42%</span>
                    </div>
                    <Progress value={42} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-300">Fuel Consumption Savings</span>
                      <span className="text-green-400">-38%</span>
                    </div>
                    <Progress value={38} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-300">Transit Time Reduction</span>
                      <span className="text-green-400">-35%</span>
                    </div>
                    <Progress value={35} className="h-2" />
                  </div>
                  <div className="bg-slate-900 p-4 rounded-lg mt-4">
                    <div className="text-sm text-slate-300">Estimated Annual Savings</div>
                    <div className="text-2xl font-bold text-green-400">$2.1B</div>
                    <div className="text-xs text-slate-400">Industry-wide cost reduction</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ArcticRoutes;
