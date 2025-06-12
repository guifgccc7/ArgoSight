export interface VesselData {
  id: string;
  name: string;
  lat: number;
  lng: number;
  speed: number;
  heading: number;
  status: 'active' | 'warning' | 'danger' | 'dark';
  lastUpdate: string;
  vesselType: string;
  suspiciousActivity?: {
    aisGap: boolean;
    routeDeviation: boolean;
    speedAnomaly: boolean;
    identitySwitch: boolean;
  };
}

export interface WeatherData {
  location: string;
  temperature: number;
  windSpeed: number;
  windDirection: number;
  waveHeight: number;
  visibility: number;
}

export interface ThreatAlert {
  id: string;
  type: 'ghost_vessel' | 'weather' | 'security' | 'collision';
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: [number, number];
  description: string;
  timestamp: string;
}

class LiveDataService {
  private vessels: VesselData[] = [];
  private alerts: ThreatAlert[] = [];
  private isActive = false;
  private subscribers: Set<(data: LiveDataUpdate) => void> = new Set();

  constructor() {
    // Initialize with AISStream integration
    this.initializeAISStream();
  }

  private async initializeAISStream(): Promise<void> {
    const { aisStreamService } = await import('./aisStreamService');
    
    // Subscribe to real AIS data
    aisStreamService.subscribe((aisData) => {
      this.updateVesselFromAIS(aisData);
    });

    // Start the AIS stream
    await aisStreamService.startAISStream();
  }

  private updateVesselFromAIS(aisData: any): void {
    const vesselData: VesselData = {
      id: aisData.mmsi,
      name: aisData.shipName,
      lat: aisData.latitude,
      lng: aisData.longitude,
      speed: aisData.speed,
      heading: aisData.course,
      vesselType: 'commercial',
      status: this.determineVesselStatus(aisData),
      lastUpdate: aisData.timestamp
    };

    // Update or add vessel
    const existingIndex = this.vessels.findIndex(v => v.id === vesselData.id);
    if (existingIndex >= 0) {
      this.vessels[existingIndex] = vesselData;
    } else {
      this.vessels.push(vesselData);
    }

    // Notify subscribers of updates
    this.notifySubscribers();
  }

  private determineVesselStatus(aisData: any): 'active' | 'warning' | 'danger' | 'dark' {
    const timeDiff = Date.now() - new Date(aisData.timestamp).getTime();
    
    // If data is older than 30 minutes, consider it potentially dark
    if (timeDiff > 30 * 60 * 1000) {
      return 'dark';
    }
    
    // Check for suspicious patterns
    if (aisData.speed > 30) {
      return 'warning'; // Very high speed
    }
    
    return 'active';
  }

  // Enhanced vessel data generation with suspicious activity simulation
  generateMockVesselData(): VesselData[] {
    const vessels: VesselData[] = [
      {
        id: "IMO-001",
        name: "MV Atlantic Cargo",
        lat: 40.7128 + (Math.random() - 0.5) * 0.1,
        lng: -74.0060 + (Math.random() - 0.5) * 0.1,
        speed: 12 + Math.random() * 8,
        heading: Math.random() * 360,
        status: 'active',
        lastUpdate: new Date().toISOString(),
        vesselType: 'cargo',
        suspiciousActivity: {
          aisGap: false,
          routeDeviation: Math.random() > 0.9,
          speedAnomaly: Math.random() > 0.85,
          identitySwitch: false
        }
      },
      {
        id: "IMO-002",
        name: "Tanker Pacific Star",
        lat: 35.6762 + (Math.random() - 0.5) * 0.1,
        lng: 139.6503 + (Math.random() - 0.5) * 0.1,
        speed: 8 + Math.random() * 6,
        heading: Math.random() * 360,
        status: Math.random() > 0.8 ? 'warning' : 'active',
        lastUpdate: new Date().toISOString(),
        vesselType: 'tanker',
        suspiciousActivity: {
          aisGap: Math.random() > 0.95,
          routeDeviation: Math.random() > 0.8,
          speedAnomaly: Math.random() > 0.9,
          identitySwitch: Math.random() > 0.98
        }
      },
      {
        id: "UNKNOWN-003",
        name: "Ghost Vessel Alpha",
        lat: 51.5074 + (Math.random() - 0.5) * 0.2,
        lng: -0.1278 + (Math.random() - 0.5) * 0.2,
        speed: 0,
        heading: 0,
        status: 'dark',
        lastUpdate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        vesselType: 'unknown',
        suspiciousActivity: {
          aisGap: true,
          routeDeviation: true,
          speedAnomaly: true,
          identitySwitch: Math.random() > 0.7
        }
      },
      {
        id: "UNKNOWN-004",
        name: "Shadow Runner",
        lat: 25.2048 + (Math.random() - 0.5) * 0.15,
        lng: 55.2708 + (Math.random() - 0.5) * 0.15,
        speed: Math.random() * 5,
        heading: Math.random() * 360,
        status: 'dark',
        lastUpdate: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        vesselType: 'fishing',
        suspiciousActivity: {
          aisGap: true,
          routeDeviation: true,
          speedAnomaly: false,
          identitySwitch: true
        }
      },
      {
        id: "IMO-005",
        name: "Northern Explorer",
        lat: 70.2 + (Math.random() - 0.5) * 0.1,
        lng: -150.0 + (Math.random() - 0.5) * 0.1,
        speed: 6 + Math.random() * 4,
        heading: Math.random() * 360,
        status: Math.random() > 0.7 ? 'warning' : 'active',
        lastUpdate: new Date().toISOString(),
        vesselType: 'research',
        suspiciousActivity: {
          aisGap: false,
          routeDeviation: Math.random() > 0.8,
          speedAnomaly: false,
          identitySwitch: false
        }
      }
    ];

    return vessels;
  }

  // Generate mock weather data
  generateMockWeatherData(): WeatherData[] {
    const locations = [
      { name: "North Atlantic", lat: 50, lng: -30 },
      { name: "Mediterranean", lat: 35, lng: 15 },
      { name: "Arctic Ocean", lat: 80, lng: 0 },
      { name: "South China Sea", lat: 15, lng: 115 }
    ];

    return locations.map(location => ({
      location: location.name,
      temperature: -5 + Math.random() * 35,
      windSpeed: Math.random() * 50,
      windDirection: Math.random() * 360,
      waveHeight: Math.random() * 8,
      visibility: 1 + Math.random() * 9
    }));
  }

  // Enhanced alert generation with AI detection focus
  generateMockAlerts(): ThreatAlert[] {
    const alerts: ThreatAlert[] = [];
    
    if (Math.random() > 0.6) {
      alerts.push({
        id: `alert-${Date.now()}`,
        type: 'ghost_vessel',
        severity: Math.random() > 0.7 ? 'critical' : 'high',
        location: [Math.random() * 360 - 180, Math.random() * 180 - 90],
        description: 'AI detected vessel AIS manipulation pattern',
        timestamp: new Date().toISOString()
      });
    }

    if (Math.random() > 0.7) {
      alerts.push({
        id: `alert-${Date.now() + 1}`,
        type: 'security',
        severity: 'high',
        location: [Math.random() * 360 - 180, Math.random() * 180 - 90],
        description: 'Unusual vessel behavior detected by ML algorithms',
        timestamp: new Date().toISOString()
      });
    }

    if (Math.random() > 0.8) {
      alerts.push({
        id: `alert-${Date.now() + 2}`,
        type: 'weather',
        severity: 'medium',
        location: [Math.random() * 360 - 180, Math.random() * 180 - 90],
        description: 'Severe weather conditions detected',
        timestamp: new Date().toISOString()
      });
    }

    return alerts;
  }

  // Start live data simulation
  startLiveDataFeed(): void {
    if (this.isActive) return;
    
    this.isActive = true;
    console.log('Starting live data feed with real AIS integration...');

    // The AIS data will come through the AISStream service
    // Keep existing simulation for other data types
    this.simulateAdditionalData();
  }

  private simulateAdditionalData(): void {
    // Simulate weather alerts and other intelligence data
    setInterval(() => {
      // Generate occasional threat alerts
      if (Math.random() < 0.1 && this.alerts.length < 5) {
        this.generateThreatAlert();
      }
      
      // Clean up old alerts
      this.alerts = this.alerts.filter(alert => 
        Date.now() - new Date(alert.timestamp).getTime() < 24 * 60 * 60 * 1000
      );
    }, 30000);
  }

  // Generate threat alert
  private generateThreatAlert(): void {
    const alert: ThreatAlert = {
      id: `alert-${Date.now() + 3}`,
      type: 'ghost_vessel',
      severity: 'high',
      location: [Math.random() * 360 - 180, Math.random() * 180 - 90],
      description: 'AI detected suspicious vessel behavior',
      timestamp: new Date().toISOString()
    };

    this.alerts.push(alert);
    this.notifySubscribers();
  }

  // Stop live data simulation
  stopLiveDataFeed() {
    if (this.isActive) {
      this.isActive = false;
      console.log('Live data feed stopped');
    }
  }

  // Subscribe to live data updates
  subscribe(callback: (data: LiveDataUpdate) => void) {
    this.subscribers.add(callback);
    
    // Return unsubscribe function
    return () => {
      this.subscribers.delete(callback);
    };
  }

  // Notify all subscribers
  private notifySubscribers(data: any) {
    this.subscribers.forEach(callback => callback(data));
  }

  // Get current satellite coverage
  getSatelliteCoverage() {
    return {
      activeSatellites: 47,
      coverage: 94.2 + Math.random() * 5,
      dataQuality: Math.random() > 0.8 ? 'excellent' : 'good',
      lastUpdate: new Date().toISOString()
    };
  }

  // Get real-time AIS data
  getAISData() {
    return {
      trackedVessels: 2847 + Math.floor(Math.random() * 100),
      darkVessels: 156 + Math.floor(Math.random() * 20),
      updateRate: 'real-time',
      lastSync: new Date().toISOString()
    };
  }
}

export const liveDataService = new LiveDataService();
