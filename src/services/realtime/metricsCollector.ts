
import { ProcessingMetrics } from './types';
import { supabase } from '@/integrations/supabase/client';

export class MetricsCollector {
  private metrics: ProcessingMetrics = {
    throughput: 0,
    latency: 0,
    errorRate: 0,
    queueSize: 0,
    activeConnections: 0
  };

  private metricsSubscribers: Set<(metrics: ProcessingMetrics) => void> = new Set();

  constructor() {
    this.startMetricsCollection();
  }

  private startMetricsCollection(): void {
    setInterval(async () => {
      await this.collectRealMetrics();
      this.notifyMetricsSubscribers();
    }, 5000);
  }

  private async collectRealMetrics(): Promise<void> {
    try {
      // Get real metrics from database
      const { data: recentPositions } = await supabase
        .from('vessel_positions')
        .select('*')
        .gte('created_at', new Date(Date.now() - 60000).toISOString()); // Last minute

      const { data: recentErrors } = await supabase
        .from('api_integration_logs')
        .select('*')
        .gte('timestamp_utc', new Date(Date.now() - 60000).toISOString())
        .gte('status_code', 400);

      this.metrics.throughput = recentPositions?.length || 0;
      this.metrics.errorRate = recentErrors?.length || 0;
      this.metrics.activeConnections = 2; // AIS and Weather feeds
      
    } catch (error) {
      console.error('Error collecting real metrics:', error);
    }
  }

  updateLatency(latency: number): void {
    this.metrics.latency = (this.metrics.latency * 0.9) + (latency * 0.1);
  }

  updateQueueSize(size: number): void {
    this.metrics.queueSize = size;
  }

  updateErrorRate(): void {
    // Error rate is calculated from real data in collectRealMetrics
  }

  getMetrics(): ProcessingMetrics {
    return { ...this.metrics };
  }

  subscribeToMetrics(callback: (metrics: ProcessingMetrics) => void): () => void {
    this.metricsSubscribers.add(callback);
    return () => this.metricsSubscribers.delete(callback);
  }

  private notifyMetricsSubscribers(): void {
    this.metricsSubscribers.forEach(callback => callback(this.metrics));
  }
}
