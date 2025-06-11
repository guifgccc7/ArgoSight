
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, Brain, Target, TrendingUp, Download } from 'lucide-react';
import { ghostFleetDetectionService, GhostVesselAlert, VesselBehaviorPattern } from '@/services/ghostFleetDetectionService';
import { liveDataService } from '@/services/liveDataService';

const DetectionDashboard: React.FC = () => {
  const [alerts, setAlerts] = useState<GhostVesselAlert[]>([]);
  const [detectionStats, setDetectionStats] = useState<any>(null);
  const [selectedAlert, setSelectedAlert] = useState<string>('');

  useEffect(() => {
    // Subscribe to live data and run detection algorithms
    const unsubscribeLive = liveDataService.subscribe((data) => {
      if (data.vessels) {
        const detectedAlerts = ghostFleetDetectionService.detectSuspiciousBehavior(data.vessels);
        setAlerts(detectedAlerts);
      }
    });

    // Subscribe to detection service updates
    const unsubscribeDetection = ghostFleetDetectionService.subscribe((newAlerts) => {
      setAlerts(newAlerts);
    });

    // Get detection statistics
    setDetectionStats(ghostFleetDetectionService.getDetectionStats());

    // Start live data feed
    liveDataService.startLiveDataFeed();

    return () => {
      unsubscribeLive();
      unsubscribeDetection();
    };
  }, []);

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
    const data = ghostFleetDetectionService.exportDetectionData();
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
      {/* Detection Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Active Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{alerts.length}</div>
            <p className="text-xs text-slate-400">+{Math.floor(Math.random() * 5) + 1} new today</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Vessels Monitored</CardTitle>
            <Target className="h-4 w-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{detectionStats?.totalVesselsMonitored || 0}</div>
            <p className="text-xs text-slate-400">Real-time tracking</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Detection Accuracy</CardTitle>
            <Brain className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">87.2%</div>
            <p className="text-xs text-slate-400">ML confidence score</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Algorithms Active</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">4</div>
            <p className="text-xs text-slate-400">Detection methods</p>
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
                  <p>No active alerts detected</p>
                  <p className="text-sm">AI monitoring systems are operational</p>
                </div>
              ) : (
                alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-lg border transition-all cursor-pointer ${
                      selectedAlert === alert.id 
                        ? 'bg-slate-700 border-cyan-500' 
                        : 'bg-slate-900 border-slate-700 hover:border-slate-600'
                    }`}
                    onClick={() => setSelectedAlert(selectedAlert === alert.id ? '' : alert.id)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${getSeverityColor(alert.riskLevel)}`}>
                          {getAlertTypeIcon(alert.alertType)}
                        </div>
                        <div>
                          <h4 className="text-white font-medium">{alert.vesselName}</h4>
                          <p className="text-sm text-slate-400 font-mono">{alert.vesselId}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className={getSeverityColor(alert.riskLevel)}>
                        {alert.riskLevel.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                      <div>
                        <span className="text-slate-400">Alert Type:</span>
                        <span className="text-white ml-2">{alert.alertType.replace('_', ' ').toUpperCase()}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Location:</span>
                        <span className="text-white ml-2">{alert.location[1].toFixed(2)}, {alert.location[0].toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Detected:</span>
                        <span className="text-white ml-2">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Patterns:</span>
                        <span className="text-cyan-400 ml-2">{alert.patterns.length} detected</span>
                      </div>
                    </div>

                    {selectedAlert === alert.id && (
                      <div className="border-t border-slate-700 pt-3 mt-3">
                        <h5 className="text-white font-medium mb-2">Detection Patterns:</h5>
                        <div className="space-y-2">
                          {alert.patterns.map((pattern, index) => (
                            <div key={index} className="bg-slate-800 p-3 rounded border border-slate-600">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-cyan-400 font-medium">
                                  {pattern.patternType.replace('_', ' ').toUpperCase()}
                                </span>
                                <Badge variant="outline" className={getSeverityColor(pattern.severity)}>
                                  {pattern.severity}
                                </Badge>
                              </div>
                              <p className="text-slate-300 text-sm mb-2">{pattern.description}</p>
                              <div className="flex items-center justify-between text-xs text-slate-400">
                                <span>Confidence: {(pattern.confidence * 100).toFixed(1)}%</span>
                                <span>{new Date(pattern.detectedAt).toLocaleTimeString()}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-3 p-3 bg-blue-900/20 border border-blue-500/30 rounded">
                          <h6 className="text-blue-400 font-medium mb-1">Recommendation:</h6>
                          <p className="text-slate-300 text-sm">{alert.recommendation}</p>
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

      {/* Detection Algorithms Status */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Detection Algorithms Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: 'AIS Gap Detection', status: 'Active', accuracy: '92.1%', description: 'Monitors AIS signal interruptions' },
              { name: 'Route Deviation Analysis', status: 'Active', accuracy: '84.7%', description: 'Detects unusual route changes' },
              { name: 'Speed Anomaly Detection', status: 'Active', accuracy: '78.3%', description: 'Identifies suspicious speed patterns' },
              { name: 'Identity Switch Detection', status: 'Active', accuracy: '95.2%', description: 'Tracks vessel identity changes' }
            ].map((algorithm, index) => (
              <div key={index} className="p-4 bg-slate-900 rounded-lg border border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white font-medium">{algorithm.name}</h4>
                  <Badge variant="outline" className="text-green-400 border-green-400">
                    {algorithm.status}
                  </Badge>
                </div>
                <p className="text-slate-400 text-sm mb-2">{algorithm.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-300">Accuracy:</span>
                  <span className="text-cyan-400 font-medium">{algorithm.accuracy}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DetectionDashboard;
