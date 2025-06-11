
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Activity, 
  Target, 
  Users, 
  Clock,
  Zap,
  TrendingUp,
  BarChart3,
  Shield
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

const OperationalInsights = () => {
  const operationalMetrics = [
    { label: "Mission Success Rate", value: "96.8%", change: "+2.3%" },
    { label: "Response Efficiency", value: "94.2%", change: "+1.8%" },
    { label: "Resource Utilization", value: "87.5%", change: "-0.5%" },
    { label: "Threat Prevention", value: "98.1%", change: "+3.1%" }
  ];

  const performanceData = [
    { time: "00:00", efficiency: 85, threats: 12, resources: 78 },
    { time: "04:00", efficiency: 92, threats: 8, resources: 82 },
    { time: "08:00", efficiency: 96, threats: 15, resources: 89 },
    { time: "12:00", efficiency: 94, threats: 23, resources: 91 },
    { time: "16:00", efficiency: 98, threats: 18, resources: 87 },
    { time: "20:00", efficiency: 91, threats: 14, resources: 85 }
  ];

  const departmentPerformance = [
    { name: "Intelligence Analysis", value: 35, color: "#06B6D4" },
    { name: "Threat Response", value: 28, color: "#EF4444" },
    { name: "Surveillance Ops", value: 22, color: "#8B5CF6" },
    { name: "Cyber Security", value: 15, color: "#10B981" }
  ];

  const missionTimeline = [
    { week: "W1", completed: 45, success: 43 },
    { week: "W2", completed: 52, success: 50 },
    { week: "W3", completed: 38, success: 37 },
    { week: "W4", completed: 61, success: 59 },
    { week: "W5", completed: 47, success: 46 },
    { week: "W6", completed: 55, success: 53 }
  ];

  const keyInsights = [
    {
      id: 1,
      title: "Peak Performance Window",
      insight: "Operational efficiency peaks between 12:00-16:00 with 98% success rate",
      impact: "high",
      recommendation: "Schedule critical operations during peak hours"
    },
    {
      id: 2,
      title: "Resource Optimization",
      insight: "Intelligence Analysis team showing 35% higher efficiency than baseline",
      impact: "medium",
      recommendation: "Apply analysis protocols to other departments"
    },
    {
      id: 3,
      title: "Threat Response Time",
      insight: "Average response time decreased by 23% over last quarter",
      impact: "high",
      recommendation: "Document and standardize new response procedures"
    }
  ];

  const activeOperations = [
    {
      code: "OP-NORTHERN-WATCH",
      status: "active",
      priority: "high",
      progress: 78,
      team: "Alpha Team",
      timeline: "72 hours remaining"
    },
    {
      code: "OP-DEEP-SCAN",
      status: "planning",
      priority: "medium",
      progress: 35,
      team: "Beta Team",
      timeline: "5 days to launch"
    },
    {
      code: "OP-SILENT-GUARDIAN",
      status: "monitoring",
      priority: "critical",
      progress: 92,
      team: "Gamma Team",
      timeline: "24 hours remaining"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {operationalMetrics.map((metric, index) => (
          <Card key={index} className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">{metric.label}</p>
                  <p className="text-2xl font-bold text-white">{metric.value}</p>
                </div>
                <Badge variant="outline" className={
                  metric.change.startsWith('+') ? "text-green-400 border-green-400" :
                  "text-red-400 border-red-400"
                }>
                  {metric.change}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Real-Time Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData}>
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
                  <Area type="monotone" dataKey="efficiency" stackId="1" stroke="#06B6D4" fill="#06B6D4" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="resources" stackId="1" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Department Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={departmentPerformance}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {departmentPerformance.map((entry, index) => (
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Mission Success Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={missionTimeline}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="week" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F9FAFB'
                    }}
                  />
                  <Line type="monotone" dataKey="completed" stroke="#06B6D4" strokeWidth={2} />
                  <Line type="monotone" dataKey="success" stroke="#10B981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Active Operations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeOperations.map((operation, index) => (
                <div key={index} className="p-3 bg-slate-900 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-white font-medium text-sm">{operation.code}</h4>
                    <Badge variant="outline" className={
                      operation.priority === "critical" ? "text-red-400 border-red-400" :
                      operation.priority === "high" ? "text-orange-400 border-orange-400" :
                      "text-yellow-400 border-yellow-400"
                    }>
                      {operation.priority.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-xs text-slate-400 mb-2">
                    <span>👥 {operation.team}</span>
                    <span>⏱️ {operation.timeline}</span>
                  </div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Progress</span>
                    <span className="text-white">{operation.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-cyan-400 h-2 rounded-full" 
                      style={{ width: `${operation.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Strategic Insights & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {keyInsights.map((insight) => (
              <div key={insight.id} className="p-4 bg-slate-900 rounded-lg border-l-4 border-cyan-400">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white font-medium">{insight.title}</h4>
                  <Badge variant="outline" className={
                    insight.impact === "high" ? "text-green-400 border-green-400" :
                    insight.impact === "medium" ? "text-yellow-400 border-yellow-400" :
                    "text-slate-400 border-slate-400"
                  }>
                    {insight.impact.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-sm text-slate-300 mb-3">{insight.insight}</p>
                <p className="text-xs text-blue-400 italic">💡 {insight.recommendation}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center space-x-4">
        <Button className="bg-cyan-600 hover:bg-cyan-700">
          <Shield className="h-4 w-4 mr-2" />
          Generate Full Report
        </Button>
        <Button variant="outline" className="border-slate-600 text-slate-300">
          <Clock className="h-4 w-4 mr-2" />
          Schedule Briefing
        </Button>
        <Button variant="outline" className="border-slate-600 text-slate-300">
          <Zap className="h-4 w-4 mr-2" />
          Export Analytics
        </Button>
      </div>
    </div>
  );
};

export default OperationalInsights;
