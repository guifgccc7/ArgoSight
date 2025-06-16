
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database } from 'lucide-react';

interface DatabaseHealthCardProps {
  systemHealth: any;
}

export const DatabaseHealthCard: React.FC<DatabaseHealthCardProps> = ({ systemHealth }) => {
  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Database className="h-5 w-5 mr-2" />
          Database Health
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between">
          <span className="text-slate-300">Total Vessels</span>
          <span className="text-white font-mono">{systemHealth?.vessels_count || 0}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-300">Positions (24h)</span>
          <span className="text-white font-mono">{systemHealth?.positions_last_24h || 0}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-300">Weather Records (24h)</span>
          <span className="text-white font-mono">{systemHealth?.weather_records_last_24h || 0}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-300">Satellite Images (7d)</span>
          <span className="text-white font-mono">{systemHealth?.satellite_images_last_7d || 0}</span>
        </div>
      </CardContent>
    </Card>
  );
};
