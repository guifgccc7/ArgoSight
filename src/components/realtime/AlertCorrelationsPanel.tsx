
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  RefreshCw,
  AlertCircle
} from "lucide-react";
import { AlertCorrelation } from '@/services/intelligentAlertingSystem';

interface AlertCorrelationsPanelProps {
  correlations: AlertCorrelation[];
}

const AlertCorrelationsPanel: React.FC<AlertCorrelationsPanelProps> = ({ correlations }) => {
  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <RefreshCw className="h-5 w-5 mr-2" />
          Alert Correlations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {correlations.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <AlertCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No correlations detected</p>
              <p className="text-xs mt-1">Real-time monitoring active</p>
            </div>
          ) : (
            correlations.map((correlation) => (
              <div key={correlation.id} className="p-3 bg-slate-900 rounded-lg border-l-4 border-orange-400">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">Pattern Correlation</span>
                  <Badge variant="outline" className="text-orange-400 border-orange-400">
                    {(correlation.confidence * 100).toFixed(0)}% CONF
                  </Badge>
                </div>
                <p className="text-sm text-slate-300 mb-2">{correlation.summary}</p>
                <p className="text-xs text-blue-400 italic">
                  Recommendation: {correlation.recommendedAction}
                </p>
                <div className="mt-2 text-xs text-slate-400">
                  Related alerts: {correlation.relatedAlerts.length}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AlertCorrelationsPanel;
