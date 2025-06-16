
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, CheckCircle } from 'lucide-react';

interface AlertsPanelProps {
  recentAlerts: any[];
}

export const AlertsPanel: React.FC<AlertsPanelProps> = ({ recentAlerts }) => {
  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Recent System Alerts</CardTitle>
      </CardHeader>
      <CardContent>
        {recentAlerts.length > 0 ? (
          <div className="space-y-3">
            {recentAlerts.map((alert, index) => (
              <Alert key={index} className="bg-slate-900 border-slate-600">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-slate-300">
                  <div className="flex justify-between">
                    <span>{alert.error_message || `${alert.provider} integration error`}</span>
                    <span className="text-xs text-slate-500">
                      {new Date(alert.timestamp_utc).toLocaleString()}
                    </span>
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-400">
            <CheckCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No recent alerts - all systems operational</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
