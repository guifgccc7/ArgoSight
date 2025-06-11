
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Waves, Users, AlertTriangle } from "lucide-react";

const MediterraneanRoutes = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Mediterranean Migration Monitor</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Waves className="h-5 w-5 text-cyan-400" />
              <span className="text-white">Migration Routes</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Waves className="h-12 w-12 text-cyan-400 mx-auto mb-4" />
              <p className="text-slate-400">Real-time migration route tracking</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-400" />
              <span className="text-white">Humanitarian Aid</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <p className="text-slate-400">Coordination dashboard for aid operations</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              <span className="text-white">Risk Assessment</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <p className="text-slate-400">Weather and safety risk analysis</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MediterraneanRoutes;
