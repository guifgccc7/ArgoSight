
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { 
  Smartphone, 
  Wifi, 
  WifiOff, 
  Download, 
  Bell, 
  Navigation,
  Battery,
  MapPin,
  Satellite,
  Shield
} from "lucide-react";

interface MobileUnit {
  id: string;
  name: string;
  type: 'patrol_boat' | 'helicopter' | 'ground_team' | 'coast_guard';
  status: 'active' | 'standby' | 'offline';
  location: { lat: number; lng: number };
  batteryLevel: number;
  connectivity: 'online' | 'offline' | 'limited';
  lastUpdate: string;
  assignedMission?: string;
}

interface OfflineCapability {
  id: string;
  name: string;
  status: 'available' | 'syncing' | 'unavailable';
  dataSize: string;
  lastSync: string;
  enabled: boolean;
}

const MobileOperationsCenter: React.FC = () => {
  const [mobileUnits, setMobileUnits] = useState<MobileUnit[]>([]);
  const [offlineCapabilities, setOfflineCapabilities] = useState<OfflineCapability[]>([]);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [gpsTracking, setGpsTracking] = useState(true);

  useEffect(() => {
    // Initialize mobile units
    const initUnits: MobileUnit[] = [
      {
        id: 'pb-001',
        name: 'Patrol Boat Alpha',
        type: 'patrol_boat',
        status: 'active',
        location: { lat: 59.3293, lng: 18.0686 },
        batteryLevel: 87,
        connectivity: 'online',
        lastUpdate: '2024-01-15T10:45:23Z',
        assignedMission: 'Border patrol - Sector 7'
      },
      {
        id: 'heli-002',
        name: 'Air Unit Bravo',
        type: 'helicopter',
        status: 'active',
        location: { lat: 60.1699, lng: 24.9384 },
        batteryLevel: 65,
        connectivity: 'limited',
        lastUpdate: '2024-01-15T10:40:15Z',
        assignedMission: 'Surveillance sweep'
      },
      {
        id: 'gt-003',
        name: 'Ground Team Charlie',
        type: 'ground_team',
        status: 'standby',
        location: { lat: 55.6761, lng: 12.5683 },
        batteryLevel: 92,
        connectivity: 'online',
        lastUpdate: '2024-01-15T10:30:45Z'
      },
      {
        id: 'cg-004',
        name: 'Coast Guard Delta',
        type: 'coast_guard',
        status: 'offline',
        location: { lat: 63.7467, lng: 20.2639 },
        batteryLevel: 23,
        connectivity: 'offline',
        lastUpdate: '2024-01-15T09:15:30Z'
      }
    ];

    const initOfflineCapabilities: OfflineCapability[] = [
      {
        id: 'vessel-db',
        name: 'Vessel Database',
        status: 'available',
        dataSize: '245 MB',
        lastSync: '2024-01-15T08:00:00Z',
        enabled: true
      },
      {
        id: 'maps-baltic',
        name: 'Baltic Sea Maps',
        status: 'available',
        dataSize: '1.2 GB',
        lastSync: '2024-01-15T06:00:00Z',
        enabled: true
      },
      {
        id: 'threat-intel',
        name: 'Threat Intelligence',
        status: 'syncing',
        dataSize: '89 MB',
        lastSync: '2024-01-15T10:30:00Z',
        enabled: true
      },
      {
        id: 'weather-data',
        name: 'Weather Forecasts',
        status: 'available',
        dataSize: '56 MB',
        lastSync: '2024-01-15T10:00:00Z',
        enabled: false
      }
    ];

    setMobileUnits(initUnits);
    setOfflineCapabilities(initOfflineCapabilities);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 border-green-400';
      case 'standby': return 'text-yellow-400 border-yellow-400';
      case 'offline': return 'text-red-400 border-red-400';
      default: return 'text-slate-400 border-slate-400';
    }
  };

  const getConnectivityIcon = (connectivity: string) => {
    switch (connectivity) {
      case 'online': return Wifi;
      case 'limited': return Satellite;
      case 'offline': return WifiOff;
      default: return WifiOff;
    }
  };

  const getConnectivityColor = (connectivity: string) => {
    switch (connectivity) {
      case 'online': return 'text-green-400';
      case 'limited': return 'text-yellow-400';
      case 'offline': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const toggleOfflineCapability = (capabilityId: string) => {
    setOfflineCapabilities(prev => prev.map(cap => 
      cap.id === capabilityId 
        ? { ...cap, enabled: !cap.enabled }
        : cap
    ));
  };

  const syncOfflineData = (capabilityId: string) => {
    setOfflineCapabilities(prev => prev.map(cap => 
      cap.id === capabilityId 
        ? { ...cap, status: 'syncing' as const }
        : cap
    ));

    // Simulate sync process
    setTimeout(() => {
      setOfflineCapabilities(prev => prev.map(cap => 
        cap.id === capabilityId 
          ? { 
              ...cap, 
              status: 'available' as const,
              lastSync: new Date().toISOString()
            }
          : cap
      ));
    }, 3000);
  };

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <span className="flex items-center space-x-2">
            <Smartphone className="h-5 w-5 text-green-400" />
            <span>Mobile Operations Center</span>
          </span>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-green-400 border-green-400">
              {mobileUnits.filter(u => u.status === 'active').length} ACTIVE
            </Badge>
            <Badge variant="outline" className="text-blue-400 border-blue-400">
              {mobileUnits.filter(u => u.connectivity === 'online').length} ONLINE
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Mobile Units Status */}
        <div>
          <h3 className="text-white font-medium mb-3">Field Units</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {mobileUnits.map(unit => {
              const ConnectivityIcon = getConnectivityIcon(unit.connectivity);
              return (
                <div key={unit.id} className="bg-slate-900 p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="text-white font-medium text-sm">{unit.name}</h4>
                      <p className="text-xs text-slate-400">{unit.type.replace('_', ' ')}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className={getStatusColor(unit.status)}>
                        {unit.status.toUpperCase()}
                      </Badge>
                      <ConnectivityIcon className={`h-4 w-4 ${getConnectivityColor(unit.connectivity)}`} />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                    <div className="flex items-center space-x-1">
                      <Battery className="h-3 w-3 text-slate-400" />
                      <span className="text-white">{unit.batteryLevel}%</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3 text-slate-400" />
                      <span className="text-white">
                        {unit.location.lat.toFixed(2)}, {unit.location.lng.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  
                  {unit.assignedMission && (
                    <div className="text-xs text-slate-300 bg-slate-800 p-2 rounded">
                      Mission: {unit.assignedMission}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Settings */}
        <div>
          <h3 className="text-white font-medium mb-3">Mobile Settings</h3>
          <div className="bg-slate-900 p-4 rounded-lg space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-white font-medium">Push Notifications</span>
                <p className="text-sm text-slate-400">Receive critical alerts on mobile devices</p>
              </div>
              <Switch
                checked={pushNotifications}
                onCheckedChange={setPushNotifications}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <span className="text-white font-medium">GPS Tracking</span>
                <p className="text-sm text-slate-400">Track field unit locations in real-time</p>
              </div>
              <Switch
                checked={gpsTracking}
                onCheckedChange={setGpsTracking}
              />
            </div>
          </div>
        </div>

        {/* Offline Capabilities */}
        <div>
          <h3 className="text-white font-medium mb-3">Offline Data Management</h3>
          <div className="space-y-3">
            {offlineCapabilities.map(capability => (
              <div key={capability.id} className="bg-slate-900 p-3 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <Switch
                      checked={capability.enabled}
                      onCheckedChange={() => toggleOfflineCapability(capability.id)}
                    />
                    <div>
                      <span className="text-white font-medium text-sm">{capability.name}</span>
                      <p className="text-xs text-slate-400">
                        {capability.dataSize} • Last sync: {new Date(capability.lastSync).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        capability.status === 'available' ? 'text-green-400 border-green-400' :
                        capability.status === 'syncing' ? 'text-yellow-400 border-yellow-400' :
                        'text-red-400 border-red-400'
                      }`}
                    >
                      {capability.status.toUpperCase()}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => syncOfflineData(capability.id)}
                      disabled={capability.status === 'syncing'}
                      className="text-xs px-2 py-1"
                    >
                      <Download className={`h-3 w-3 ${capability.status === 'syncing' ? 'animate-bounce' : ''}`} />
                    </Button>
                  </div>
                </div>
                {capability.status === 'syncing' && (
                  <Progress value={65} className="h-1 mt-2" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* PWA Features */}
        <div>
          <h3 className="text-white font-medium mb-3">Progressive Web App Features</h3>
          <div className="bg-slate-900 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-green-400" />
                <span className="text-white">Offline Mode Ready</span>
              </div>
              <div className="flex items-center space-x-2">
                <Bell className="h-4 w-4 text-blue-400" />
                <span className="text-white">Push Notifications</span>
              </div>
              <div className="flex items-center space-x-2">
                <Download className="h-4 w-4 text-purple-400" />
                <span className="text-white">App Install Prompt</span>
              </div>
              <div className="flex items-center space-x-2">
                <Navigation className="h-4 w-4 text-cyan-400" />
                <span className="text-white">Background Sync</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MobileOperationsCenter;
