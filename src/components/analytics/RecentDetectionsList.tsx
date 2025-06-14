
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, AlertTriangle } from "lucide-react";
import { BehaviorPattern } from "@/services/patternRecognitionService";

interface RecentDetectionsListProps {
  patterns: BehaviorPattern[];
}

const RecentDetectionsList = ({ patterns }: RecentDetectionsListProps) => {
  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Activity className="h-5 w-5 mr-2" />
          Recent ML-Enhanced Detections
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {patterns.slice(0, 6).map((pattern) => (
            <div key={pattern.id} className="flex items-start space-x-3 p-3 bg-slate-900 rounded-lg">
              <AlertTriangle className={`h-4 w-4 mt-0.5 ${
                pattern.severity === 'critical' ? 'text-red-400' :
                pattern.severity === 'high' ? 'text-orange-400' :
                pattern.severity === 'medium' ? 'text-yellow-400' :
                'text-green-400'
              }`} />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-medium text-white">{pattern.type.replace('_', ' ')}</h4>
                  <div className="flex items-center space-x-1">
                    <Badge variant="outline" className="text-cyan-400 border-cyan-400">
                      {Math.round(pattern.confidence * 100)}%
                    </Badge>
                    <Badge variant="outline" className="text-purple-400 border-purple-400">
                      ML
                    </Badge>
                  </div>
                </div>
                <p className="text-xs text-slate-400 mb-1">{pattern.description}</p>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-slate-500">Risk: {pattern.riskScore}</span>
                  <span className="text-xs text-slate-500">Vessel: {pattern.vesselId.slice(-6)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentDetectionsList;
