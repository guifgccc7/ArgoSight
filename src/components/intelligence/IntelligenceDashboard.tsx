import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  AlertTriangle, 
  Shield, 
  Activity, 
  TrendingUp,
  Globe,
  Ship,
  Eye,
  Database
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import RouteOptimizationDashboard from './RouteOptimizationDashboard';

const IntelligenceDashboard = () => {
  const threatMetrics = [
    { category: "Vessel Threats", current: 15, historical: 12, trend: "up" },
    { category: "Port Security", current: 8, historical: 10, trend: "down" },
    { category: "Cyber Incidents", current: 23, historical: 18, trend: "up" },
    { category: "Environmental", current: 6, historical: 8, trend: "down" }
  ];

  const regionData = [
    { region: "North Sea", threats: 12, incidents: 5 },
    { region: "Mediterranean", threats: 18, incidents: 8 },
    { region: "Arctic", threats: 6, incidents: 2 },
    { region: "Atlantic", threats: 15, incidents: 7 },
    { region: "Pacific", threats: 9, incidents: 3 }
  ];

  const threatDistribution = [
    { name: "Vessel Security", value: 35, color: "#EF4444" },
    { name: "Port Operations", value: 25, color: "#F59E0B" },
    { name: "Cyber Security", value: 20, color: "#8B5CF6" },
    { name: "Environmental", value: 15, color: "#10B981" },
    { name: "Other", value: 5, color: "#6B7280" }
  ];

  const weeklyTrends = [
    { week: "W1", alerts: 45, incidents: 12 },
    { week: "W2", alerts: 52, incidents: 15 },
    { week: "W3", alerts: 38, incidents: 9 },
    { week: "W4", alerts: 61, incidents: 18 },
    { week: "W5", alerts: 47, incidents: 11 },
    { week: "W6", alerts: 55, incidents: 16 },
    { week: "W7", alerts: 43, incidents: 8 }
  ];

  const activeAlerts = [
    {
      id: 1,
      type: "Vessel Intrusion",
      severity: "critical",
      location: "North Sea Platform Alpha",
      time: "5 min ago"
    },
    {
      id: 2,
      type: "Suspicious Activity",
      severity: "high",
      location: "Port of Rotterdam",
      time: "23 min ago"
    },
    {
      id: 3,
      type: "Communication Anomaly",
      severity: "medium",
      location: "English Channel",
      time: "1 hour ago"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Add Route Optimization section at the top */}
      <RouteOptimizationDashboard />
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {threatMetrics.map((metric) => (
          <Card key={metric.category} className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Shield className="h-5 w-5 text-cyan-400" />
                <div className="flex items-center space-x-1">
                  {metric.trend === "up" ? (
                    <TrendingUp className="h-3 w-3 text-red-400" />
                  ) : (
                    <TrendingUp className="h-3 w-3 text-green-400 rotate-180" />
                  )}
                  <span className="text-xs text-slate-400">
                    {metric.trend === "up" ? "+" : "-"}{Math.abs(metric.current - metric.historical)}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-slate-300">{metric.category}</h3>
                <p className="text-xl font-bold text-white">{metric.current}</p>
                <Progress value={(metric.current / 30) * 100} className="h-1" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Globe className="h-5 w-5 mr-2" />
              Regional Threat Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={regionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="region" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F9FAFB'
                    }}
                  />
                  <Bar dataKey="threats" fill="#EF4444" name="Threats" />
                  <Bar dataKey="incidents" fill="#F59E0B" name="Incidents" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Threat Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={threatDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {threatDistribution.map((entry, index) => (
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
              <TrendingUp className="h-5 w-5 mr-2" />
              Weekly Intelligence Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyTrends}>
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
                  <Line type="monotone" dataKey="alerts" stroke="#06B6D4" strokeWidth={2} />
                  <Line type="monotone" dataKey="incidents" stroke="#EF4444" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Active Intelligence Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeAlerts.map((alert) => (
                <div key={alert.id} className="flex items-start space-x-3 p-3 bg-slate-900 rounded-lg">
                  <AlertTriangle className={`h-5 w-5 mt-0.5 ${
                    alert.severity === "critical" ? "text-red-400" :
                    alert.severity === "high" ? "text-orange-400" :
                    "text-yellow-400"
                  }`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-medium text-white">{alert.type}</h4>
                      <Badge variant="outline" className={
                        alert.severity === "critical" ? "text-red-400 border-red-400" :
                        alert.severity === "high" ? "text-orange-400 border-orange-400" :
                        "text-yellow-400 border-yellow-400"
                      }>
                        {alert.severity.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-400 mb-1">{alert.location}</p>
                    <p className="text-xs text-slate-500">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IntelligenceDashboard;
