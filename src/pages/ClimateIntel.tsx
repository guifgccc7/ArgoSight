
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CloudSnow, Thermometer, Wind } from "lucide-react";

const ClimateIntel = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Climate Intelligence Platform</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CloudSnow className="h-5 w-5 text-cyan-400" />
              <span className="text-white">Climate Data</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <CloudSnow className="h-12 w-12 text-cyan-400 mx-auto mb-4" />
              <p className="text-slate-400">Comprehensive climate monitoring and analysis</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Thermometer className="h-5 w-5 text-red-400" />
              <span className="text-white">Temperature Trends</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Thermometer className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <p className="text-slate-400">Global temperature tracking and predictions</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Wind className="h-5 w-5 text-blue-400" />
              <span className="text-white">Weather Patterns</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Wind className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <p className="text-slate-400">Advanced meteorological analysis</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClimateIntel;
