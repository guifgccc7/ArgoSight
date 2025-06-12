
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Layers, 
  Target, 
  Radar,
  Satellite,
  Ship,
  CloudRain,
  Zap,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import { realTimeDataProcessor, FusedVesselData } from '@/services/realTimeDataProcessor';

interface FusionMetrics {
  totalSources: number;
  activeFusions: number;
  dataQuality: number;
  fusionAccuracy: number;
  conflictResolution: number;
}

const DataFusionPanel: React.FC = () => {
  const [fusedData, setFusedData] = useState<FusedVesselData[]>([]);
  const [fusionMetrics, setFusionMetrics] = useState<FusionMetrics>({
    totalSources: 4,
    activeFusions: 0,
    dataQuality: 94.2,
    fusionAccuracy: 91.8,
    conflictResolution: 87.3
  });

  useEffect(() => {
    const unsubscribe = realTimeDataProcessor.subscribe((data) => {
      setFusedData(prev => [data, ...prev.slice(0, 19)]); // Keep last 20
      setFusionMetrics(prev => ({
        ...prev,
        activeFusions: prev.activeFusions + 1,
        dataQuality: Math.min(100, prev.dataQuality + (Math.random() - 0.5)),
        fusionAccuracy: Math.min(100, prev.fusionAccuracy + (Math.random() - 0.5)),
        conflictResolution: Math.min(100, prev.conflictResolution + (Math.random() - 0.5))
      }));
    });

    return unsubscribe;
  }, []);

  const getSourceIcon = (source: string) => {
    if (source.includes('ais')) return <Ship className="h-4 w-4 text-cyan-400" />;
    if (source.includes('satellite')) return <Satellite className="h-4 w-4 text-purple-400" />;
    if (source.includes('radar')) return <Radar className="h-4 w-4 text-green-400" />;
    if (source.includes('weather')) return <CloudRain className="h-4 w-4 text-blue-400" />;
    return <Target className="h-4 w-4 text-slate-400" />;
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence > 0.8) return 'text-green-400 border-green-400';
    if (confidence > 0.6) return 'text-yellow-400 border-yellow-400';
    return 'text-red-400 border-red-400';
  };

  const getReliabilityIcon = (reliability: number) => {
    if (reliability > 0.8) return <CheckCircle className="h-4 w-4 text-green-400" />;
    return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <Layers className="h-6 w-6 mr-2" />
          Data Fusion Engine
        </h2>
        <Badge variant="outline" className="text-green-400 border-green-400">
          <Zap className="h-3 w-3 mr-1" />
          ACTIVE FUSION
        </Badge>
      </div>

      {/* Fusion Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Layers className="h-5 w-5 text-cyan-400" />
              <div>
                <p className="text-xs text-slate-400">Data Sources</p>
                <p className="text-lg font-bold text-white">{fusionMetrics.totalSources}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-green-400" />
              <div>
                <p className="text-xs text-slate-400">Active Fusions</p>
                <p className="text-lg font-bold text-white">{fusionMetrics.activeFusions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div>
                <p className="text-xs text-slate-400">Data Quality</p>
                <div className="flex items-center space-x-2">
                  <Progress value={fusionMetrics.dataQuality} className="flex-1 h-2" />
                  <span className="text-sm font-bold text-white">{fusionMetrics.dataQuality.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div>
                <p className="text-xs text-slate-400">Fusion Accuracy</p>
                <div className="flex items-center space-x-2">
                  <Progress value={fusionMetrics.fusionAccuracy} className="flex-1 h-2" />
                  <span className="text-sm font-bold text-white">{fusionMetrics.fusionAccuracy.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="fused-data" className="space-y-4">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="fused-data">Fused Data Stream</TabsTrigger>
          <TabsTrigger value="source-analysis">Source Analysis</TabsTrigger>
          <TabsTrigger value="conflict-resolution">Conflict Resolution</TabsTrigger>
        </TabsList>

        <TabsContent value="fused-data">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Real-Time Fused Vessel Data</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {fusedData.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    <Target className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Waiting for fused data...</p>
                  </div>
                ) : (
                  fusedData.map((data, index) => (
                    <div key={index} className="p-3 bg-slate-900 rounded-lg border border-slate-700">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Ship className="h-4 w-4 text-cyan-400" />
                          <span className="text-white font-medium">{data.vesselType}</span>
                          <Badge variant="outline" className={getConfidenceColor(data.confidence)}>
                            {(data.confidence * 100).toFixed(0)}% CONF
                          </Badge>
                        </div>
                        {getReliabilityIcon(data.reliability)}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs mb-2">
                        <div>
                          <span className="text-slate-400">Position</span>
                          <p className="text-white">{data.lat.toFixed(2)}, {data.lng.toFixed(2)}</p>
                        </div>
                        <div>
                          <span className="text-slate-400">Speed</span>
                          <p className="text-white">{data.speed.toFixed(1)} kts</p>
                        </div>
                        <div>
                          <span className="text-slate-400">Course</span>
                          <p className="text-white">{data.course.toFixed(0)}°</p>
                        </div>
                        <div>
                          <span className="text-slate-400">Reliability</span>
                          <p className="text-white">{(data.reliability * 100).toFixed(0)}%</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-xs text-slate-400">Sources:</span>
                        {data.sources.map((source, idx) => (
                          <div key={idx} className="flex items-center space-x-1">
                            {getSourceIcon(source)}
                            <span className="text-xs text-slate-300">{source}</span>
                          </div>
                        ))}
                      </div>

                      <div className="text-xs text-slate-400">
                        Fused at: {new Date(data.fusedAt).toLocaleTimeString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="source-analysis">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Source Quality Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'AIS Feed', quality: 96.2, latency: 150, reliability: 95.8 },
                  { name: 'Satellite Data', quality: 88.4, latency: 300, reliability: 88.2 },
                  { name: 'Radar Network', quality: 92.1, latency: 80, reliability: 92.5 },
                  { name: 'Weather Intel', quality: 85.3, latency: 200, reliability: 85.1 }
                ].map((source, index) => (
                  <div key={index} className="p-3 bg-slate-900 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">{source.name}</span>
                      <Badge variant="outline" className="text-green-400 border-green-400">
                        ACTIVE
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <span className="text-xs text-slate-400">Quality</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={source.quality} className="flex-1 h-2" />
                          <span className="text-xs text-white">{source.quality}%</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-xs text-slate-400">Latency</span>
                        <p className="text-sm text-white">{source.latency}ms</p>
                      </div>
                      <div>
                        <span className="text-xs text-slate-400">Reliability</span>
                        <p className="text-sm text-white">{source.reliability}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conflict-resolution">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Conflict Resolution Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 bg-slate-900 rounded-lg">
                  <h4 className="text-white font-medium mb-2">Resolution Algorithms</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">Weighted Average</span>
                      <Badge variant="outline" className="text-green-400 border-green-400">ACTIVE</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">Source Reliability</span>
                      <Badge variant="outline" className="text-green-400 border-green-400">ACTIVE</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">Temporal Correlation</span>
                      <Badge variant="outline" className="text-green-400 border-green-400">ACTIVE</Badge>
                    </div>
                  </div>
                </div>
                
                <div className="text-center py-8 text-slate-400">
                  <CheckCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No conflicts detected in current data stream</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DataFusionPanel;
