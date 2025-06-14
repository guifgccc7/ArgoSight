
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Database,
  CheckCircle,
  AlertCircle,
  Clock
} from "lucide-react";
import { DataSource } from '@/services/realTimeDataProcessor';

interface DataSourcesPanelProps {
  dataSources: DataSource[];
}

const DataSourcesPanel: React.FC<DataSourcesPanelProps> = ({ dataSources }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-400" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-400 border-green-400';
      case 'error':
        return 'text-red-400 border-red-400';
      default:
        return 'text-yellow-400 border-yellow-400';
    }
  };

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Database className="h-5 w-5 mr-2" />
          Real-Time Data Sources
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {dataSources.map((source) => (
            <div key={source.id} className="p-3 bg-slate-900 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(source.status)}
                  <span className="text-white font-medium">{source.name}</span>
                </div>
                <Badge variant="outline" className={getStatusColor(source.status)}>
                  {source.status.toUpperCase()}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400">Reliability</span>
                  <div className="mt-1">
                    <Progress value={source.reliability * 100} className="h-2" />
                    <span className="text-white">{(source.reliability * 100).toFixed(1)}%</span>
                  </div>
                </div>
                <div>
                  <span className="text-slate-400">Latency</span>
                  <p className="text-white font-medium">{source.latency}ms</p>
                </div>
              </div>
              
              <div className="mt-2 text-xs text-slate-400">
                Last update: {new Date(source.lastUpdate).toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DataSourcesPanel;
