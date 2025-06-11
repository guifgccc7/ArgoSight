
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, Globe, Ship, DollarSign } from "lucide-react";

const MarketAnalysis = () => {
  const growthData = [
    { year: '2020', traditional: 450, arctic: 12 },
    { year: '2021', traditional: 465, arctic: 18 },
    { year: '2022', traditional: 480, arctic: 25 },
    { year: '2023', traditional: 495, arctic: 34 },
    { year: '2024', traditional: 510, arctic: 48 },
    { year: '2025', traditional: 525, arctic: 67 },
    { year: '2026', traditional: 540, arctic: 92 },
    { year: '2027', traditional: 555, arctic: 125 }
  ];
  
  const routeComparison = [
    { route: 'Suez Canal', volume: 12, cost: 100, time: 25 },
    { route: 'Cape of Good Hope', volume: 8, cost: 135, time: 35 },
    { route: 'Arctic Northeast', volume: 2, cost: 85, time: 17 },
    { route: 'Arctic Northwest', volume: 0.5, cost: 95, time: 19 }
  ];
  
  const marketDrivers = [
    {
      factor: 'Fuel Cost Savings',
      impact: 85,
      description: 'Shorter distance reduces fuel consumption by 30-40%'
    },
    {
      factor: 'Time Efficiency',
      impact: 78,
      description: 'Faster delivery enables more annual voyages'
    },
    {
      factor: 'Reduced Congestion',
      impact: 72,
      description: 'Avoid Suez Canal delays and bottlenecks'
    },
    {
      factor: 'Environmental Benefits',
      impact: 68,
      description: 'Lower emissions align with green shipping mandates'
    },
    {
      factor: 'Geopolitical Stability',
      impact: 55,
      description: 'Reduce dependence on volatile regions'
    }
  ];
  
  const keyMetrics = [
    { label: 'Market Size (2024)', value: '$2.1B', change: '+24%' },
    { label: 'Annual Growth Rate', value: '18.5%', change: 'CAGR' },
    { label: 'Arctic Fleet Size', value: '156', change: '+45%' },
    { label: 'Route Adoption', value: '3.2%', change: '+1.8%' }
  ];
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {keyMetrics.map((metric, index) => (
          <Card key={index} className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-300">{metric.label}</span>
                <TrendingUp className="h-4 w-4 text-green-400" />
              </div>
              <div className="text-2xl font-bold text-white">{metric.value}</div>
              <div className="text-sm text-green-400">{metric.change}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Globe className="h-5 w-5 mr-2 text-cyan-400" />
            Arctic Shipping Market Growth Projection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="year" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #475569',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="traditional" 
                  stroke="#64748b" 
                  strokeWidth={2}
                  name="Traditional Routes (B TEU)"
                />
                <Line 
                  type="monotone" 
                  dataKey="arctic" 
                  stroke="#06b6d4" 
                  strokeWidth={3}
                  name="Arctic Routes (M TEU)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Ship className="h-5 w-5 mr-2 text-cyan-400" />
              Route Comparison Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {routeComparison.map((route, index) => (
                <div key={index} className="bg-slate-900 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-white font-medium">{route.route}</h4>
                    <Badge 
                      variant="outline" 
                      className={route.route.includes('Arctic') ? 'text-cyan-400 border-cyan-400' : 'text-slate-400 border-slate-400'}
                    >
                      {route.volume}% VOLUME
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-slate-300">Cost Index:</span>
                      <div className="text-white font-medium">{route.cost}</div>
                    </div>
                    <div>
                      <span className="text-slate-300">Transit Time:</span>
                      <div className="text-white font-medium">{route.time} days</div>
                    </div>
                    <div>
                      <span className="text-slate-300">Market Share:</span>
                      <div className="text-white font-medium">{route.volume}%</div>
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
              <DollarSign className="h-5 w-5 mr-2 text-cyan-400" />
              Market Growth Drivers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {marketDrivers.map((driver, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">{driver.factor}</span>
                    <span className="text-cyan-400">{driver.impact}%</span>
                  </div>
                  <Progress value={driver.impact} className="h-2" />
                  <p className="text-xs text-slate-400">{driver.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Market Opportunities & Challenges</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-green-400 font-semibold mb-3">Opportunities</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                  <div>
                    <span className="text-white">Climate Change Impact:</span>
                    <p className="text-slate-300">Longer ice-free seasons extending navigation window</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                  <div>
                    <span className="text-white">Technology Advancement:</span>
                    <p className="text-slate-300">Improved ice-class vessels and navigation systems</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                  <div>
                    <span className="text-white">Infrastructure Development:</span>
                    <p className="text-slate-300">New ports and support facilities along Arctic routes</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-red-400 font-semibold mb-3">Challenges</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full mt-2"></div>
                  <div>
                    <span className="text-white">Environmental Regulations:</span>
                    <p className="text-slate-300">Strict emissions controls and wildlife protection</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full mt-2"></div>
                  <div>
                    <span className="text-white">Insurance Costs:</span>
                    <p className="text-slate-300">Higher premiums for Arctic navigation risks</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full mt-2"></div>
                  <div>
                    <span className="text-white">Limited Infrastructure:</span>
                    <p className="text-slate-300">Sparse rescue and maintenance facilities</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketAnalysis;
