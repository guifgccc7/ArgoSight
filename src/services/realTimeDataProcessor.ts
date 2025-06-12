
import { mlAnalysisService, VesselDataPoint } from './mlAnalysisService';
import { enhancedPatternService } from './enhancedPatternService';
import { alertsService } from './alertsService';

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

export interface FusedVesselData extends VesselDataPoint {
  sources: string[];
  confidence: number;
  reliability: number;
  fusedAt: string;
}

class RealTimeDataProcessor {
  private dataSources: Map<string, DataSource> = new Map();
  private processingQueue: VesselDataPoint[] = [];
  private isProcessing = false;
  private metrics: ProcessingMetrics = {
    throughput: 0,
    latency: 0,
    errorRate: 0,
    queueSize: 0,
    activeConnections: 0
  };
  private subscribers: Set<(data: FusedVesselData) => void> = new Set();
  private metricsSubscribers: Set<(metrics: ProcessingMetrics) => void> = new Set();

  constructor() {
    this.initializeDataSources();
    this.startProcessing();
    this.startMetricsCollection();
  }

  private initializeDataSources() {
    const sources: DataSource[] = [
      {
        id: 'live-ais',
        name: 'Live AIS Feed',
        type: 'ais',
        status: 'active',
        reliability: 0.95,
        lastUpdate: new Date().toISOString(),
        latency: 150
      },
      {
        id: 'satellite-feed',
        name: 'Satellite Data Stream',
        type: 'satellite',
        status: 'active',
        reliability: 0.88,
        lastUpdate: new Date().toISOString(),
        latency: 300
      },
      {
        id: 'coastal-radar',
        name: 'Coastal Radar Network',
        type: 'radar',
        status: 'active',
        reliability: 0.92,
        lastUpdate: new Date().toISOString(),
        latency: 80
      },
      {
        id: 'weather-data',
        name: 'Weather Intelligence',
        type: 'weather',
        status: 'active',
        reliability: 0.85,
        lastUpdate: new Date().toISOString(),
        latency: 200
      }
    ];

    sources.forEach(source => {
      this.dataSources.set(source.id, source);
    });
  }

  async processVesselData(data: VesselDataPoint, sourceId: string): Promise<void> {
    const startTime = Date.now();
    
    try {
      // Add to processing queue
      this.processingQueue.push(data);
      this.updateMetrics('queueSize', this.processingQueue.length);

      // Perform ML analysis
      const mlAnalysis = await mlAnalysisService.analyzeVesselBehavior(data);

      // Get enhanced patterns
      const patterns = await enhancedPatternService.analyzeVesselWithML({
        id: data.vesselType + '-' + Date.now(),
        ...data
      });

      // Create fused data object
      const fusedData: FusedVesselData = {
        ...data,
        sources: [sourceId],
        confidence: mlAnalysis.confidence,
        reliability: this.dataSources.get(sourceId)?.reliability || 0.5,
        fusedAt: new Date().toISOString()
      };

      // Check for critical alerts
      if (mlAnalysis.anomalyScore > 80 || patterns.some(p => p.severity === 'critical')) {
        await this.triggerAlert(fusedData, mlAnalysis, patterns);
      }

      // Notify subscribers
      this.notifySubscribers(fusedData);

      // Update processing metrics
      const processingTime = Date.now() - startTime;
      this.updateLatency(processingTime);
      this.updateThroughput();

    } catch (error) {
      console.error('Error processing vessel data:', error);
      this.updateErrorRate();
    } finally {
      this.processingQueue.shift();
      this.updateMetrics('queueSize', this.processingQueue.length);
    }
  }

  private async triggerAlert(
    vesselData: FusedVesselData, 
    mlAnalysis: any, 
    patterns: any[]
  ): Promise<void> {
    const criticalPatterns = patterns.filter(p => p.severity === 'critical');
    
    if (criticalPatterns.length > 0 || mlAnalysis.anomalyScore > 90) {
      const alert = {
        id: `RT-${Date.now()}`,
        type: 'ghost_vessel' as const,
        severity: 'critical' as const,
        title: `Real-time Threat Detection: ${vesselData.vesselType}`,
        description: `High-confidence threat detected with ${mlAnalysis.anomalyScore.toFixed(1)}% anomaly score`,
        location: {
          lat: vesselData.lat,
          lng: vesselData.lng,
          name: `${vesselData.lat.toFixed(2)}, ${vesselData.lng.toFixed(2)}`
        },
        timestamp: new Date().toISOString(),
        status: 'new' as const,
        source: 'ai_detection' as const,
        metadata: {
          confidence: mlAnalysis.confidence,
          anomalyScore: mlAnalysis.anomalyScore,
          sources: vesselData.sources,
          reliability: vesselData.reliability
        }
      };

      alertsService.addAlert(alert);
    }
  }

  private startProcessing(): void {
    setInterval(() => {
      if (!this.isProcessing && this.processingQueue.length > 0) {
        this.isProcessing = true;
        // Process queue in batches
        const batch = this.processingQueue.splice(0, 10);
        Promise.all(
          batch.map(data => this.processVesselData(data, 'live-ais'))
        ).finally(() => {
          this.isProcessing = false;
        });
      }
    }, 1000);
  }

  private startMetricsCollection(): void {
    setInterval(() => {
      this.collectMetrics();
      this.notifyMetricsSubscribers();
    }, 5000);
  }

  private collectMetrics(): void {
    this.metrics.activeConnections = this.dataSources.size;
    this.metrics.queueSize = this.processingQueue.length;
    
    // Simulate realistic metrics
    this.metrics.throughput = 25 + Math.random() * 10;
    this.metrics.latency = 150 + Math.random() * 100;
    this.metrics.errorRate = Math.random() * 2;
  }

  private updateLatency(latency: number): void {
    this.metrics.latency = (this.metrics.latency * 0.9) + (latency * 0.1);
  }

  private updateThroughput(): void {
    this.metrics.throughput = Math.max(0, this.metrics.throughput + (Math.random() - 0.5));
  }

  private updateErrorRate(): void {
    this.metrics.errorRate = Math.min(10, this.metrics.errorRate + 0.1);
  }

  private updateMetrics(key: keyof ProcessingMetrics, value: number): void {
    this.metrics[key] = value;
  }

  private notifySubscribers(data: FusedVesselData): void {
    this.subscribers.forEach(callback => callback(data));
  }

  private notifyMetricsSubscribers(): void {
    this.metricsSubscribers.forEach(callback => callback(this.metrics));
  }

  // Public API
  subscribe(callback: (data: FusedVesselData) => void): () => void {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  subscribeToMetrics(callback: (metrics: ProcessingMetrics) => void): () => void {
    this.metricsSubscribers.add(callback);
    return () => this.metricsSubscribers.delete(callback);
  }

  getDataSources(): DataSource[] {
    return Array.from(this.dataSources.values());
  }

  getMetrics(): ProcessingMetrics {
    return { ...this.metrics };
  }

  simulateLiveData(): void {
    setInterval(() => {
      const mockVessel: VesselDataPoint = {
        speed: Math.random() * 30,
        course: Math.random() * 360,
        lat: 40 + (Math.random() - 0.5) * 20,
        lng: -70 + (Math.random() - 0.5) * 40,
        vesselType: ['cargo', 'tanker', 'fishing', 'container'][Math.floor(Math.random() * 4)],
        timestamp: new Date().toISOString(),
        aisSignalStrength: Math.random()
      };

      this.processVesselData(mockVessel, 'live-ais');
    }, 3000);
  }
}

export const realTimeDataProcessor = new RealTimeDataProcessor();
