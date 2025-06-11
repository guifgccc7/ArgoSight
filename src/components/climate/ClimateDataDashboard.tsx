
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Thermometer, 
  CloudRain, 
  Wind, 
  Waves, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle
} from "lucide-react";

const ClimateDataDashboard = () => {
  const climateMetrics = [
    {
      title: "Global Temperature Anomaly",
      value: "+1.2°C",
      change: "+0.1",
      trend: "up",
      icon: Thermometer,
      color: "text-red-400",
      progress: 75
    },
    {
      title: "Sea Surface Temperature",
      value: "19.8°C",
      change: "+0.5",
      trend: "up",
      icon: Waves,
      color: "text-blue-400",
      progress: 68
    },
    {
      title: "Precipitation Index",
      value: "102%",
      change: "-5%",
      trend: "down",
      icon: CloudRain,
      color: "text-cyan-400",
      progress: 102
    },
    {
      title: "Wind Pattern Intensity",
      value: "85 km/h",
      change: "+12",
      trend: "up",
      icon: Wind,
      color: "text-yellow-400",
      progress: 85
    }
  ];

  const alerts = [
    {
      type: "Storm System",
      severity: "high",
      location: "North Atlantic",
      description: "Category 3 storm approaching shipping lanes"
    },
    {
      type: "Temperature Rise",
      severity: "medium",
      location: "Arctic Region",
      description: "Unusual warming trend detected"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {climateMetrics.map((metric) => (
          <Card key={metric.title} className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <metric.icon className={`h-5 w-5 ${metric.color}`} />
                <div className="flex items-center space-x-1">
                  {metric.trend === "up" ? (
                    <TrendingUp className="h-3 w-3 text-red-400" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-green-400" />
                  )}
                  <span className="text-xs text-slate-400">{metric.change}</span>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-slate-300">{metric.title}</h3>
                <p className="text-xl font-bold text-white">{metric.value}</p>
                <Progress value={metric.progress} className="h-1" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-yellow-400" />
            Active Climate Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.map((alert, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-slate-900 rounded-lg">
                <AlertTriangle className={`h-5 w-5 mt-0.5 ${
                  alert.severity === "high" ? "text-red-400" : "text-yellow-400"
                }`} />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="text-sm font-medium text-white">{alert.type}</h4>
                    <Badge variant="outline" className={
                      alert.severity === "high" 
                        ? "text-red-400 border-red-400" 
                        : "text-yellow-400 border-yellow-400"
                    }>
                      {alert.severity.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-400 mb-1">{alert.location}</p>
                  <p className="text-sm text-slate-300">{alert.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClimateDataDashboard;
