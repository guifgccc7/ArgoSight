
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
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
  XCircle,
  User
} from "lucide-react";
import { alertsService, Alert, AlertsMetrics } from "@/services/alertsService";

const RealTimeAlertsCenter = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [metrics, setMetrics] = useState<AlertsMetrics>({
    total: 0,
    new: 0,
    critical: 0,
    resolved: 0,
    avgResponseTime: '0min',
    successRate: '0%'
  });
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    // Subscribe to alerts
    const unsubscribeAlerts = alertsService.subscribe((newAlerts) => {
      setAlerts(newAlerts);
    });

    // Subscribe to metrics
    const unsubscribeMetrics = alertsService.subscribeToMetrics((newMetrics) => {
      setMetrics(newMetrics);
    });

    // Start alert simulation
    alertsService.startAlertSimulation();

    return () => {
      unsubscribeAlerts();
      unsubscribeMetrics();
    };
  }, []);

  const filteredAlerts = alertsService.getAlerts({
    severity: filterSeverity === "all" ? undefined : filterSeverity as Alert['severity'],
    status: filterStatus === "all" ? undefined : filterStatus as Alert['status'],
    search: searchTerm
  });

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
      case "new": return "text-cyan-400 border-cyan-400";
      case "investigating": return "text-blue-400 border-blue-400";
      case "escalated": return "text-red-400 border-red-400";
      case "acknowledged": return "text-yellow-400 border-yellow-400";
      case "resolved": return "text-green-400 border-green-400";
      default: return "text-slate-400 border-slate-400";
    }
  };

  const handleStatusUpdate = (alertId: string, newStatus: Alert['status']) => {
    alertsService.updateAlertStatus(alertId, newStatus, 'Current User');
    toast({
      title: "Alert Updated",
      description: `Alert status changed to ${newStatus}`,
    });
  };

  const getTimeAgo = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Bell className="h-8 w-8 text-cyan-400" />
              <div>
                <p className="text-sm text-slate-400">Active Alerts</p>
                <p className="text-2xl font-bold text-white">{metrics.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-8 w-8 text-red-400" />
              <div>
                <p className="text-sm text-slate-400">Critical</p>
                <p className="text-2xl font-bold text-red-400">{metrics.critical}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Clock className="h-8 w-8 text-yellow-400" />
              <div>
                <p className="text-sm text-slate-400">Avg Response</p>
                <p className="text-2xl font-bold text-yellow-400">{metrics.avgResponseTime}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-8 w-8 text-green-400" />
              <div>
                <p className="text-sm text-slate-400">Success Rate</p>
                <p className="text-2xl font-bold text-green-400">{metrics.successRate}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Stream */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Real-Time Alert Stream
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
              <select 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-slate-900 border border-slate-600 rounded-md px-3 py-2 text-white"
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="investigating">Investigating</option>
                <option value="escalated">Escalated</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            <div className="space-y-3">
              {filteredAlerts.map((alert) => (
                <div key={alert.id} className="p-4 bg-slate-900 rounded-lg border border-slate-700">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Badge variant="outline" className={getSeverityColor(alert.severity)}>
                          {alert.severity.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className={getStatusColor(alert.status)}>
                          {alert.status.toUpperCase()}
                        </Badge>
                        <h4 className="text-white font-medium">{alert.title}</h4>
                        <span className="text-xs text-slate-400">#{alert.id}</span>
                      </div>
                      <p className="text-sm text-slate-300 mb-2">{alert.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-slate-400">
                        {alert.location && (
                          <span>📍 {alert.location.name || `${alert.location.lat.toFixed(2)}, ${alert.location.lng.toFixed(2)}`}</span>
                        )}
                        <span>🕒 {getTimeAgo(alert.timestamp)}</span>
                        {alert.assignee && <span>👤 {alert.assignee}</span>}
                        {alert.metadata?.confidence && (
                          <span>🎯 {Math.round(alert.metadata.confidence * 100)}% confidence</span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <div className="flex space-x-1">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-7 w-7 p-0"
                          onClick={() => handleStatusUpdate(alert.id, 'acknowledged')}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-7 w-7 p-0"
                          onClick={() => handleStatusUpdate(alert.id, 'investigating')}
                        >
                          <User className="h-3 w-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-7 w-7 p-0"
                          onClick={() => handleStatusUpdate(alert.id, 'resolved')}
                        >
                          <CheckCircle className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealTimeAlertsCenter;
