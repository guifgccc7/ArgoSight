
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Ship, 
  Calendar, 
  DollarSign, 
  TrendingUp,
  AlertTriangle,
  Snowflake,
  Waves
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const ClimateImpactAnalysis = () => {
  const routeImpacts = [
    { route: "Arctic Northeast", accessibility: 85, risk: "medium", savings: 25 },
    { route: "Arctic Northwest", accessibility: 70, risk: "high", savings: 30 },
    { route: "Suez Canal", accessibility: 95, risk: "low", savings: 0 },
    { route: "Panama Canal", accessibility: 98, risk: "low", savings: 0 },
    { route: "Cape of Good Hope", accessibility: 92, risk: "medium", savings: -5 }
  ];

  const seasonalData = [
    { month: "Jan", arctic: 15, traditional: 85 },
    { month: "Feb", arctic: 10, traditional: 90 },
    { month: "Mar", arctic: 25, traditional: 75 },
    { month: "Apr", arctic: 45, traditional: 55 },
    { month: "May", arctic: 70, traditional: 30 },
    { month: "Jun", arctic: 85, traditional: 15 },
    { month: "Jul", arctic: 95, traditional: 5 },
    { month: "Aug", arctic: 90, traditional: 10 },
    { month: "Sep", arctic: 75, traditional: 25 },
    { month: "Oct", arctic: 50, traditional: 50 },
    { month: "Nov", arctic: 25, traditional: 75 },
    { month: "Dec", arctic: 20, traditional: 80 }
  ];

  const economicImpacts = [
    { name: "Fuel Savings", value: 35, color: "#10B981" },
    { name: "Time Reduction", value: 25, color: "#3B82F6" },
    { name: "Insurance Costs", value: 20, color: "#EF4444" },
    { name: "Port Fees", value: 15, color: "#F59E0B" },
    { name: "Maintenance", value: 5, color: "#8B5CF6" }
  ];

  const riskFactors = [
    {
      category: "Ice Coverage",
      current: 45,
      historical: 75,
      trend: "decreasing",
      impact: "high"
    },
    {
      category: "Storm Frequency",
      current: 82,
      historical: 65,
      trend: "increasing", 
      impact: "medium"
    },
    {
      category: "Sea Level",
      current: 105,
      historical: 100,
      trend: "increasing",
      impact: "low"
    },
    {
      category: "Temperature",
      current: 112,
      historical: 100,
      trend: "increasing",
      impact: "high"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Ship className="h-5 w-5 mr-2" />
              Route Accessibility Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {routeImpacts.map((route) => (
                <div key={route.route} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-white">{route.route}</h4>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className={
                        route.risk === "high" ? "text-red-400 border-red-400" :
                        route.risk === "medium" ? "text-yellow-400 border-yellow-400" :
                        "text-green-400 border-green-400"
                      }>
                        {route.risk.toUpperCase()}
                      </Badge>
                      <span className="text-xs text-slate-400">{route.accessibility}%</span>
                    </div>
                  </div>
                  <Progress value={route.accessibility} className="h-2" />
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Accessibility</span>
                    <span>Cost Impact: {route.savings > 0 ? '+' : ''}{route.savings}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Economic Impact Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={economicImpacts}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {economicImpacts.map((entry, index) => (
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

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Seasonal Navigation Windows
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={seasonalData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                />
                <Bar dataKey="arctic" stackId="a" fill="#06B6D4" name="Arctic Routes" />
                <Bar dataKey="traditional" stackId="a" fill="#64748B" name="Traditional Routes" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Climate Risk Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {riskFactors.map((factor) => (
              <div key={factor.category} className="p-4 bg-slate-900 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-white">{factor.category}</h4>
                  <Badge variant="outline" className={
                    factor.impact === "high" ? "text-red-400 border-red-400" :
                    factor.impact === "medium" ? "text-yellow-400 border-yellow-400" :
                    "text-green-400 border-green-400"
                  }>
                    {factor.impact.toUpperCase()} IMPACT
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">Current</span>
                    <span className="text-white">{factor.current}%</span>
                  </div>
                  <Progress value={factor.current} className="h-2" />
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Historical: {factor.historical}%</span>
                    <span className={
                      factor.trend === "increasing" ? "text-red-400" : 
                      factor.trend === "decreasing" ? "text-green-400" : "text-yellow-400"
                    }>
                      {factor.trend === "increasing" ? "↗" : factor.trend === "decreasing" ? "↘" : "→"} {factor.trend}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClimateImpactAnalysis;
