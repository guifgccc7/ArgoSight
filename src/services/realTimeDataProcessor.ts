
import { mlAnalysisService, VesselDataPoint } from './mlAnalysisService';
import { supabase } from '@/integrations/supabase/client';
import { DataSource, ProcessingMetrics, FusedVesselData } from './realtime/types';
import { MetricsCollector } from './realtime/metricsCollector';
import { DataSourceManager } from './realtime/dataSourceManager';
import { DataProcessor } from './realtime/dataProcessor';

class RealTimeDataProcessor {
  private processingQueue: VesselDataPoint[] = [];
  private isProcessing = false;
  private metricsCollector: MetricsCollector;
  private dataSourceManager: DataSourceManager;
  private dataProcessor: DataProcessor;

  constructor() {
    this.metricsCollector = new MetricsCollector();
    this.dataSourceManager = new DataSourceManager();
    this.dataProcessor = new DataProcessor();
    this.startProcessing();
    this.startRealTimeDataListener();
  }

  private startRealTimeDataListener(): void {
    // Listen to real-time vessel position updates
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
          console.log('Real-time vessel position received:', payload);
          this.processRealVesselData(payload.new);
        }
      )
      .subscribe();

    console.log('Started listening for real-time vessel position updates');
  }

  private async processRealVesselData(position: any): Promise<void> {
    const vesselData: VesselDataPoint = {
      speed: position.speed_knots || 0,
      course: position.course_degrees || 0,
      lat: position.latitude,
      lng: position.longitude,
      vesselType: 'unknown',
      timestamp: position.timestamp_utc,
      aisSignalStrength: position.data_quality_score || 1.0
    };

    await this.processVesselData(vesselData, position.source_feed || 'aisstream');
  }

  async processVesselData(data: VesselDataPoint, sourceId: string): Promise<void> {
    const startTime = Date.now();
    
    try {
      // Add to processing queue
      this.processingQueue.push(data);
      this.metricsCollector.updateQueueSize(this.processingQueue.length);

      // Process the data
      await this.dataProcessor.processVesselData(data, sourceId);

      // Update processing metrics
      const processingTime = Date.now() - startTime;
      this.metricsCollector.updateLatency(processingTime);

    } catch (error) {
      console.error('Error processing vessel data:', error);
      this.metricsCollector.updateErrorRate();
    } finally {
      this.processingQueue.shift();
      this.metricsCollector.updateQueueSize(this.processingQueue.length);
    }
  }

  private startProcessing(): void {
    setInterval(() => {
      if (!this.isProcessing && this.processingQueue.length > 0) {
        this.isProcessing = true;
        // Process queue in batches
        const batch = this.processingQueue.splice(0, 10);
        Promise.all(
          batch.map(data => this.processVesselData(data, 'realtime'))
        ).finally(() => {
          this.isProcessing = false;
        });
      }
    }, 1000);
  }

  // Public API
  subscribe(callback: (data: FusedVesselData) => void): () => void {
    return this.dataProcessor.subscribe(callback);
  }

  subscribeToMetrics(callback: (metrics: ProcessingMetrics) => void): () => void {
    return this.metricsCollector.subscribeToMetrics(callback);
  }

  getDataSources(): DataSource[] {
    return this.dataSourceManager.getDataSources();
  }

  getMetrics(): ProcessingMetrics {
    return this.metricsCollector.getMetrics();
  }
}

export const realTimeDataProcessor = new RealTimeDataProcessor();
export type { DataSource, ProcessingMetrics, FusedVesselData };
