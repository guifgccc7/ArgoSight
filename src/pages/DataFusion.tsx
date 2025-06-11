
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Database, Satellite, Ship, Radar, RefreshCw } from "lucide-react";

const DataFusion = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Data Fusion & Real-Time Operations</h1>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-green-400 border-green-400">
            LIVE
          </Badge>
          <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700">
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync Data
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="satellite">Satellite Feed</TabsTrigger>
          <TabsTrigger value="maritime">Maritime Signals</TabsTrigger>
          <TabsTrigger value="intelligence">Intelligence Sources</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Satellite className="h-5 w-5 text-cyan-400" />
                  <span className="text-white">Satellite Data</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-slate-300">Active Satellites</span>
                    <span className="text-white font-medium">47</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Coverage</span>
                    <span className="text-green-400 font-medium">98.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Data Quality</span>
                    <Badge variant="outline" className="text-green-400 border-green-400">EXCELLENT</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Ship className="h-5 w-5 text-cyan-400" />
                  <span className="text-white">AIS Tracking</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-slate-300">Tracked Vessels</span>
                    <span className="text-white font-medium">2,847</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Dark Vessels</span>
                    <span className="text-red-400 font-medium">156</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Update Rate</span>
                    <Badge variant="outline" className="text-green-400 border-green-400">REAL-TIME</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Radar className="h-5 w-5 text-cyan-400" />
                  <span className="text-white">Radar Systems</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-slate-300">Active Stations</span>
                    <span className="text-white font-medium">234</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Range Coverage</span>
                    <span className="text-green-400 font-medium">450nm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Detection Rate</span>
                    <Badge variant="outline" className="text-green-400 border-green-400">HIGH</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Real-Time Data Streams</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { source: "NOAA Weather Buoys", status: "active", latency: "0.2s", quality: "high" },
                  { source: "Military Radar Network", status: "active", latency: "0.1s", quality: "excellent" },
                  { source: "Commercial AIS Feed", status: "active", latency: "0.5s", quality: "good" },
                  { source: "Satellite Imagery", status: "active", latency: "15min", quality: "high" },
                  { source: "Intelligence Reports", status: "delayed", latency: "2hr", quality: "medium" },
                ].map((stream, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        stream.status === 'active' ? 'bg-green-400' : 'bg-yellow-400'
                      }`} />
                      <span className="text-slate-300">{stream.source}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-xs text-slate-400">Latency: {stream.latency}</span>
                      <Badge variant="outline" className={`${
                        stream.quality === 'excellent' ? 'text-green-400 border-green-400' :
                        stream.quality === 'high' ? 'text-cyan-400 border-cyan-400' :
                        stream.quality === 'good' ? 'text-blue-400 border-blue-400' :
                        'text-yellow-400 border-yellow-400'
                      }`}>
                        {stream.quality.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="satellite">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Satellite Data Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Satellite className="h-16 w-16 text-cyan-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Satellite Feed Integration</h3>
                <p className="text-slate-400">Real-time satellite data processing and analysis coming soon.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maritime">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Maritime Signal Processing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Ship className="h-16 w-16 text-cyan-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Maritime Signal Analysis</h3>
                <p className="text-slate-400">Advanced signal processing and vessel identification systems.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="intelligence">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Intelligence Source Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Database className="h-16 w-16 text-cyan-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Intelligence Data Fusion</h3>
                <p className="text-slate-400">Multi-source intelligence correlation and analysis platform.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DataFusion;
