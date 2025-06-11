import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Ship, AlertTriangle, Search, Filter, Eye } from "lucide-react";
import MapboxMap from "@/components/maps/MapboxMap";
import VesselTrackingPanel from "@/components/maps/VesselTrackingPanel";
import { useState } from "react";

const GhostFleet = () => {
  const [selectedVessel, setSelectedVessel] = useState<string>('');

  const ghostVessels = [
    { id: "GV-001", name: "Unknown Tanker", lastSeen: "2 hours ago", location: "North Pacific", risk: "high" },
    { id: "GV-002", name: "Cargo Vessel X", lastSeen: "6 hours ago", location: "South China Sea", risk: "medium" },
    { id: "GV-003", name: "Fishing Fleet", lastSeen: "12 hours ago", location: "Arctic Ocean", risk: "high" },
    { id: "GV-004", name: "Container Ship", lastSeen: "1 day ago", location: "Mediterranean", risk: "low" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Ghost Fleet Tracking</h1>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-red-400 border-red-400">
            156 DARK VESSELS
          </Badge>
          <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700">
            <Eye className="h-4 w-4 mr-2" />
            Track All
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="pt-6">
          <div className="flex space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Search by vessel ID, name, or location..."
                  className="pl-10 bg-slate-900 border-slate-600 text-white"
                />
              </div>
            </div>
            <Button variant="outline" className="border-slate-600">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="active" className="space-y-6">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="active">Active Tracking</TabsTrigger>
          <TabsTrigger value="analysis">Behavior Analysis</TabsTrigger>
          <TabsTrigger value="alerts">Anomaly Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Dark Vessel Detection Map</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-96">
                    <MapboxMap 
                      showVessels={true}
                      showRoutes={false}
                      showAlerts={true}
                      focusMode="ghost"
                      style="mapbox://styles/mapbox/dark-v11"
                      center={[30, 40]}
                      zoom={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <VesselTrackingPanel 
                focusMode="ghost"
                selectedVessel={selectedVessel}
                onVesselSelect={setSelectedVessel}
              />
            </div>
          </div>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Detection Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-slate-300">Total Dark Vessels</span>
                  <span className="text-red-400 font-bold">156</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">New This Week</span>
                  <span className="text-yellow-400 font-bold">23</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">High Risk</span>
                  <span className="text-red-400 font-bold">47</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Under Investigation</span>
                  <span className="text-cyan-400 font-bold">89</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Risk Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Critical</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 h-2 bg-slate-700 rounded-full">
                      <div className="w-8 h-2 bg-red-500 rounded-full"></div>
                    </div>
                    <span className="text-sm text-red-400">30%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">High</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 h-2 bg-slate-700 rounded-full">
                      <div className="w-12 h-2 bg-orange-500 rounded-full"></div>
                    </div>
                    <span className="text-sm text-orange-400">40%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Medium</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 h-2 bg-slate-700 rounded-full">
                      <div className="w-10 h-2 bg-yellow-500 rounded-full"></div>
                    </div>
                    <span className="text-sm text-yellow-400">20%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Low</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 h-2 bg-slate-700 rounded-full">
                      <div className="w-4 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    <span className="text-sm text-green-400">10%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Recent Ghost Vessel Detections</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left py-3 px-4 text-slate-300">Vessel ID</th>
                      <th className="text-left py-3 px-4 text-slate-300">Name</th>
                      <th className="text-left py-3 px-4 text-slate-300">Last Seen</th>
                      <th className="text-left py-3 px-4 text-slate-300">Location</th>
                      <th className="text-left py-3 px-4 text-slate-300">Risk Level</th>
                      <th className="text-left py-3 px-4 text-slate-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ghostVessels.map((vessel) => (
                      <tr key={vessel.id} className="border-b border-slate-700/50">
                        <td className="py-3 px-4 text-cyan-400 font-mono">{vessel.id}</td>
                        <td className="py-3 px-4 text-white">{vessel.name}</td>
                        <td className="py-3 px-4 text-slate-300">{vessel.lastSeen}</td>
                        <td className="py-3 px-4 text-slate-300">{vessel.location}</td>
                        <td className="py-3 px-4">
                          <Badge
                            variant="outline"
                            className={`${
                              vessel.risk === 'high' ? 'text-red-400 border-red-400' :
                              vessel.risk === 'medium' ? 'text-yellow-400 border-yellow-400' :
                              'text-green-400 border-green-400'
                            }`}
                          >
                            {vessel.risk.toUpperCase()}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Button size="sm" variant="outline" className="border-slate-600">
                            <Eye className="h-3 w-3 mr-1" />
                            Track
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Behavioral Pattern Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <AlertTriangle className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Advanced Analytics</h3>
                <p className="text-slate-400">AI-powered behavior analysis and pattern recognition for ghost fleet identification.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Anomaly Detection Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { time: "5 min ago", alert: "Vessel turned off AIS in restricted zone", level: "critical" },
                  { time: "23 min ago", alert: "Unusual route deviation detected", level: "high" },
                  { time: "1 hour ago", alert: "Ship-to-ship transfer in dark waters", level: "critical" },
                  { time: "2 hours ago", alert: "Vessel name change without proper documentation", level: "medium" },
                ].map((alert, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-900 rounded-lg border border-slate-700">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className={`h-5 w-5 ${
                        alert.level === 'critical' ? 'text-red-400' :
                        alert.level === 'high' ? 'text-orange-400' :
                        'text-yellow-400'
                      }`} />
                      <div>
                        <p className="text-white">{alert.alert}</p>
                        <p className="text-xs text-slate-400">{alert.time}</p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={`${
                        alert.level === 'critical' ? 'text-red-400 border-red-400' :
                        alert.level === 'high' ? 'text-orange-400 border-orange-400' :
                        'text-yellow-400 border-yellow-400'
                      }`}
                    >
                      {alert.level.toUpperCase()}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GhostFleet;
