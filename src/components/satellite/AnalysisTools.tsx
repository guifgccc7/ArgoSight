
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Camera, Layers } from "lucide-react";

const AnalysisTools = () => {
  const [activeAnalysis, setActiveAnalysis] = useState<string | null>(null);

  const detectedObjects = [
    { id: 1, type: "Vessel", confidence: 98.5, coordinates: [45.2, 12.1] },
    { id: 2, type: "Building", confidence: 94.2, coordinates: [45.3, 12.2] },
    { id: 3, type: "Aircraft", confidence: 89.7, coordinates: [45.1, 12.0] },
  ];

  const threatAlerts = [
    { id: 1, type: "Unauthorized Vessel", severity: "high", location: "Arctic Zone A" },
    { id: 2, type: "Infrastructure Change", severity: "medium", location: "Port Area" },
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Camera className="h-5 w-5 mr-2" />
            AI Analysis Tools
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="detection" className="space-y-4">
            <TabsList className="bg-slate-900 border-slate-700">
              <TabsTrigger value="detection">Object Detection</TabsTrigger>
              <TabsTrigger value="change">Change Analysis</TabsTrigger>
              <TabsTrigger value="threats">Threat Assessment</TabsTrigger>
            </TabsList>

            <TabsContent value="detection" className="space-y-4">
              <div className="flex space-x-2 mb-4">
                <Button 
                  size="sm" 
                  onClick={() => setActiveAnalysis('vessels')}
                  variant={activeAnalysis === 'vessels' ? "default" : "outline"}
                >
                  Detect Vessels
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => setActiveAnalysis('infrastructure')}
                  variant={activeAnalysis === 'infrastructure' ? "default" : "outline"}
                >
                  Infrastructure
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => setActiveAnalysis('aircraft')}
                  variant={activeAnalysis === 'aircraft' ? "default" : "outline"}
                >
                  Aircraft
                </Button>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-white">Detected Objects</h4>
                {detectedObjects.map((obj) => (
                  <div key={obj.id} className="flex items-center justify-between p-2 bg-slate-900 rounded text-sm">
                    <span className="text-white">{obj.type}</span>
                    <Badge variant="outline" className="text-cyan-400 border-cyan-400">
                      {obj.confidence}%
                    </Badge>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="change" className="space-y-4">
              <div className="flex space-x-2 mb-4">
                <Button size="sm" variant="outline">
                  Compare with Previous
                </Button>
                <Button size="sm" variant="outline">
                  <Layers className="h-4 w-4 mr-2" />
                  Overlay Changes
                </Button>
              </div>
              
              <div className="p-4 bg-slate-900 rounded">
                <p className="text-sm text-slate-300">
                  Change detection analysis comparing current imagery with historical data from the same location.
                </p>
                <div className="mt-2 text-xs text-cyan-400">
                  Last comparison: 2 days ago
                </div>
              </div>
            </TabsContent>

            <TabsContent value="threats" className="space-y-4">
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-white">Active Threats</h4>
                {threatAlerts.map((threat) => (
                  <div key={threat.id} className="p-2 bg-slate-900 rounded border-l-4 border-red-500">
                    <div className="flex items-center justify-between">
                      <span className="text-white text-sm">{threat.type}</span>
                      <Badge 
                        variant="outline" 
                        className={`${threat.severity === 'high' ? 'text-red-400 border-red-400' : 'text-yellow-400 border-yellow-400'}`}
                      >
                        {threat.severity.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="text-xs text-slate-400 mt-1">{threat.location}</div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalysisTools;
