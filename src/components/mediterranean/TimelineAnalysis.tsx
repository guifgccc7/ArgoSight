
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, TrendingUp, Users, Clock } from "lucide-react";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const TimelineAnalysis = () => {
  const [timeRange, setTimeRange] = useState('6months');

  const migrationTrends = [
    { month: 'Jul 2023', crossings: 2840, rescued: 1240, fatalities: 89 },
    { month: 'Aug 2023', crossings: 3560, rescued: 1890, fatalities: 156 },
    { month: 'Sep 2023', crossings: 4230, rescued: 2340, fatalities: 203 },
    { month: 'Oct 2023', crossings: 3920, rescued: 2100, fatalities: 178 },
    { month: 'Nov 2023', crossings: 2180, rescued: 1450, fatalities: 98 },
    { month: 'Dec 2023', crossings: 1560, rescued: 980, fatalities: 67 },
  ];

  const seasonalPatterns = [
    { season: 'Winter', crossings: 1200, avgRisk: 3.2 },
    { season: 'Spring', crossings: 2800, avgRisk: 2.1 },
    { season: 'Summer', crossings: 4500, avgRisk: 1.8 },
    { season: 'Autumn', crossings: 3200, avgRisk: 2.7 },
  ];

  const routeAnalysis = [
    { route: 'Libya-Italy', percentage: 45, trend: 'up' },
    { route: 'Turkey-Greece', percentage: 28, trend: 'down' },
    { route: 'Algeria-Spain', percentage: 15, trend: 'stable' },
    { route: 'Tunisia-Italy', percentage: 12, trend: 'up' },
  ];

  const timeRanges = [
    { value: '3months', label: '3 Months' },
    { value: '6months', label: '6 Months' },
    { value: '1year', label: '1 Year' },
    { value: '2years', label: '2 Years' },
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '↗️';
      case 'down': return '↘️';
      case 'stable': return '→';
      default: return '→';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-red-400';
      case 'down': return 'text-green-400';
      case 'stable': return 'text-yellow-400';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Historical Migration Analysis
            </CardTitle>
            <div className="flex space-x-2">
              {timeRanges.map((range) => (
                <Button
                  key={range.value}
                  size="sm"
                  variant={timeRange === range.value ? "default" : "outline"}
                  onClick={() => setTimeRange(range.value)}
                >
                  {range.label}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Migration Trends Chart */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Migration Crossings & Rescues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={migrationTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #374151',
                      borderRadius: '0.5rem'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="crossings" 
                    stackId="1"
                    stroke="#06b6d4" 
                    fill="#06b6d4"
                    fillOpacity={0.3}
                    name="Total Crossings"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="rescued" 
                    stackId="2"
                    stroke="#10b981" 
                    fill="#10b981"
                    fillOpacity={0.3}
                    name="People Rescued"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="fatalities" 
                    stroke="#ef4444" 
                    strokeWidth={3}
                    name="Fatalities"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Seasonal Patterns */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Seasonal Migration Patterns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={seasonalPatterns}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="season" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #374151',
                      borderRadius: '0.5rem'
                    }}
                  />
                  <Bar 
                    dataKey="crossings" 
                    fill="#8b5cf6" 
                    name="Average Crossings"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    dataKey="avgRisk" 
                    fill="#f59e0b" 
                    name="Average Risk Level"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Route Analysis */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Migration Route Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {routeAnalysis.map((route, index) => (
              <div key={index} className="p-4 bg-slate-900 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-white">{route.route}</h3>
                  <span className={`text-lg ${getTrendColor(route.trend)}`}>
                    {getTrendIcon(route.trend)}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-300">Share:</span>
                    <span className="text-xl font-bold text-cyan-400">{route.percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-cyan-400 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${route.percentage}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-300">Trend:</span>
                    <Badge 
                      variant="outline" 
                      className={`${getTrendColor(route.trend)} border-current`}
                    >
                      {route.trend.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6 text-center">
            <Users className="h-8 w-8 text-blue-400 mx-auto mb-3" />
            <p className="text-sm text-slate-400 mb-1">Total Crossings (6M)</p>
            <p className="text-2xl font-bold text-white">18,290</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6 text-center">
            <Users className="h-8 w-8 text-green-400 mx-auto mb-3" />
            <p className="text-sm text-slate-400 mb-1">People Rescued</p>
            <p className="text-2xl font-bold text-white">10,000</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-8 w-8 text-cyan-400 mx-auto mb-3" />
            <p className="text-sm text-slate-400 mb-1">Rescue Rate</p>
            <p className="text-2xl font-bold text-white">54.7%</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6 text-center">
            <Clock className="h-8 w-8 text-yellow-400 mx-auto mb-3" />
            <p className="text-sm text-slate-400 mb-1">Avg Response Time</p>
            <p className="text-2xl font-bold text-white">4.2h</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TimelineAnalysis;
