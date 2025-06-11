
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Network, Zap } from "lucide-react";

const IntegratedIntel = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Integrated Intelligence Platform</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-purple-400" />
              <span className="text-white">AI Analytics</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Brain className="h-12 w-12 text-purple-400 mx-auto mb-4" />
              <p className="text-slate-400">Advanced AI-powered intelligence analysis</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Network className="h-5 w-5 text-green-400" />
              <span className="text-white">Network Analysis</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Network className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <p className="text-slate-400">Complex network relationship mapping</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-yellow-400" />
              <span className="text-white">Real-Time Alerts</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Zap className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
              <p className="text-slate-400">Instant threat detection and alerting</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IntegratedIntel;
