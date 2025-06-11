
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Satellite, Camera, Download, Layers, Calendar } from "lucide-react";

const SatelliteImagery = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Satellite Imagery Platform</h1>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-green-400 border-green-400">
            47 SATELLITES ACTIVE
          </Badge>
          <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      <Tabs defaultValue="viewer" className="space-y-6">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="viewer">Image Viewer</TabsTrigger>
          <TabsTrigger value="analysis">Analysis Tools</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="coverage">Coverage Map</TabsTrigger>
        </TabsList>

        <TabsContent value="viewer" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white">Satellite Image Viewer</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline">
                        <Layers className="h-4 w-4 mr-2" />
                        Layers
                      </Button>
                      <Button size="sm" variant="outline">
                        <Calendar className="h-4 w-4 mr-2" />
                        Timeline
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-96 bg-slate-900 rounded-lg flex items-center justify-center border border-slate-600">
                    <div className="text-center">
                      <Satellite className="h-16 w-16 text-cyan-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">High-Resolution Satellite Viewer</h3>
                      <p className="text-slate-400">Real-time and historical satellite imagery analysis</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Image Controls</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-slate-300 mb-2 block">Satellite Source</label>
                      <select className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white">
                        <option>Sentinel-2A</option>
                        <option>Landsat 8</option>
                        <option>WorldView-3</option>
                        <option>SPOT-7</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-slate-300 mb-2 block">Image Date</label>
                      <input 
                        type="date" 
                        className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-slate-300 mb-2 block">Resolution</label>
                      <select className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white">
                        <option>0.3m (Ultra High)</option>
                        <option>1m (Very High)</option>
                        <option>10m (High)</option>
                        <option>30m (Medium)</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Image Info</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-300">Capture Time:</span>
                      <span className="text-white">14:32 UTC</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Cloud Cover:</span>
                      <span className="text-green-400">8%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Quality Score:</span>
                      <span className="text-green-400">9.2/10</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Processing:</span>
                      <Badge variant="outline" className="text-green-400 border-green-400">COMPLETE</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analysis">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Advanced Analysis Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Camera className="h-16 w-16 text-cyan-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">AI-Powered Image Analysis</h3>
                <p className="text-slate-400">Object detection, change analysis, and threat assessment tools.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Temporal Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 text-cyan-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Timeline Control</h3>
                <p className="text-slate-400">Temporal image analysis and change detection over time.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="coverage">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Satellite Coverage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Satellite className="h-16 w-16 text-cyan-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Global Coverage Map</h3>
                <p className="text-slate-400">Real-time satellite positions and coverage areas.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SatelliteImagery;
