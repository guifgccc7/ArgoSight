
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Brain, 
  Activity, 
  TrendingUp, 
  AlertTriangle,
  Target,
  Zap,
  Shield,
  Eye
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { patternRecognitionService, BehaviorPattern, AnalyticsMetrics } from "@/services/patternRecognitionService";

const AIAnalyticsDashboard = () => {
  const [patterns, setPatterns] = useState<BehaviorPattern[]>([]);
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null);

  useEffect(() => {
    const unsubscribe = patternRecognitionService.subscribe(setPatterns);
    setMetrics(patternRecognitionService.getAnalyticsMetrics());
    
    // Start pattern recognition if not already running
    patternRecognitionService.startPatternRecognition();

    return unsubscribe;
  }, []);

  const patternDistribution = [
    { name: 'AIS Manipulation', value: patterns.filter(p => p.type === 'ais_manipulation').length, color: '#EF4444' },
    { name: 'Route Deviation', value: patterns.filter(p => p.type === 'route_deviation').length, color: '#F59E0B' },
    { name: 'Speed Anomaly', value: patterns.filter(p => p.type === 'speed_anomaly').length, color: '#8B5CF6' },
    { name: 'Loitering', value: patterns.filter(p => p.type === 'loitering').length, color: '#10B981' },
    { name: 'Rendezvous', value: patterns.filter(p => p.type === 'rendezvous').length, color: '#06B6D4' },
  ];

  const riskTrends = [
    { time: '00:00', risk: 23 },
    { time: '04:00', risk: 18 },
    { time: '08:00', risk: 31 },
    { time: '12:00', risk: 42 },
    { time: '16:00', risk: 35 },
    { time: '20:00', risk: 28 },
  ];

  const confidenceData = [
    { range: '90-100%', count: patterns.filter(p => p.confidence >= 0.9).length },
    { range: '80-89%', count: patterns.filter(p => p.confidence >= 0.8 && p.confidence < 0.9).length },
    { range: '70-79%', count: patterns.filter(p => p.confidence >= 0.7 && p.confidence < 0.8).length },
    { range: '60-69%', count: patterns.filter(p => p.confidence >= 0.6 && p.confidence < 0.7).length },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">AI Analytics Dashboard</h2>
          <p className="text-slate-400">Advanced pattern recognition and threat analysis</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-green-400 border-green-400">
            <Brain className="h-3 w-3 mr-1" />
            AI ACTIVE
          </Badge>
          <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700">
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Activity className="h-8 w-8 text-cyan-400" />
              <div>
                <p className="text-sm text-slate-400">Patterns Detected</p>
                <p className="text-2xl font-bold text-white">{metrics?.totalPatterns || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-8 w-8 text-red-400" />
              <div>
                <p className="text-sm text-slate-400">Critical Threats</p>
                <p className="text-2xl font-bold text-white">{metrics?.criticalThreats || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Target className="h-8 w-8 text-green-400" />
              <div>
                <p className="text-sm text-slate-400">Detection Accuracy</p>
                <p className="text-2xl font-bold text-white">{metrics?.detectionAccuracy || 0}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Zap className="h-8 w-8 text-yellow-400" />
              <div>
                <p className="text-sm text-slate-400">Response Time</p>
                <p className="text-2xl font-bold text-white">{metrics?.responseTime || 0}s</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pattern Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Brain className="h-5 w-5 mr-2" />
              Pattern Type Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={patternDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => value > 0 ? `${name}: ${value}` : ''}
                  >
                    {patternDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F9FAFB'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Risk Level Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={riskTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="time" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F9FAFB'
                    }}
                  />
                  <Line type="monotone" dataKey="risk" stroke="#06B6D4" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detection Confidence & Recent Patterns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Detection Confidence Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={confidenceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="range" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F9FAFB'
                    }}
                  />
                  <Bar dataKey="count" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Recent Pattern Detections
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {patterns.slice(0, 6).map((pattern) => (
                <div key={pattern.id} className="flex items-start space-x-3 p-3 bg-slate-900 rounded-lg">
                  <AlertTriangle className={`h-4 w-4 mt-0.5 ${
                    pattern.severity === 'critical' ? 'text-red-400' :
                    pattern.severity === 'high' ? 'text-orange-400' :
                    pattern.severity === 'medium' ? 'text-yellow-400' :
                    'text-green-400'
                  }`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-medium text-white">{pattern.type.replace('_', ' ')}</h4>
                      <Badge variant="outline" className="text-cyan-400 border-cyan-400">
                        {Math.round(pattern.confidence * 100)}%
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-400 mb-1">{pattern.description}</p>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-slate-500">Risk: {pattern.riskScore}</span>
                      <span className="text-xs text-slate-500">Vessel: {pattern.vesselId.slice(-6)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Performance Metrics */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Brain className="h-5 w-5 mr-2" />
            AI Performance Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Detection Accuracy</span>
                <span className="text-green-400 font-bold">{metrics?.detectionAccuracy || 0}%</span>
              </div>
              <Progress value={metrics?.detectionAccuracy || 0} className="h-2" />
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">False Positive Rate</span>
                <span className="text-yellow-400 font-bold">{metrics?.falsePositiveRate || 0}%</span>
              </div>
              <Progress value={metrics?.falsePositiveRate || 0} className="h-2" />
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Average Risk Score</span>
                <span className="text-red-400 font-bold">{Math.round(metrics?.averageRiskScore || 0)}</span>
              </div>
              <Progress value={metrics?.averageRiskScore || 0} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIAnalyticsDashboard;
