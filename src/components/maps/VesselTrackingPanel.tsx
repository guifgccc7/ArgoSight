
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Ship, MapPin, Clock, Activity, AlertTriangle, Wifi } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface VesselData {
  id: string;
  mmsi: string;
  latitude: number;
  longitude: number;
  speed_knots: number;
  course_degrees: number;
  timestamp_utc: string;
  source_feed: string;
  vessel_name?: string;
  vessel_type?: string;
}

interface VesselTrackingPanelProps {
  selectedVessel?: string;
  onVesselSelect?: (vesselId: string) => void;
  focusMode?: 'all' | 'ghost' | 'arctic' | 'mediterranean';
}

const VesselTrackingPanel: React.FC<VesselTrackingPanelProps> = ({
  selectedVessel,
  onVesselSelect,
  focusMode = 'all'
}) => {
  const [vessels, setVessels] = useState<VesselData[]>([]);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    loadVesselData();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('vessel_positions_realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'vessel_positions'
        },
        (payload) => {
          console.log('Real-time vessel update:', payload.new);
          updateVesselInList(payload.new as VesselData);
          setLastUpdate(new Date().toISOString());
          setIsConnected(true);
        }
      )
      .subscribe();

    // Refresh data every minute
    const interval = setInterval(loadVesselData, 60000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, [focusMode]);

  const loadVesselData = async () => {
    try {
      // Get latest positions for each vessel in the last 2 hours
      const { data, error } = await supabase
        .from('vessel_positions')
        .select(`
          id, mmsi, latitude, longitude, speed_knots, course_degrees, 
          timestamp_utc, source_feed,
          vessels(vessel_name, vessel_type)
        `)
        .gte('timestamp_utc', new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString())
        .order('timestamp_utc', { ascending: false });

      if (error) {
        console.error('Error loading vessel data:', error);
        return;
      }

      // Get latest position for each MMSI
      const latestPositions = new Map<string, VesselData>();
      data?.forEach((position: any) => {
        const vesselData: VesselData = {
          id: position.id,
          mmsi: position.mmsi,
          latitude: position.latitude,
          longitude: position.longitude,
          speed_knots: position.speed_knots || 0,
          course_degrees: position.course_degrees || 0,
          timestamp_utc: position.timestamp_utc,
          source_feed: position.source_feed,
          vessel_name: position.vessels?.vessel_name,
          vessel_type: position.vessels?.vessel_type
        };

        if (!latestPositions.has(position.mmsi) || 
            new Date(position.timestamp_utc) > new Date(latestPositions.get(position.mmsi)!.timestamp_utc)) {
          latestPositions.set(position.mmsi, vesselData);
        }
      });

      let filteredVessels = Array.from(latestPositions.values());

      // Apply focus mode filters
      switch (focusMode) {
        case 'ghost':
          // Show vessels with old data or suspicious patterns
          filteredVessels = filteredVessels.filter(v => 
            Date.now() - new Date(v.timestamp_utc).getTime() > 30 * 60 * 1000 || // Older than 30 min
            v.speed_knots > 30 || // Unusually fast
            v.speed_knots < 0.1 // Stationary
          );
          break;
        case 'arctic':
          filteredVessels = filteredVessels.filter(v => v.latitude > 60);
          break;
        case 'mediterranean':
          filteredVessels = filteredVessels.filter(v => 
            v.latitude > 30 && v.latitude < 45 && v.longitude > -10 && v.longitude < 40
          );
          break;
      }

      setVessels(filteredVessels);
      setLastUpdate(new Date().toISOString());
      setIsConnected(true);

    } catch (error) {
      console.error('Error loading vessel data:', error);
      setIsConnected(false);
    }
  };

  const updateVesselInList = (newPosition: VesselData) => {
    setVessels(prev => {
      const updated = prev.filter(v => v.mmsi !== newPosition.mmsi);
      return [...updated, newPosition].sort((a, b) => 
        new Date(b.timestamp_utc).getTime() - new Date(a.timestamp_utc).getTime()
      );
    });
  };

  const getVesselStatus = (vessel: VesselData): 'active' | 'warning' | 'danger' | 'dark' => {
    const age = Date.now() - new Date(vessel.timestamp_utc).getTime();
    
    if (age > 2 * 60 * 60 * 1000) return 'dark'; // Older than 2 hours
    if (age > 30 * 60 * 1000) return 'warning'; // Older than 30 minutes
    if (vessel.speed_knots > 30) return 'danger'; // Unusually fast
    return 'active';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 border-green-400';
      case 'warning': return 'text-yellow-400 border-yellow-400';
      case 'danger': return 'text-red-400 border-red-400';
      case 'dark': return 'text-gray-400 border-gray-400';
      default: return 'text-slate-400 border-slate-400';
    }
  };

  const getVesselIcon = (status: string) => {
    if (status === 'dark') {
      return <AlertTriangle className="h-4 w-4 text-gray-400" />;
    }
    return <Ship className="h-4 w-4 text-cyan-400" />;
  };

  return (
    <Card className="bg-slate-800 border-slate-700 h-full">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-cyan-400" />
            <span>Live Vessel Tracking</span>
          </div>
          <div className="flex items-center space-x-2">
            <Wifi className={`h-4 w-4 ${isConnected ? 'text-green-400' : 'text-red-400'}`} />
            <Badge variant="outline" className="text-green-400 border-green-400">
              {vessels.length} VESSELS
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-xs text-slate-400">
            Last update: {lastUpdate ? new Date(lastUpdate).toLocaleTimeString() : 'Loading...'}
            <br />
            Source: {isConnected ? 'AISStream Live Data' : 'Disconnected'}
          </div>
          
          <ScrollArea className="h-96">
            <div className="space-y-2">
              {vessels.map((vessel) => {
                const status = getVesselStatus(vessel);
                return (
                  <div
                    key={vessel.mmsi}
                    className={`p-3 rounded-lg border transition-colors cursor-pointer ${
                      selectedVessel === vessel.mmsi 
                        ? 'bg-cyan-900/30 border-cyan-500' 
                        : 'bg-slate-900 border-slate-700 hover:border-slate-600'
                    }`}
                    onClick={() => onVesselSelect?.(vessel.mmsi)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getVesselIcon(status)}
                        <div>
                          <h4 className="text-white font-medium text-sm">
                            {vessel.vessel_name || `MMSI-${vessel.mmsi}`}
                          </h4>
                          <p className="text-xs text-slate-400 font-mono">{vessel.mmsi}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className={getStatusColor(status)}>
                        {status.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3 text-slate-400" />
                        <span className="text-slate-300">
                          {vessel.latitude.toFixed(2)}, {vessel.longitude.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Activity className="h-3 w-3 text-slate-400" />
                        <span className="text-slate-300">{vessel.speed_knots.toFixed(1)} kts</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3 text-slate-400" />
                        <span className="text-slate-300">
                          {new Date(vessel.timestamp_utc).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="text-slate-300">
                        {vessel.vessel_type || 'Unknown'}
                      </div>
                    </div>
                    
                    {status === 'dark' && (
                      <div className="mt-2 flex items-center space-x-1 text-xs text-red-400">
                        <AlertTriangle className="h-3 w-3" />
                        <span>Signal Lost</span>
                      </div>
                    )}

                    <div className="mt-2 text-xs text-slate-400">
                      Source: {vessel.source_feed}
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
          
          {vessels.length === 0 && (
            <div className="text-center py-8 text-slate-400">
              <Ship className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No vessels detected</p>
              <p className="text-xs">Waiting for AIS data...</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VesselTrackingPanel;
