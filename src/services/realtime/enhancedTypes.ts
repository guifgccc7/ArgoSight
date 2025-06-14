
export interface StreamProcessingMetrics {
  throughputPerSecond: number;
  avgLatencyMs: number;
  errorRate: number;
  queueDepth: number;
  processedToday: number;
  anomaliesDetected: number;
  predictionsGenerated: number;
}

export interface ProcessingPipeline {
  id: string;
  name: string;
  enabled: boolean;
  priority: number;
  processingTimeMs: number;
  successRate: number;
}

export interface RealTimeInsight {
  id: string;
  type: 'anomaly' | 'prediction' | 'pattern' | 'alert';
  title: string;
  description: string;
  confidence: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  vesselId?: string;
  location?: [number, number];
  metadata: any;
}
