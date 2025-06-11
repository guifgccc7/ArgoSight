
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  AlertTriangle, 
  Bell, 
  Clock, 
  Filter,
  Search,
  Shield,
  Zap,
  Eye,
  CheckCircle,
  XCircle
} from "lucide-react";

const RealTimeAlertsCenter = () => {
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const alertMetrics = [
    { label: "Active Alerts", value: 23, color: "text-red-400" },
    { label: "Resolved Today", value: 156, color: "text-green-400" },
    { label: "Avg Response Time", value: "2.4min", color: "text-cyan-400" },
    { label: "Success Rate", value: "94.7%", color: "text-blue-400" }
  ];

  const activeAlerts = [
    {
      id: "ALT-001",
      severity: "critical",
      type: "Security Breach",
      location: "Port of Rotterdam - Terminal 3",
      description: "Unauthorized access detected in secure cargo area",
      timestamp: "2 minutes ago",
      status: "investigating",
      assignee: "Agent Martinez"
    },
    {
      id: "ALT-002", 
      severity: "high",
      type: "Vessel Anomaly",
      location: "North Sea - Sector 7A",
      description: "MV Atlantic Star deviating from approved route without notification",
      timestamp: "8 minutes ago",
      status: "escalated",
      assignee: "Agent Chen"
    },
    {
      id: "ALT-003",
      severity: "medium",
      type: "Communication Loss",
      location: "English Channel",
      description: "6-hour communication silence from fishing vessel FL-2847",
      timestamp: "15 minutes ago", 
      status: "monitoring",
      assignee: "Agent Johnson"
    },
    {
      id: "ALT-004",
      severity: "high",
      type: "Suspicious Activity",
      location: "Mediterranean - Grid 34N",
      description: "Multiple vessels converging at coordinates without manifest updates",
      timestamp: "23 minutes ago",
      status: "investigating",
      assignee: "Agent Rodriguez"
    },
    {
      id: "ALT-005",
      severity: "low",
      type: "Equipment Malfunction", 
      location: "Arctic Station Alpha",
      description: "Radar system intermittent signal in severe weather conditions",
      timestamp: "1 hour ago",
      status: "acknowledged",
      assignee: "Tech Team"
    }
  ];

  const alertCategories = [
    { name: "Security Threats", count: 8, trend: "+2" },
    { name: "Vessel Anomalies", count: 6, trend: "-1" },
    { name: "Communication Issues", count: 4, trend: "0" },
    { name: "Equipment Failures", count: 3, trend: "+1" },
    { name: "Environmental", count: 2, trend: "0" }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "text-red-400 border-red-400 bg-red-900/20";
      case "high": return "text-orange-400 border-orange-400 bg-orange-900/20";
      case "medium": return "text-yellow-400 border-yellow-400 bg-yellow-900/20";
      case "low": return "text-green-400 border-green-400 bg-green-900/20";
      default: return "text-slate-400 border-slate-400";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "investigating": return "text-blue-400 border-blue-400";
      case "escalated": return "text-red-400 border-red-400";
      case "monitoring": return "text-yellow-400 border-yellow-400";
      case "acknowledged": return "text-green-400 border-green-400";
      default: return "text-slate-400 border-slate-400";
    }
  };

  const filteredAlerts = activeAlerts.filter(alert => {
    const matchesSeverity = filterSeverity === "all" || alert.severity === filterSeverity;
    const matchesSearch = alert.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSeverity && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {alertMetrics.map((metric, index) => (
          <Card key={index} className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Bell className="h-8 w-8 text-cyan-400" />
                <div>
                  <p className="text-sm text-slate-400">{metric.label}</p>
                  <p className={`text-2xl font-bold ${metric.color}`}>{metric.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Active Alert Stream
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <Input
                      placeholder="Search alerts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-slate-900 border-slate-600 text-white w-48"
                    />
                  </div>
                  <select 
                    value={filterSeverity} 
                    onChange={(e) => setFilterSeverity(e.target.value)}
                    className="bg-slate-900 border border-slate-600 rounded-md px-3 py-2 text-white"
                  >
                    <option value="all">All Severities</option>
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredAlerts.map((alert) => (
                  <div key={alert.id} className="p-4 bg-slate-900 rounded-lg border border-slate-700">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <Badge variant="outline" className={getSeverityColor(alert.severity)}>
                            {alert.severity.toUpperCase()}
                          </Badge>
                          <h4 className="text-white font-medium">{alert.type}</h4>
                          <span className="text-xs text-slate-400">#{alert.id}</span>
                        </div>
                        <p className="text-sm text-slate-300 mb-2">{alert.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-slate-400">
                          <span>📍 {alert.location}</span>
                          <span>🕒 {alert.timestamp}</span>
                          <span>👤 {alert.assignee}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <Badge variant="outline" className={getStatusColor(alert.status)}>
                          {alert.status.toUpperCase()}
                        </Badge>
                        <div className="flex space-x-1">
                          <Button size="sm" variant="outline" className="h-7 w-7 p-0">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" className="h-7 w-7 p-0">
                            <CheckCircle className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" className="h-7 w-7 p-0">
                            <XCircle className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Alert Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alertCategories.map((category, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-slate-900 rounded">
                    <span className="text-white text-sm">{category.name}</span>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-cyan-400 border-cyan-400">
                        {category.count}
                      </Badge>
                      <Badge variant="outline" className={
                        category.trend.startsWith('+') ? "text-red-400 border-red-400" :
                        category.trend.startsWith('-') ? "text-green-400 border-green-400" :
                        "text-slate-400 border-slate-400"
                      }>
                        {category.trend}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Zap className="h-5 w-5 mr-2" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full bg-red-600 hover:bg-red-700 justify-start">
                  <Shield className="h-4 w-4 mr-2" />
                  Escalate Critical Alerts
                </Button>
                <Button className="w-full bg-yellow-600 hover:bg-yellow-700 justify-start">
                  <Clock className="h-4 w-4 mr-2" />
                  Schedule Maintenance
                </Button>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 justify-start">
                  <Bell className="h-4 w-4 mr-2" />
                  Configure Notifications
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RealTimeAlertsCenter;
