
export interface DataSource {
  id: string;
  name: string;
  type: 'ais' | 'satellite' | 'radar' | 'social' | 'weather';
  status: 'active' | 'inactive' | 'error';
  reliability: number; // 0-1 score
  lastUpdate: string;
  latency: number; // milliseconds
}

export interface ProcessingMetrics {
  throughput: number; // records per second
  latency: number; // average processing time
  errorRate: number; // percentage
  queueSize: number;
  activeConnections: number;
}

export interface FusedVesselData {
  speed: number;
  course: number;
  lat: number;
  lng: number;
  vesselType: string;
  timestamp: string;
  aisSignalStrength: number;
  sources: string[];
  confidence: number;
  reliability: number;
  fusedAt: string;
}
