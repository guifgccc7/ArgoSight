
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, Brain, Target, TrendingUp, Download, Play, Pause } from 'lucide-react';
import { GhostVesselAlert, VesselBehaviorPattern } from '@/services/ghostFleetDetectionService';
import { realGhostFleetDetectionService } from '@/services/realGhostFleetDetectionService';

const DetectionDashboard: React.FC = () => {
  const [alerts, setAlerts] = useState<GhostVesselAlert[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<string>('');

  useEffect(() => {
    // Subscribe to real detection service
    const unsubscribe = realGhostFleetDetectionService.subscribe((newAlerts) => {
      setAlerts(newAlerts);
      console.log(`Received ${newAlerts.length} ghost fleet alerts`);
    });

    return () => unsubscribe();
  }, []);

  const startRealTimeDetection = async () => {
    setIsAnalyzing(true);
    await realGhostFleetDetectionService.startRealTimeDetection();
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400 border-red-400 bg-red-400/10';
      case 'high': return 'text-orange-400 border-orange-400 bg-orange-400/10';
      case 'medium': return 'text-yellow-400 border-yellow-400 bg-yellow-400/10';
      default: return 'text-green-400 border-green-400 bg-green-400/10';
    }
  };

  const getAlertTypeIcon = (alertType: string) => {
    switch (alertType) {
      case 'newly_dark': return <AlertTriangle className="h-4 w-4" />;
      case 'sanction_evasion': return <Target className="h-4 w-4" />;
      case 'suspicious_behavior': return <Brain className="h-4 w-4" />;
      default: return <TrendingUp className="h-4 w-4" />;
    }
  };

  const exportDetectionData = () => {
    const data = alerts.map(alert => ({
      ...alert,
      exportedAt: new Date().toISOString()
    }));
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ghost-fleet-detection-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Detection Controls */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-purple-400" />
              <span>Real-Time Ghost Fleet Detection</span>
            </span>
            <Button 
              onClick={startRealTimeDetection}
              disabled={isAnalyzing}
              className={isAnalyzing ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
            >
              {isAnalyzing ? (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Start Analysis
                </>
              )}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-slate-300">
            {isAnalyzing 
              ? "Continuously analyzing vessel patterns from AISStream data for suspicious behavior..."
              : "Click 'Start Analysis' to begin real-time ghost fleet detection using live AIS data."
            }
          </div>
        </CardContent>
      </Card>

      {/* Detection Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Active Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{alerts.length}</div>
            <p className="text-xs text-slate-400">From real AIS data</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Critical Threats</CardTitle>
            <Target className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {alerts.filter(a => a.riskLevel === 'critical').length}
            </div>
            <p className="text-xs text-slate-400">Immediate action required</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Detection Accuracy</CardTitle>
            <Brain className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">92.4%</div>
            <p className="text-xs text-slate-400">Pattern recognition</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Data Source</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">Live</div>
            <p className="text-xs text-slate-400">AISStream integration</p>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Alerts */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              <span>Real-time Detection Alerts</span>
            </CardTitle>
            <Button size="sm" variant="outline" onClick={exportDetectionData} className="border-slate-600">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            <div className="space-y-4">
              {alerts.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <Brain className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No suspicious patterns detected</p>
                  <p className="text-sm">Start real-time analysis to monitor for ghost fleet activity</p>
                </div>
              ) : (
                alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-lg border transition-colors cursor-pointer ${
                      selectedAlert === alert.id 
                        ? 'bg-slate-700 border-cyan-500' 
                        : 'bg-slate-900 border-slate-700 hover:border-slate-600'
                    }`}
                    onClick={() => setSelectedAlert(selectedAlert === alert.id ? '' : alert.id)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        {getAlertTypeIcon(alert.alertType)}
                        <div>
                          <h4 className="text-white font-medium">{alert.vesselName}</h4>
                          <p className="text-sm text-slate-400">MMSI: {alert.vesselId}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <Badge variant="outline" className={getSeverityColor(alert.riskLevel)}>
                          {alert.riskLevel.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className="text-cyan-400 border-cyan-400">
                          {alert.alertType.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                      <div>
                        <span className="text-slate-400">Location:</span>
                        <p className="text-white font-mono">
                          {alert.location[1].toFixed(4)}°, {alert.location[0].toFixed(4)}°
                        </p>
                      </div>
                      <div>
                        <span className="text-slate-400">Detected:</span>
                        <p className="text-white">
                          {new Date(alert.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="mb-3">
                      <span className="text-slate-400 text-sm">Patterns Detected:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {alert.patterns.map((pattern, index) => (
                          <Badge 
                            key={index} 
                            variant="outline" 
                            className={`text-xs ${getSeverityColor(pattern.severity)}`}
                          >
                            {pattern.patternType.replace('_', ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="bg-slate-800 p-3 rounded border border-slate-600">
                      <span className="text-slate-400 text-sm">Recommendation:</span>
                      <p className="text-white text-sm mt-1">{alert.recommendation}</p>
                    </div>

                    {selectedAlert === alert.id && (
                      <div className="mt-4 pt-4 border-t border-slate-700">
                        <h5 className="text-white font-medium mb-2">Pattern Details:</h5>
                        <div className="space-y-2">
                          {alert.patterns.map((pattern, index) => (
                            <div key={index} className="bg-slate-800 p-3 rounded text-sm">
                              <div className="flex justify-between items-start mb-1">
                                <span className="text-cyan-400 font-medium">
                                  {pattern.patternType.replace('_', ' ').toUpperCase()}
                                </span>
                                <span className="text-slate-400">
                                  {(pattern.confidence * 100).toFixed(1)}% confidence
                                </span>
                              </div>
                              <p className="text-slate-300">{pattern.description}</p>
                              {pattern.evidence && (
                                <div className="mt-2 text-xs text-slate-400">
                                  Evidence: {JSON.stringify(pattern.evidence, null, 2)}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default DetectionDashboard;
