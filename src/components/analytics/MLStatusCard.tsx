
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database } from "lucide-react";

interface MLStatusCardProps {
  mlStatus: any;
}

const MLStatusCard = ({ mlStatus }: MLStatusCardProps) => {
  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Database className="h-5 w-5 mr-2" />
          Machine Learning Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3 bg-slate-900 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-300">Text Classification</span>
              <Badge variant="outline" className={mlStatus?.textClassifierLoaded ? "text-green-400 border-green-400" : "text-red-400 border-red-400"}>
                {mlStatus?.textClassifierLoaded ? 'LOADED' : 'OFFLINE'}
              </Badge>
            </div>
            <p className="text-xs text-slate-400">DistilBERT model for behavior classification</p>
          </div>
          
          <div className="p-3 bg-slate-900 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-300">Anomaly Detection</span>
              <Badge variant="outline" className="text-green-400 border-green-400">
                ACTIVE
              </Badge>
            </div>
            <p className="text-xs text-slate-400">Statistical Z-score based detection</p>
          </div>
          
          <div className="p-3 bg-slate-900 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-300">Feature Extraction</span>
              <Badge variant="outline" className="text-green-400 border-green-400">
                ACTIVE
              </Badge>
            </div>
            <p className="text-xs text-slate-400">7-dimensional vessel behavior features</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MLStatusCard;
