import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wifi, WifiOff, Loader2, Database, Satellite } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';

const RealDataStatus: React.FC = () => {
  const [status, setStatus] = useState<{
    aisIntegration: 'active' | 'inactive' | 'loading';
    vesselCount: number;
    lastUpdate: string | null;
    error?: string;
  }>({
    aisIntegration: 'loading',
    vesselCount: 0,
    lastUpdate: null
  });

  const [isStarting, setIsStarting] = useState(false);

  useEffect(() => {
    checkDataStatus();
    const interval = setInterval(checkDataStatus, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const checkDataStatus = async () => {
    try {
      // Check vessel count in database
      const { data: vesselData, error } = await supabase
        .from('vessel_positions')
        .select('count', { count: 'exact' })
        .gte('timestamp_utc', new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString());

      if (error) {
        console.error('Error checking vessel data:', error);
        setStatus(prev => ({ 
          ...prev, 
          error: 'Database connection error',
          aisIntegration: 'inactive'
        }));
        return;
      }

      const vesselCount = vesselData?.[0]?.count || 0;
      
      // Check for recent data
      const { data: recentData } = await supabase
        .from('vessel_positions')
        .select('timestamp_utc')
        .order('timestamp_utc', { ascending: false })
        .limit(1);

      const lastUpdate = recentData?.[0]?.timestamp_utc || null;
      const isRecentData = lastUpdate && 
        (Date.now() - new Date(lastUpdate).getTime()) < 30 * 60 * 1000; // Within 30 minutes

      setStatus({
        aisIntegration: vesselCount > 0 && isRecentData ? 'active' : 'inactive',
        vesselCount,
        lastUpdate,
        error: undefined
      });
    } catch (error) {
      console.error('Error checking data status:', error);
      setStatus(prev => ({ 
        ...prev, 
        error: 'Failed to check status',
        aisIntegration: 'inactive'
      }));
    }
  };

  const startAISIntegration = async () => {
    setIsStarting(true);
    try {
      const { data, error } = await supabase.functions.invoke('aisstream-integration');
      
      if (error) {
        console.error('Error starting AIS integration:', error);
        setStatus(prev => ({ 
          ...prev, 
          error: `Failed to start: ${error.message}`,
          aisIntegration: 'inactive'
        }));
      } else {
        console.log('AIS integration started:', data);
        setTimeout(checkDataStatus, 5000); // Check status after 5 seconds
      }
    } catch (error) {
      console.error('Error invoking AIS integration:', error);
      setStatus(prev => ({ 
        ...prev, 
        error: 'Failed to invoke AIS integration',
        aisIntegration: 'inactive'
      }));
    } finally {
      setIsStarting(false);
    }
  };

  const getStatusIcon = () => {
    switch (status.aisIntegration) {
      case 'active':
        return <Wifi className="h-4 w-4 text-green-400" />;
      case 'loading':
        return <Loader2 className="h-4 w-4 text-yellow-400 animate-spin" />;
      case 'inactive':
      default:
        return <WifiOff className="h-4 w-4 text-red-400" />;
    }
  };

  const getStatusBadge = () => {
    switch (status.aisIntegration) {
      case 'active':
        return <Badge variant="outline" className="text-green-400 border-green-400">LIVE DATA</Badge>;
      case 'loading':
        return <Badge variant="outline" className="text-yellow-400 border-yellow-400">CHECKING</Badge>;
      case 'inactive':
      default:
        return <Badge variant="outline" className="text-red-400 border-red-400">NO DATA</Badge>;
    }
  };

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <Satellite className="h-5 w-5 text-cyan-400" />
          <span>Real-Time Data Status</span>
          {getStatusBadge()}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              {getStatusIcon()}
              <span className="text-sm text-slate-300">AIS Integration</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {status.aisIntegration === 'active' ? 'ACTIVE' : 'OFFLINE'}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Database className="h-4 w-4 text-cyan-400" />
              <span className="text-sm text-slate-300">Tracked Vessels</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {status.vesselCount.toLocaleString()}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-sm text-slate-300">Last Update</div>
            <div className="text-sm text-white">
              {status.lastUpdate 
                ? new Date(status.lastUpdate).toLocaleTimeString()
                : 'No data'
              }
            </div>
          </div>
        </div>

        {status.error && (
          <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
            <div className="text-red-400 text-sm">{status.error}</div>
          </div>
        )}

        {status.aisIntegration === 'inactive' && (
          <div className="space-y-3">
            <div className="p-3 bg-slate-700 rounded-lg">
              <div className="text-sm text-slate-300 mb-2">
                To start receiving real vessel data, you need:
              </div>
              <ul className="text-xs text-slate-400 space-y-1">
                <li>• AISStream API key configured in Edge Function Secrets</li>
                <li>• Start the AIS integration service</li>
              </ul>
            </div>
            
            <Button 
              onClick={startAISIntegration}
              disabled={isStarting}
              className="w-full"
            >
              {isStarting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Starting AIS Integration...
                </>
              ) : (
                <>
                  <Satellite className="h-4 w-4 mr-2" />
                  Start Real Data Feed
                </>
              )}
            </Button>
          </div>
        )}

        <div className="text-xs text-slate-400">
          Real vessel data is provided by AISStream and updates every few seconds when active.
        </div>
      </CardContent>
    </Card>
  );
};

export default RealDataStatus;