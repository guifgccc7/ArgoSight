
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Network, 
  Zap, 
  GitBranch, 
  Search,
  AlertCircle,
  TrendingUp,
  Database,
  Brain
} from "lucide-react";

const DataCorrelation = () => {
  const correlationResults = [
    {
      id: 1,
      title: "Vessel Route Anomaly Pattern",
      confidence: 85,
      sources: ["AIS Data", "Satellite Imagery", "Weather Data"],
      description: "Correlation between unusual vessel routes and severe weather avoidance patterns",
      riskLevel: "medium",
      connections: 12
    },
    {
      id: 2,
      title: "Port Security Breach Correlation",
      confidence: 92,
      sources: ["Security Logs", "CCTV Analysis", "Access Control"],
      description: "Pattern linking security incidents to specific time windows and personnel shifts",
      riskLevel: "high",
      connections: 8
    },
    {
      id: 3,
      title: "Climate Impact on Operations",
      confidence: 78,
      sources: ["Climate Data", "Route Performance", "Fuel Consumption"],
      description: "Strong correlation between climate anomalies and operational efficiency",
      riskLevel: "medium",
      connections: 15
    }
  ];

  const networkNodes = [
    { name: "Vessel Tracking", connections: 25, type: "primary" },
    { name: "Weather Systems", connections: 18, type: "secondary" },
    { name: "Port Operations", connections: 22, type: "primary" },
    { name: "Security Events", connections: 14, type: "tertiary" },
    { name: "Communication", connections: 16, type: "secondary" },
    { name: "Cargo Manifest", connections: 12, type: "tertiary" }
  ];

  const anomalyDetections = [
    {
      type: "Route Deviation",
      severity: "high",
      probability: 89,
      description: "Vessel deviated 45° from planned route without notification"
    },
    {
      type: "Communication Gap",
      severity: "medium",
      probability: 76,
      description: "Unusual 6-hour communication silence during transit"
    },
    {
      type: "Speed Anomaly",
      severity: "low",
      probability: 62,
      description: "Vessel speed 25% below average for similar conditions"
    }
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Network className="h-5 w-5 mr-2" />
            Data Correlation Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {correlationResults.map((result) => (
              <div key={result.id} className="p-4 bg-slate-900 rounded-lg border border-slate-700">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-white mb-2">{result.title}</h3>
                    <p className="text-sm text-slate-300 mb-3">{result.description}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {result.sources.map((source, index) => (
                        <Badge key={index} variant="outline" className="text-cyan-400 border-cyan-400 text-xs">
                          {source}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className={
                      result.riskLevel === "high" ? "text-red-400 border-red-400" :
                      result.riskLevel === "medium" ? "text-yellow-400 border-yellow-400" :
                      "text-green-400 border-green-400"
                    }>
                      {result.riskLevel.toUpperCase()}
                    </Badge>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-400">Confidence</span>
                      <span className="text-white">{result.confidence}%</span>
                    </div>
                    <Progress value={result.confidence} className="h-2" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Connections</span>
                    <div className="flex items-center space-x-2">
                      <GitBranch className="h-4 w-4 text-cyan-400" />
                      <span className="text-white font-medium">{result.connections}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Database className="h-5 w-5 mr-2" />
              Data Source Network
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {networkNodes.map((node, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      node.type === "primary" ? "bg-green-400" :
                      node.type === "secondary" ? "bg-yellow-400" :
                      "bg-blue-400"
                    }`}></div>
                    <span className="text-white font-medium">{node.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-slate-400">{node.connections} connections</span>
                    <Network className="h-4 w-4 text-cyan-400" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Brain className="h-5 w-5 mr-2" />
              Anomaly Detection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {anomalyDetections.map((anomaly, index) => (
                <div key={index} className="p-3 bg-slate-900 rounded-lg border-l-4 border-yellow-400">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-white">{anomaly.type}</h4>
                    <Badge variant="outline" className={
                      anomaly.severity === "high" ? "text-red-400 border-red-400" :
                      anomaly.severity === "medium" ? "text-yellow-400 border-yellow-400" :
                      "text-green-400 border-green-400"
                    }>
                      {anomaly.severity.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-300 mb-2">{anomaly.description}</p>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Detection Probability</span>
                    <span className="text-cyan-400 font-medium">{anomaly.probability}%</span>
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
            <Zap className="h-5 w-5 mr-2" />
            Real-time Correlation Engine
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-900 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="h-8 w-8 text-green-400" />
              </div>
              <h3 className="text-lg font-medium text-white mb-1">Pattern Recognition</h3>
              <p className="text-sm text-slate-400">Identifying recurring patterns across data sources</p>
              <div className="mt-2">
                <span className="text-2xl font-bold text-green-400">94%</span>
                <p className="text-xs text-slate-500">Accuracy Rate</p>
              </div>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3">
                <Search className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-lg font-medium text-white mb-1">Relationship Mapping</h3>
              <p className="text-sm text-slate-400">Connecting disparate intelligence sources</p>
              <div className="mt-2">
                <span className="text-2xl font-bold text-blue-400">157</span>
                <p className="text-xs text-slate-500">Active Correlations</p>
              </div>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-red-900 rounded-full flex items-center justify-center mx-auto mb-3">
                <AlertCircle className="h-8 w-8 text-red-400" />
              </div>
              <h3 className="text-lg font-medium text-white mb-1">Threat Assessment</h3>
              <p className="text-sm text-slate-400">Real-time threat level evaluation</p>
              <div className="mt-2">
                <span className="text-2xl font-bold text-red-400">8</span>
                <p className="text-xs text-slate-500">Active Threats</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataCorrelation;
