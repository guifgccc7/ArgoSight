
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Satellite, Download, Layers, Calendar } from "lucide-react";
import MapboxMap from "@/components/maps/MapboxMap";
import SatelliteControls from "@/components/satellite/SatelliteControls";
import AnalysisTools from "@/components/satellite/AnalysisTools";
import TimelineControls from "@/components/satellite/TimelineControls";
import CoverageMap from "@/components/satellite/CoverageMap";

const SatelliteImagery = () => {
  const handleSourceChange = (source: string) => {
    console.log('Satellite source changed to:', source);
  };

  const handleDateChange = (date: Date) => {
    console.log('Date changed to:', date);
  };

  const handleResolutionChange = (resolution: string) => {
    console.log('Resolution changed to:', resolution);
  };

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
                  <div className="h-96 rounded-lg overflow-hidden">
                    <MapboxMap 
                      className="w-full h-full"
                      style="mapbox://styles/mapbox/satellite-v9"
                      showVessels={true}
                      showRoutes={false}
                      showAlerts={true}
                      center={[0, 30]}
                      zoom={4}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <SatelliteControls 
                onSourceChange={handleSourceChange}
                onDateChange={handleDateChange}
                onResolutionChange={handleResolutionChange}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analysis">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Analysis Overlay</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-96 rounded-lg overflow-hidden">
                    <MapboxMap 
                      className="w-full h-full"
                      style="mapbox://styles/mapbox/satellite-v9"
                      showVessels={true}
                      showRoutes={false}
                      showAlerts={true}
                      center={[45.2, 12.1]}
                      zoom={8}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
            <div>
              <AnalysisTools />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="timeline">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Temporal Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-96 rounded-lg overflow-hidden">
                    <MapboxMap 
                      className="w-full h-full"
                      style="mapbox://styles/mapbox/satellite-v9"
                      showVessels={false}
                      showRoutes={false}
                      showAlerts={false}
                      center={[0, 30]}
                      zoom={4}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
            <div>
              <TimelineControls />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="coverage">
          <CoverageMap />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SatelliteImagery;
