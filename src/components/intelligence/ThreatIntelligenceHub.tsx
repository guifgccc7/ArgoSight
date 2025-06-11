
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, 
  Target, 
  AlertTriangle, 
  Eye,
  Globe,
  Users,
  Activity,
  TrendingUp
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";

const ThreatIntelligenceHub = () => {
  const threatLevels = [
    { region: "North Sea", level: 3, threats: 8, trend: "stable" },
    { region: "Mediterranean", level: 5, threats: 15, trend: "increasing" },
    { region: "Arctic Routes", level: 2, threats: 3, trend: "decreasing" },
    { region: "Atlantic Corridor", level: 4, threats: 12, trend: "stable" },
    { region: "Pacific Lanes", level: 2, threats: 4, trend: "stable" }
  ];

  const threatTypes = [
    { type: "Piracy", incidents: 23, severity: 8, prevention: 67 },
    { type: "Smuggling", incidents: 45, severity: 6, prevention: 78 },
    { type: "Terrorism", incidents: 3, severity: 10, prevention: 95 },
    { type: "Cyber Attacks", incidents: 67, severity: 7, prevention: 72 },
    { type: "Sabotage", incidents: 12, severity: 9, prevention: 85 }
  ];

  const threatTrends = [
    { month: "Jan", piracy: 15, cyber: 23, smuggling: 34 },
    { month: "Feb", piracy: 18, cyber: 28, smuggling: 31 },
    { month: "Mar", piracy: 12, cyber: 35, smuggling: 29 },
    { month: "Apr", piracy: 21, cyber: 42, smuggling: 38 },
    { month: "May", piracy: 16, cyber: 38, smuggling: 42 },
    { month: "Jun", piracy: 23, cyber: 45, smuggling: 39 }
  ];

  const riskAssessment = [
    { factor: "Geographic Risk", score: 75 },
    { factor: "Historical Incidents", score: 68 },
    { factor: "Intelligence Reports", score: 82 },
    { factor: "Environmental Factors", score: 45 },
    { factor: "Political Stability", score: 71 },
    { factor: "Economic Indicators", score: 63 }
  ];

  const activeThreats = [
    {
      id: "THR-001",
      type: "Piracy Group",
      location: "Gulf of Aden",
      severity: "high",
      description: "Organized maritime piracy group targeting commercial vessels",
      lastActivity: "6 hours ago",
      riskScore: 87
    },
    {
      id: "THR-002", 
      type: "Cyber Network",
      location: "Global",
      severity: "critical",
      description: "Advanced persistent threat targeting maritime infrastructure",
      lastActivity: "2 days ago",
      riskScore: 94
    },
    {
      id: "THR-003",
      type: "Smuggling Ring",
      location: "Mediterranean",
      severity: "medium",
      description: "Human trafficking operation using fishing vessel covers",
      lastActivity: "12 hours ago",
      riskScore: 73
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "text-red-400 border-red-400";
      case "high": return "text-orange-400 border-orange-400";
      case "medium": return "text-yellow-400 border-yellow-400";
      case "low": return "text-green-400 border-green-400";
      default: return "text-slate-400 border-slate-400";
    }
  };

  const getThreatLevelColor = (level: number) => {
    if (level >= 4) return "text-red-400";
    if (level >= 3) return "text-orange-400";
    if (level >= 2) return "text-yellow-400";
    return "text-green-400";
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-red-400" />
              <div>
                <p className="text-sm text-slate-400">Active Threats</p>
                <p className="text-2xl font-bold text-white">47</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Target className="h-8 w-8 text-orange-400" />
              <div>
                <p className="text-sm text-slate-400">High Priority</p>
                <p className="text-2xl font-bold text-white">12</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Eye className="h-8 w-8 text-blue-400" />
              <div>
                <p className="text-sm text-slate-400">Under Surveillance</p>
                <p className="text-2xl font-bold text-white">156</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-8 w-8 text-green-400" />
              <div>
                <p className="text-sm text-slate-400">Prevention Rate</p>
                <p className="text-2xl font-bold text-white">94.7%</p>
              </div>
            </div>
          </CardContent>
        </Card>
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
            <div className="space-y-4">
              {threatLevels.map((region, index) => (
                <div key={index} className="p-3 bg-slate-900 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-white font-medium">{region.region}</h4>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className={
                        region.trend === "increasing" ? "text-red-400 border-red-400" :
                        region.trend === "decreasing" ? "text-green-400 border-green-400" :
                        "text-slate-400 border-slate-400"
                      }>
                        {region.trend.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-400">Threat Level</span>
                        <span className={getThreatLevelColor(region.level)}>{region.level}/5</span>
                      </div>
                      <Progress value={(region.level / 5) * 100} className="h-2" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">Active Threats</span>
                      <span className="text-white font-medium">{region.threats}</span>
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
              <Activity className="h-5 w-5 mr-2" />
              Threat Type Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={threatTypes}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="type" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F9FAFB'
                    }}
                  />
                  <Bar dataKey="incidents" fill="#EF4444" name="Incidents" />
                  <Bar dataKey="prevention" fill="#10B981" name="Prevention %" />
                </BarChart>
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
              Threat Trends (6 Months)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={threatTrends}>
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
                  <Line type="monotone" dataKey="piracy" stroke="#EF4444" strokeWidth={2} />
                  <Line type="monotone" dataKey="cyber" stroke="#8B5CF6" strokeWidth={2} />
                  <Line type="monotone" dataKey="smuggling" stroke="#F59E0B" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Risk Factor Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={riskAssessment}>
                  <PolarGrid stroke="#374151" />
                  <PolarAngleAxis dataKey="factor" stroke="#9CA3AF" />
                  <PolarRadiusAxis stroke="#9CA3AF" />
                  <Radar dataKey="score" stroke="#06B6D4" fill="#06B6D4" fillOpacity={0.2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Active Threat Intelligence
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeThreats.map((threat) => (
              <div key={threat.id} className="p-4 bg-slate-900 rounded-lg border border-slate-700">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <Badge variant="outline" className={getSeverityColor(threat.severity)}>
                        {threat.severity.toUpperCase()}
                      </Badge>
                      <h4 className="text-white font-medium">{threat.type}</h4>
                      <span className="text-xs text-slate-400">#{threat.id}</span>
                    </div>
                    <p className="text-sm text-slate-300 mb-3">{threat.description}</p>
                    <div className="flex items-center space-x-6 text-xs text-slate-400">
                      <span>📍 {threat.location}</span>
                      <span>🕒 {threat.lastActivity}</span>
                      <span>⚠️ Risk Score: {threat.riskScore}/100</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-2">
                      <span className={`text-lg font-bold ${
                        threat.riskScore >= 90 ? "text-red-400" :
                        threat.riskScore >= 70 ? "text-orange-400" :
                        threat.riskScore >= 50 ? "text-yellow-400" :
                        "text-green-400"
                      }`}>
                        {threat.riskScore}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">Risk Score</p>
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

export default ThreatIntelligenceHub;
