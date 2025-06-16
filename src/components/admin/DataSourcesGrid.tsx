
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DataSourcesGridProps {
  providers: any;
}

export const DataSourcesGrid: React.FC<DataSourcesGridProps> = ({ providers }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'error': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* AIS Providers */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">AIS Data Providers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {providers?.ais.map((provider: any) => (
            <div key={provider.id} className="flex items-center justify-between">
              <div>
                <div className="text-white font-medium">{provider.name}</div>
                <div className="text-xs text-slate-400">{provider.rateLimitPerHour}/hr</div>
              </div>
              <Badge variant="outline" className={getStatusColor(provider.status)}>
                {provider.status}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Weather Providers */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Weather Providers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {providers?.weather.map((provider: any) => (
            <div key={provider.id} className="flex items-center justify-between">
              <div>
                <div className="text-white font-medium">{provider.name}</div>
                <div className="text-xs text-slate-400">{provider.features.join(', ')}</div>
              </div>
              <Badge variant="outline" className="text-green-500 border-green-500">
                ready
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Satellite Providers */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Satellite Providers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {providers?.satellite.map((provider: any) => (
            <div key={provider.id} className="flex items-center justify-between">
              <div>
                <div className="text-white font-medium">{provider.name}</div>
                <div className="text-xs text-slate-400">{provider.resolution} resolution</div>
              </div>
              <Badge variant="outline" className="text-green-500 border-green-500">
                ready
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
