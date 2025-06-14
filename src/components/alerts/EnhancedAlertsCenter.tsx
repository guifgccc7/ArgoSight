
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Bell, Filter, Eye, EyeOff, CheckCircle } from "lucide-react";
import { useDemoMode } from '@/components/DemoModeProvider';

interface Alert {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  timestamp: string;
  isRead: boolean;
  source: string;
}

const EnhancedAlertsCenter: React.FC = () => {
  const { isDemoMode } = useDemoMode();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [showRead, setShowRead] = useState(true);

  useEffect(() => {
    if (isDemoMode) {
      setAlerts([
        {
          id: 'alert-1',
          title: 'Suspicious Vessel Movement',
          description: 'Vessel IMO-9234567 exhibiting irregular speed patterns in restricted zone',
          severity: 'high',
          category: 'Navigation',
          timestamp: new Date(Date.now() - 300000).toISOString(),
          isRead: false,
          source: 'AI Pattern Recognition'
        },
        {
          id: 'alert-2',
          title: 'AIS Signal Anomaly',
          description: 'Multiple vessels reporting identical position data',
          severity: 'critical',
          category: 'Communications',
          timestamp: new Date(Date.now() - 600000).toISOString(),
          isRead: false,
          source: 'Signal Analysis'
        },
        {
          id: 'alert-3',
          title: 'Weather Warning',
          description: 'Severe storm approaching shipping lane Alpha-7',
          severity: 'medium',
          category: 'Weather',
          timestamp: new Date(Date.now() - 900000).toISOString(),
          isRead: true,
          source: 'Weather Service'
        },
        {
          id: 'alert-4',
          title: 'Geofence Violation',
          description: 'Commercial vessel entered restricted military zone',
          severity: 'critical',
          category: 'Security',
          timestamp: new Date(Date.now() - 1200000).toISOString(),
          isRead: false,
          source: 'Geofencing System'
        }
      ]);
    } else {
      setAlerts([]);
    }
  }, [isDemoMode]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400 border-red-400 bg-red-400/10';
      case 'high': return 'text-orange-400 border-orange-400 bg-orange-400/10';
      case 'medium': return 'text-yellow-400 border-yellow-400 bg-yellow-400/10';
      case 'low': return 'text-green-400 border-green-400 bg-green-400/10';
      default: return 'text-slate-400 border-slate-400 bg-slate-400/10';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const markAsRead = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, isRead: true } : alert
    ));
  };

  const filteredAlerts = alerts.filter(alert => {
    if (!showRead && alert.isRead) return false;
    if (filter === 'all') return true;
    return alert.severity === filter;
  });

  const unreadCount = alerts.filter(alert => !alert.isRead).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Enhanced Alerts Center</h2>
          <p className="text-slate-400">Real-time monitoring and alert management</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className={isDemoMode ? "text-yellow-400 border-yellow-400" : "text-green-400 border-green-400"}>
            <Bell className="h-3 w-3 mr-1" />
            {isDemoMode ? 'SIMULATION MODE' : 'LIVE MONITORING'}
          </Badge>
          {unreadCount > 0 && (
            <Badge className="bg-red-600">
              {unreadCount} Unread
            </Badge>
          )}
        </div>
      </div>

      {/* Filter Controls */}
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-slate-400" />
              <span className="text-sm text-slate-400">Filter by severity:</span>
            </div>
            <div className="flex space-x-2">
              {['all', 'critical', 'high', 'medium', 'low'].map((severity) => (
                <Button
                  key={severity}
                  variant={filter === severity ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter(severity)}
                  className={filter === severity ? 'bg-cyan-600' : ''}
                >
                  {severity === 'all' ? 'All' : severity.charAt(0).toUpperCase() + severity.slice(1)}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowRead(!showRead)}
              className="ml-auto"
            >
              {showRead ? <Eye className="h-4 w-4 mr-1" /> : <EyeOff className="h-4 w-4 mr-1" />}
              {showRead ? 'Hide Read' : 'Show Read'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-8">
              <div className="text-center text-slate-400">
                <Bell className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">No alerts to display</p>
                <p className="text-sm">{isDemoMode ? 'Simulation alerts will appear here' : 'System monitoring for new alerts'}</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredAlerts.map((alert) => (
            <Card key={alert.id} className={`bg-slate-800 border-slate-700 ${!alert.isRead ? 'ring-1 ring-cyan-500/50' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge className={getSeverityColor(alert.severity)}>
                        {getSeverityIcon(alert.severity)}
                        <span className="ml-1">{alert.severity.toUpperCase()}</span>
                      </Badge>
                      <Badge variant="outline" className="text-slate-400 border-slate-600">
                        {alert.category}
                      </Badge>
                      {!alert.isRead && (
                        <Badge className="bg-cyan-600">
                          NEW
                        </Badge>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-1">{alert.title}</h3>
                    <p className="text-slate-400 mb-2">{alert.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-slate-500">
                      <span>Source: {alert.source}</span>
                      <span>{new Date(alert.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    {!alert.isRead && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => markAsRead(alert.id)}
                        className="border-slate-600 hover:bg-slate-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Mark Read
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default EnhancedAlertsCenter;
