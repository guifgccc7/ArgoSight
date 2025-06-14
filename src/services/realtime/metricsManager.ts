
import { StreamProcessingMetrics } from './enhancedTypes';

export class MetricsManager {
  private processingMetrics: StreamProcessingMetrics = {
    throughputPerSecond: 0,
    avgLatencyMs: 0,
    errorRate: 0,
    queueDepth: 0,
    processedToday: 0,
    anomaliesDetected: 0,
    predictionsGenerated: 0
  };

  private metricsSubscribers: Set<(metrics: StreamProcessingMetrics) => void> = new Set();

  constructor() {
    this.startMetricsUpdates();
  }

  updateProcessingMetrics(processingTime: number, success: boolean): void {
    // Update latency (moving average)
    this.processingMetrics.avgLatencyMs = 
      (this.processingMetrics.avgLatencyMs * 0.9) + (processingTime * 0.1);

    // Update throughput
    this.processingMetrics.throughputPerSecond = 
      Math.max(0, this.processingMetrics.throughputPerSecond + (Math.random() - 0.5));

    // Update error rate
    if (!success) {
      this.processingMetrics.errorRate = 
        Math.min(10, this.processingMetrics.errorRate + 0.1);
    } else {
      this.processingMetrics.errorRate = 
        Math.max(0, this.processingMetrics.errorRate - 0.01);
    }

    this.processingMetrics.processedToday++;
  }

  incrementAnomaliesDetected(): void {
    this.processingMetrics.anomaliesDetected++;
  }

  incrementPredictionsGenerated(): void {
    this.processingMetrics.predictionsGenerated++;
  }

  getProcessingMetrics(): StreamProcessingMetrics {
    return { ...this.processingMetrics };
  }

  subscribeToMetrics(callback: (metrics: StreamProcessingMetrics) => void): () => void {
    this.metricsSubscribers.add(callback);
    return () => this.metricsSubscribers.delete(callback);
  }

  private notifyMetricsSubscribers(): void {
    this.metricsSubscribers.forEach(callback => callback(this.processingMetrics));
  }

  private startMetricsUpdates(): void {
    // Update metrics every 5 seconds
    setInterval(() => {
      this.processingMetrics.queueDepth = Math.floor(Math.random() * 50);
      this.notifyMetricsSubscribers();
    }, 5000);
  }
}
