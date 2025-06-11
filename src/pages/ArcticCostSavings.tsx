
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, Calculator } from "lucide-react";

const ArcticCostSavings = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Arctic Route Cost Savings Analysis</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-400" />
              <span className="text-white">Total Savings</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">$2.1B</div>
            <p className="text-slate-400">Annual industry savings</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-cyan-400" />
              <span className="text-white">Efficiency Gain</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cyan-400">35%</div>
            <p className="text-slate-400">Average route efficiency</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calculator className="h-5 w-5 text-yellow-400" />
              <span className="text-white">ROI Calculator</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Calculator className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
              <p className="text-slate-400">Interactive cost-benefit analysis tool</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ArcticCostSavings;
