
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Thermometer, Wind, Waves, Eye, Clock } from "lucide-react";

const RiskAssessment = () => {
  const weatherConditions = [
    { zone: "Central Mediterranean", temp: 18, windSpeed: 15, waveHeight: 2.1, visibility: 8, risk: "low" },
    { zone: "Eastern Routes", temp: 22, windSpeed: 25, waveHeight: 3.2, visibility: 6, risk: "medium" },
    { zone: "Western Corridor", temp: 16, windSpeed: 35, waveHeight: 4.5, visibility: 4, risk: "high" },
    { zone: "Aegean Sea", temp: 19, windSpeed: 12, waveHeight: 1.8, visibility: 9, risk: "low" },
  ];

  const safetyAlerts = [
    {
      id: "SA-001",
      type: "Weather Warning",
      severity: "high",
      zone: "Western Corridor",
      description: "Severe weather expected with winds up to 40 knots",
      validUntil: "18:00 UTC",
      issued: "2 hours ago"
    },
    {
      id: "SA-002", 
      type: "Search Area",
      severity: "critical",
      zone: "Central Mediterranean",
      description: "Active search and rescue operation in progress",
      validUntil: "Until further notice",
      issued: "45 minutes ago"
    },
    {
      id: "SA-003",
      type: "Navigation Warning",
      severity: "medium", 
      zone: "Eastern Routes",
      description: "Reduced visibility due to fog conditions",
      validUntil: "12:00 UTC tomorrow",
      issued: "1 hour ago"
    }
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-400 border-green-400';
      case 'medium': return 'text-yellow-400 border-yellow-400';
      case 'high': return 'text-red-400 border-red-400';
      case 'critical': return 'text-red-600 border-red-600';
      default: return 'text-slate-400 border-slate-400';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-green-400 border-green-400';
      case 'medium': return 'text-yellow-400 border-yellow-400';
      case 'high': return 'text-orange-400 border-orange-400';
      case 'critical': return 'text-red-400 border-red-400';
      default: return 'text-slate-400 border-slate-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Weather Conditions by Zone */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Thermometer className="h-5 w-5 mr-2" />
            Weather Conditions by Migration Zone
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {weatherConditions.map((condition, index) => (
              <div key={index} className="p-4 bg-slate-900 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-white">{condition.zone}</h3>
                  <Badge variant="outline" className={getRiskColor(condition.risk)}>
                    {condition.risk.toUpperCase()} RISK
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <Thermometer className="h-4 w-4 text-orange-400" />
                    <span className="text-slate-300">Temp:</span>
                    <span className="text-white">{condition.temp}°C</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Wind className="h-4 w-4 text-cyan-400" />
                    <span className="text-slate-300">Wind:</span>
                    <span className="text-white">{condition.windSpeed} kts</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Waves className="h-4 w-4 text-blue-400" />
                    <span className="text-slate-300">Waves:</span>
                    <span className="text-white">{condition.waveHeight}m</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Eye className="h-4 w-4 text-purple-400" />
                    <span className="text-slate-300">Visibility:</span>
                    <span className="text-white">{condition.visibility}km</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Safety Alerts */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Active Safety Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {safetyAlerts.map((alert) => (
              <div key={alert.id} className="p-4 bg-slate-900 rounded-lg border-l-4 border-red-500">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                    <span className="font-medium text-white">{alert.type}</span>
                  </div>
                  <Badge variant="outline" className={getSeverityColor(alert.severity)}>
                    {alert.severity.toUpperCase()}
                  </Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-300">Zone:</span>
                    <span className="text-white">{alert.zone}</span>
                  </div>
                  <div className="text-white">
                    <p>{alert.description}</p>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Valid Until:</span>
                    <span className="text-cyan-400">{alert.validUntil}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Issued:</span>
                    <span className="text-slate-400">{alert.issued}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Risk Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="h-6 w-6 text-red-400" />
            </div>
            <p className="text-sm text-slate-400 mb-1">High Risk Zones</p>
            <p className="text-2xl font-bold text-red-400">1</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Clock className="h-6 w-6 text-yellow-400" />
            </div>
            <p className="text-sm text-slate-400 mb-1">Active Alerts</p>
            <p className="text-2xl font-bold text-yellow-400">{safetyAlerts.length}</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Eye className="h-6 w-6 text-green-400" />
            </div>
            <p className="text-sm text-slate-400 mb-1">Monitored Zones</p>
            <p className="text-2xl font-bold text-green-400">{weatherConditions.length}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RiskAssessment;
