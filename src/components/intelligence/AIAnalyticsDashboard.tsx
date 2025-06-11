
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  Cpu, 
  Zap, 
  TrendingUp,
  Eye,
  Target,
  Activity,
  Database
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

const AIAnalyticsDashboard = () => {
  const modelPerformance = [
    { model: "Threat Detection", accuracy: 96.8, speed: 0.2, status: "active" },
    { model: "Pattern Recognition", accuracy: 94.2, speed: 0.4, status: "active" },
    { model: "Risk Assessment", accuracy: 92.1, speed: 0.3, status: "active" },
    { model: "Anomaly Detection", accuracy: 89.7, speed: 0.5, status: "training" },
    { model: "Behavioral Analysis", accuracy: 91.4, speed: 0.6, status: "active" }
  ];

  const processingData = [
    { time: "00:00", throughput: 1240, latency: 0.3 },
    { time: "04:00", throughput: 890, latency: 0.2 },
    { time: "08:00", throughput: 2100, latency: 0.4 },
    { time: "12:00", throughput: 2850, latency: 0.5 },
    { time: "16:00", throughput: 3200, latency: 0.6 },
    { time: "20:00", throughput: 2400, latency: 0.4 }
  ];

  const insightCategories = [
    { name: "Security Threats", value: 35, color: "#EF4444" },
    { name: "Operational Risks", value: 25, color: "#F59E0B" },
    { name: "Network Anomalies", value: 20, color: "#8B5CF6" },
    { name: "Behavioral Patterns", value: 15, color: "#10B981" },
    { name: "Environmental", value: 5, color: "#6B7280" }
  ];

  const aiInsights = [
    {
      id: 1,
      type: "Critical Pattern",
      confidence: 94,
      description: "Unusual vessel clustering detected in high-risk maritime corridor",
      impact: "high",
      recommendation: "Increase surveillance in sector 7-A"
    },
    {
      id: 2,
      type: "Behavioral Anomaly",
      confidence: 87,
      description: "Communication patterns suggest coordinated activity among flagged entities",
      impact: "medium",
      recommendation: "Cross-reference with known threat indicators"
    },
    {
      id: 3,
      type: "Risk Prediction",
      confidence: 92,
      description: "Weather patterns indicate 78% probability of route disruption",
      impact: "medium",
      recommendation: "Alert vessel operators of potential delays"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Cpu className="h-8 w-8 text-blue-400" />
              <div>
                <p className="text-sm text-slate-400">Active Models</p>
                <p className="text-2xl font-bold text-white">12</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Zap className="h-8 w-8 text-yellow-400" />
              <div>
                <p className="text-sm text-slate-400">Insights Generated</p>
                <p className="text-2xl font-bold text-white">2,847</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Eye className="h-8 w-8 text-green-400" />
              <div>
                <p className="text-sm text-slate-400">Avg Accuracy</p>
                <p className="text-2xl font-bold text-white">94.7%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Activity className="h-8 w-8 text-purple-400" />
              <div>
                <p className="text-sm text-slate-400">Processing Speed</p>
                <p className="text-2xl font-bold text-white">0.34s</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Brain className="h-5 w-5 mr-2" />
              AI Model Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {modelPerformance.map((model, index) => (
                <div key={index} className="p-3 bg-slate-900 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-white">{model.model}</h4>
                    <Badge variant="outline" className={
                      model.status === "active" ? "text-green-400 border-green-400" :
                      "text-yellow-400 border-yellow-400"
                    }>
                      {model.status.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-400">Accuracy</span>
                        <span className="text-white">{model.accuracy}%</span>
                      </div>
                      <Progress value={model.accuracy} className="h-2" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">Speed</span>
                      <span className="text-xs text-cyan-400">{model.speed}s</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Processing Throughput
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={processingData}>
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
                  <Line type="monotone" dataKey="throughput" stroke="#06B6D4" strokeWidth={2} />
                  <Line type="monotone" dataKey="latency" stroke="#EF4444" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Database className="h-5 w-5 mr-2" />
              Insight Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={insightCategories}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {insightCategories.map((entry, index) => (
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
              <Target className="h-5 w-5 mr-2" />
              AI-Generated Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {aiInsights.map((insight) => (
                <div key={insight.id} className="p-3 bg-slate-900 rounded-lg border-l-4 border-cyan-400">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-white">{insight.type}</h4>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className={
                        insight.impact === "high" ? "text-red-400 border-red-400" :
                        insight.impact === "medium" ? "text-yellow-400 border-yellow-400" :
                        "text-green-400 border-green-400"
                      }>
                        {insight.impact.toUpperCase()}
                      </Badge>
                      <span className="text-xs text-cyan-400">{insight.confidence}%</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 mb-2">{insight.description}</p>
                  <p className="text-xs text-blue-400 italic">Recommendation: {insight.recommendation}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AIAnalyticsDashboard;
