
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Activity, 
  Brain, 
  TrendingUp, 
  AlertTriangle,
  Zap,
  Eye,
  Settings,
  Play,
  Pause
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { enhancedRealTimeProcessor, StreamProcessingMetrics, RealTimeInsight } from '@/services/enhancedRealTimeProcessor';

const EnhancedRealTimeDashboard = () => {
  const [metrics, setMetrics] = useState<StreamProcessingMetrics>({
    throughputPerSecond: 0,
    avgLatencyMs: 0,
    errorRate: 0,
    queueDepth: 0,
    processedToday: 0,
    anomaliesDetected: 0,
    predictionsGenerated: 0
  });
  
  const [insights, setInsights] = useState<RealTimeInsight[]>([]);
  const [pipelines, setPipelines] = useState(enhancedRealTimeProcessor.getProcessingPipelines());
  const [isMonitoring, setIsMonitoring] = useState(true);

  useEffect(() => {
    // Subscribe to real-time metrics
    const unsubscribeMetrics = enhancedRealTimeProcessor.subscribeToMetrics(setMetrics);
    const unsubscribeInsights = enhancedRealTimeProcessor.subscribeToInsights(setInsights);

    return () => {
      unsubscribeMetrics();
      unsubscribeInsights();
    };
  }, []);

  const performanceTrend = [
    { time: '00:00', throughput: 25, latency: 150 },
    { time: '04:00', throughput: 18, latency: 180 },
    { time: '08:00', throughput: 45, latency: 120 },
    { time: '12:00', throughput: 52, latency: 110 },
    { time: '16:00', throughput: 38, latency: 140 },
    { time: '20:00', throughput: 42, latency: 130 },
    { time: '24:00', throughput: 35, latency: 145 }
  ];

  const togglePipeline = (pipelineId: string, enabled: boolean) => {
    enhancedRealTimeProcessor.updatePipelineSettings(pipelineId, enabled);
    setPipelines(enhancedRealTimeProcessor.getProcessingPipelines());
  };

  const runBatchAnalysis = async () => {
    await enhancedRealTimeProcessor.performBatchAnalysis();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Enhanced Real-Time Processing</h2>
          <p className="text-slate-400">Advanced ML-powered vessel monitoring and analytics</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant={isMonitoring ? "default" : "outline"}
            onClick={() => setIsMonitoring(!isMonitoring)}
          >
            {isMonitoring ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
            {isMonitoring ? 'Pause' : 'Resume'}
          </Button>
          <Button variant="outline" onClick={runBatchAnalysis}>
            <Brain className="h-4 w-4 mr-2" />
            Run Batch Analysis
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Zap className="h-5 w-5 text-yellow-400" />
              <Badge variant="outline" className="text-green-400 border-green-400">
                LIVE
              </Badge>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-slate-300">Throughput</h3>
              <p className="text-xl font-bold text-white">{metrics.throughputPerSecond.toFixed(1)}/s</p>
              <Progress value={(metrics.throughputPerSecond / 100) * 100} className="h-1" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Activity className="h-5 w-5 text-blue-400" />
              <span className="text-xs text-slate-400">{metrics.avgLatencyMs.toFixed(0)}ms</span>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-slate-300">Processing Latency</h3>
              <p className="text-xl font-bold text-white">{metrics.avgLatencyMs.toFixed(0)}ms</p>
              <Progress value={Math.max(0, 100 - (metrics.avgLatencyMs / 5))} className="h-1" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Brain className="h-5 w-5 text-purple-400" />
              <span className="text-xs text-slate-400">+{metrics.anomaliesDetected}</span>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-slate-300">ML Insights</h3>
              <p className="text-xl font-bold text-white">{metrics.anomaliesDetected + metrics.predictionsGenerated}</p>
              <Progress value={(metrics.anomaliesDetected + metrics.predictionsGenerated) / 10 * 100} className="h-1" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="h-5 w-5 text-green-400" />
              <Badge variant="outline" className={
                metrics.errorRate < 2 ? "text-green-400 border-green-400" : "text-yellow-400 border-yellow-400"
              }>
                {metrics.errorRate.toFixed(1)}%
              </Badge>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-slate-300">Error Rate</h3>
              <p className="text-xl font-bold text-white">{metrics.errorRate.toFixed(2)}%</p>
              <Progress value={Math.max(0, 100 - (metrics.errorRate * 10))} className="h-1" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="insights" className="space-y-4">
        <TabsList className="bg-slate-700">
          <TabsTrigger value="insights">Real-time Insights</TabsTrigger>
          <TabsTrigger value="performance">Performance Analytics</TabsTrigger>
          <TabsTrigger value="pipelines">Processing Pipelines</TabsTrigger>
          <TabsTrigger value="ml-models">ML Models</TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Eye className="h-5 w-5 mr-2" />
                  Live Insights Stream
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {insights.slice(0, 10).map((insight) => (
                    <div key={insight.id} className="p-3 bg-slate-900 rounded-lg border-l-4 border-cyan-400">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-white">{insight.title}</h4>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className={
                            insight.severity === "critical" ? "text-red-400 border-red-400" :
                            insight.severity === "high" ? "text-orange-400 border-orange-400" :
                            insight.severity === "medium" ? "text-yellow-400 border-yellow-400" :
                            "text-green-400 border-green-400"
                          }>
                            {insight.type.toUpperCase()}
                          </Badge>
                          <span className="text-xs text-slate-400">
                            {(insight.confidence * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-400 mb-1">{insight.description}</p>
                      <p className="text-xs text-slate-500">
                        {new Date(insight.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Insight Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { type: 'Anomalies', count: insights.filter(i => i.type === 'anomaly').length },
                      { type: 'Predictions', count: insights.filter(i => i.type === 'prediction').length },
                      { type: 'Patterns', count: insights.filter(i => i.type === 'pattern').length },
                      { type: 'Alerts', count: insights.filter(i => i.type === 'alert').length }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="type" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: '#1F2937',
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#F9FAFB'
                        }}
                      />
                      <Bar dataKey="count" fill="#06B6D4" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">24-Hour Performance Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceTrend}>
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
                    <Line type="monotone" dataKey="throughput" stroke="#10B981" strokeWidth={2} name="Throughput/s" />
                    <Line type="monotone" dataKey="latency" stroke="#F59E0B" strokeWidth={2} name="Latency (ms)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pipelines" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {pipelines.map((pipeline) => (
              <Card key={pipeline.id} className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white">{pipeline.name}</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => togglePipeline(pipeline.id, !pipeline.enabled)}
                    >
                      {pipeline.enabled ? 'Disable' : 'Enable'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">Status</span>
                      <Badge variant="outline" className={
                        pipeline.enabled ? "text-green-400 border-green-400" : "text-red-400 border-red-400"
                      }>
                        {pipeline.enabled ? 'ACTIVE' : 'DISABLED'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">Success Rate</span>
                      <span className="text-sm text-white">{(pipeline.successRate * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">Avg Processing Time</span>
                      <span className="text-sm text-white">{pipeline.processingTimeMs}ms</span>
                    </div>
                    <Progress value={pipeline.successRate * 100} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="ml-models" className="space-y-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Brain className="h-5 w-5 mr-2" />
                ML Model Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-slate-300">Anomaly Detection</h4>
                  <div className="text-2xl font-bold text-white">92.4%</div>
                  <Progress value={92.4} className="h-2" />
                  <p className="text-xs text-slate-400">Model accuracy</p>
                </div>
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-slate-300">Predictive Analysis</h4>
                  <div className="text-2xl font-bold text-white">87.1%</div>
                  <Progress value={87.1} className="h-2" />
                  <p className="text-xs text-slate-400">Prediction accuracy</p>
                </div>
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-slate-300">Pattern Recognition</h4>
                  <div className="text-2xl font-bold text-white">94.8%</div>
                  <Progress value={94.8} className="h-2" />
                  <p className="text-xs text-slate-400">Pattern matching accuracy</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedRealTimeDashboard;
