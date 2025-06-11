
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Thermometer, Wind, Waves, AlertTriangle } from "lucide-react";

const ClimateSecurityPanel = () => {
  const riskFactors = [
    { name: "Sea Level Rise", value: 78, icon: Waves, color: "text-blue-400" },
    { name: "Temperature Change", value: 65, icon: Thermometer, color: "text-red-400" },
    { name: "Storm Intensity", value: 82, icon: Wind, color: "text-yellow-400" },
    { name: "Ice Coverage", value: 45, icon: AlertTriangle, color: "text-cyan-400" },
  ];

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">Climate Security Assessment</CardTitle>
          <Badge variant="outline" className="text-orange-400 border-orange-400">
            ELEVATED RISK
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {riskFactors.map((factor) => (
            <div key={factor.name} className="space-y-2">
              <div className="flex items-center space-x-2">
                <factor.icon className={`h-4 w-4 ${factor.color}`} />
                <span className="text-sm text-slate-300">{factor.name}</span>
              </div>
              <Progress value={factor.value} className="h-2" />
              <span className="text-xs text-slate-400">{factor.value}% risk level</span>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-slate-900 rounded-lg border border-slate-600">
          <h4 className="text-sm font-medium text-white mb-2">Current Threat Assessment</h4>
          <p className="text-sm text-slate-300">
            Arctic ice coverage at 45% below seasonal average. Increased shipping traffic 
            detected in newly accessible routes. Enhanced monitoring recommended for 
            geopolitical stability in polar regions.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClimateSecurityPanel;
