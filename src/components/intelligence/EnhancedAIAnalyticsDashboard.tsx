
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, Cpu, Activity, RefreshCw, TrendingUp, AlertTriangle, Target } from "lucide-react";
import { useDemoMode } from '@/components/DemoModeProvider';

interface MLMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  processingTime: number;
  modelsActive: number;
}

interface DetectionResult {
  id: string;
  type: string;
  confidence: number;
  timestamp: string;
  description: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

const EnhancedAIAnalyticsDashboard: React.FC = () => {
  const { isDemoMode } = useDemoMode();
  const [mlMetrics, setMLMetrics] = useState<MLMetrics>({
    accuracy: 0,
    precision: 0,
    recall: 0,
    f1Score: 0,
    processingTime: 0,
    modelsActive: 0
  });
  const [recentDetections, setRecentDetections] = useState<DetectionResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (isDemoMode) {
      // Generate demo metrics
      setMLMetrics({
        accuracy: 0.94 + Math.random() * 0.05,
        precision: 0.92 + Math.random() * 0.06,
        recall: 0.89 + Math.random() * 0.08,
        f1Score: 0.91 + Math.random() * 0.06,
        processingTime: 150 + Math.random() * 50,
        modelsActive: 7 + Math.floor(Math.random() * 3)
      });

      setRecentDetections([
        {
          id: 'det-1',
          type: 'Anomalous Behavior',
          confidence: 0.96,
          timestamp: new Date(Date.now() - 30000).toISOString(),
          description: 'Vessel exhibiting unusual speed patterns',
          riskLevel: 'high'
        },
        {
          id: 'det-2',
          type: 'AIS Spoofing',
          confidence: 0.89,
          timestamp: new Date(Date.now() - 120000).toISOString(),
          description: 'Potential AIS data manipulation detected',
          riskLevel: 'critical'
        },
        {
          id: 'det-3',
          type: 'Route Deviation',
          confidence: 0.78,
          timestamp: new Date(Date.now() - 300000).toISOString(),
          description: 'Significant deviation from declared route',
          riskLevel: 'medium'
        }
      ]);
    } else {
      // In live mode, start with empty state
      setMLMetrics({
        accuracy: 0,
        precision: 0,
        recall: 0,
        f1Score: 0,
        processingTime: 0,
        modelsActive: 0
      });
      setRecentDetections([]);
    }
  }, [isDemoMode]);

  const handleRefresh = async () => {
    setIsProcessing(true);
    // Simulate processing time
    setTimeout(() => {
      if (isDemoMode) {
        setMLMetrics({
          accuracy: 0.94 + Math.random() * 0.05,
          precision: 0.92 + Math.random() * 0.06,
          recall: 0.89 + Math.random() * 0.08,
          f1Score: 0.91 + Math.random() * 0.06,
          processingTime: 150 + Math.random() * 50,
          modelsActive: 7 + Math.floor(Math.random() * 3)
        });
      }
      setIsProcessing(false);
    }, 2000);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-400 border-red-400';
      case 'high': return 'text-orange-400 border-orange-400';
      case 'medium': return 'text-yellow-400 border-yellow-400';
      case 'low': return 'text-green-400 border-green-400';
      default: return 'text-slate-400 border-slate-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Enhanced AI Analytics</h2>
          <p className="text-slate-400">Advanced pattern recognition with machine learning</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className={isDemoMode ? "text-yellow-400 border-yellow-400" : "text-green-400 border-green-400"}>
            <Brain className="h-3 w-3 mr-1" />
            {isDemoMode ? 'SIMULATION MODE' : 'ML ACTIVE'}
          </Badge>
          <Badge variant="outline" className="text-cyan-400 border-cyan-400">
            <Cpu className="h-3 w-3 mr-1" />
            REAL-TIME
          </Badge>
          <Button 
            onClick={handleRefresh}
            disabled={isProcessing}
            className={isDemoMode ? "bg-yellow-600 hover:bg-yellow-700" : "bg-cyan-600 hover:bg-cyan-700"}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isProcessing ? 'animate-spin' : ''}`} />
            {isProcessing ? 'Processing...' : 'Refresh Models'}
          </Button>
        </div>
      </div>

      {/* ML Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Accuracy</p>
                <p className="text-2xl font-bold text-white">{(mlMetrics.accuracy * 100).toFixed(1)}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Precision</p>
                <p className="text-2xl font-bold text-white">{(mlMetrics.precision * 100).toFixed(1)}%</p>
              </div>
              <Target className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Recall</p>
                <p className="text-2xl font-bold text-white">{(mlMetrics.recall * 100).toFixed(1)}%</p>
              </div>
              <Activity className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">F1-Score</p>
                <p className="text-2xl font-bold text-white">{(mlMetrics.f1Score * 100).toFixed(1)}%</p>
              </div>
              <Brain className="h-8 w-8 text-cyan-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Processing Time</p>
                <p className="text-2xl font-bold text-white">{mlMetrics.processingTime.toFixed(0)}ms</p>
              </div>
              <Cpu className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Models Active</p>
                <p className="text-2xl font-bold text-white">{mlMetrics.modelsActive}</p>
              </div>
              <Activity className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent AI Detections */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Recent AI Detections
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentDetections.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <Brain className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No recent detections</p>
              <p className="text-sm">{isDemoMode ? 'Simulation data will appear here' : 'AI analysis results will appear here'}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentDetections.map((detection) => (
                <div key={detection.id} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-white font-medium">{detection.type}</span>
                      <Badge variant="outline" className={getRiskColor(detection.riskLevel)}>
                        {detection.riskLevel.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-slate-400 text-sm">{detection.description}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {new Date(detection.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold">{(detection.confidence * 100).toFixed(1)}%</p>
                    <p className="text-xs text-slate-400">Confidence</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedAIAnalyticsDashboard;
