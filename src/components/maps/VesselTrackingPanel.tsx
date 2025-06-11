
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Ship, MapPin, Clock, Activity, AlertTriangle } from 'lucide-react';
import { liveDataService, VesselData } from '@/services/liveDataService';

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

  useEffect(() => {
    const unsubscribe = liveDataService.subscribe((data) => {
      if (data.vessels) {
        let filteredVessels = data.vessels;
        
        // Filter based on focus mode
        switch (focusMode) {
          case 'ghost':
            filteredVessels = data.vessels.filter((v: VesselData) => 
              v.status === 'dark' || v.vesselType === 'unknown'
            );
            break;
          case 'arctic':
            filteredVessels = data.vessels.filter((v: VesselData) => v.lat > 60);
            break;
          case 'mediterranean':
            filteredVessels = data.vessels.filter((v: VesselData) => 
              v.lat > 30 && v.lat < 45 && v.lng > -10 && v.lng < 40
            );
            break;
        }
        
        setVessels(filteredVessels);
        setLastUpdate(data.timestamp);
      }
    });

    liveDataService.startLiveDataFeed();

    return () => unsubscribe();
  }, [focusMode]);

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
          <Badge variant="outline" className="text-green-400 border-green-400">
            {vessels.length} VESSELS
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-xs text-slate-400">
            Last update: {lastUpdate ? new Date(lastUpdate).toLocaleTimeString() : 'Loading...'}
          </div>
          
          <ScrollArea className="h-96">
            <div className="space-y-2">
              {vessels.map((vessel) => (
                <div
                  key={vessel.id}
                  className={`p-3 rounded-lg border transition-colors cursor-pointer ${
                    selectedVessel === vessel.id 
                      ? 'bg-cyan-900/30 border-cyan-500' 
                      : 'bg-slate-900 border-slate-700 hover:border-slate-600'
                  }`}
                  onClick={() => onVesselSelect?.(vessel.id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getVesselIcon(vessel.status)}
                      <div>
                        <h4 className="text-white font-medium text-sm">{vessel.name}</h4>
                        <p className="text-xs text-slate-400 font-mono">{vessel.id}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className={getStatusColor(vessel.status)}>
                      {vessel.status.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3 text-slate-400" />
                      <span className="text-slate-300">
                        {vessel.lat.toFixed(2)}, {vessel.lng.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Activity className="h-3 w-3 text-slate-400" />
                      <span className="text-slate-300">{vessel.speed.toFixed(1)} kts</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3 text-slate-400" />
                      <span className="text-slate-300">
                        {new Date(vessel.lastUpdate).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="text-slate-300">
                      {vessel.vesselType}
                    </div>
                  </div>
                  
                  {vessel.status === 'dark' && (
                    <div className="mt-2 flex items-center space-x-1 text-xs text-red-400">
                      <AlertTriangle className="h-3 w-3" />
                      <span>AIS Signal Lost</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
          
          {vessels.length === 0 && (
            <div className="text-center py-8 text-slate-400">
              <Ship className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No vessels detected in this area</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VesselTrackingPanel;
