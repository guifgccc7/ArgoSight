
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Activity, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Clock
} from 'lucide-react';
import { apiHealthMonitor, ApiHealthStatus } from '@/services/apiHealthMonitor';
import { toast } from 'sonner';

const ApiStatusPanel: React.FC = () => {
  const [healthStatus, setHealthStatus] = useState<ApiHealthStatus[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  useEffect(() => {
    // Start monitoring on component mount
    apiHealthMonitor.startMonitoring(5); // Check every 5 minutes
    loadHealthStatus();

    return () => {
      apiHealthMonitor.stopMonitoring();
    };
  }, []);

  const loadHealthStatus = async () => {
    setIsChecking(true);
    try {
      const status = await apiHealthMonitor.checkAllServices();
      setHealthStatus(status);
      setLastUpdate(new Date().toLocaleTimeString());
    } catch (error: any) {
      toast.error(`Failed to check API health: ${error.message}`);
    } finally {
      setIsChecking(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'degraded':
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      case 'down':
        return <XCircle className="h-4 w-4 text-red-400" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-400 border-green-400';
      case 'degraded':
        return 'text-yellow-400 border-yellow-400';
      case 'down':
        return 'text-red-400 border-red-400';
      default:
        return 'text-gray-400 border-gray-400';
    }
  };

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-cyan-400" />
            <span>API Status Monitor</span>
          </div>
          <Button
            onClick={loadHealthStatus}
            disabled={isChecking}
            size="sm"
            className="bg-cyan-600 hover:bg-cyan-700"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isChecking ? 'animate-spin' : ''}`} />
            Check Status
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {healthStatus.length === 0 ? (
            <div className="text-center py-4 text-slate-400">
              <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Click "Check Status" to monitor API health</p>
            </div>
          ) : (
            <>
              {healthStatus.map((service) => (
                <div key={service.service} className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(service.status)}
                    <div>
                      <h3 className="text-white font-medium">{service.service}</h3>
                      <p className="text-sm text-slate-400">
                        {service.responseTime ? `${service.responseTime}ms` : 'No response time'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className={getStatusColor(service.status)}>
                      {service.status.toUpperCase()}
                    </Badge>
                    {service.errorMessage && (
                      <p className="text-xs text-red-400 mt-1 max-w-40 truncate">
                        {service.errorMessage}
                      </p>
                    )}
                  </div>
                </div>
              ))}
              
              {lastUpdate && (
                <div className="text-center text-sm text-slate-400 pt-2 border-t border-slate-700">
                  Last updated: {lastUpdate}
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiStatusPanel;
