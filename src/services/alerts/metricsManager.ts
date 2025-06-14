
import { Alert, AlertsMetrics } from './types';

export class AlertMetricsManager {
  private metricsSubscribers: Set<(metrics: AlertsMetrics) => void> = new Set();

  calculateMetrics(alerts: Alert[]): AlertsMetrics {
    const total = alerts.length;
    const newAlerts = alerts.filter(a => a.status === 'new').length;
    const critical = alerts.filter(a => a.severity === 'critical').length;
    const resolved = alerts.filter(a => a.status === 'resolved').length;

    return {
      total,
      new: newAlerts,
      critical,
      resolved,
      avgResponseTime: '2.4min',
      successRate: '94.7%'
    };
  }

  subscribeToMetrics(callback: (metrics: AlertsMetrics) => void): () => void {
    this.metricsSubscribers.add(callback);
    return () => this.metricsSubscribers.delete(callback);
  }

  notifyMetricsSubscribers(metrics: AlertsMetrics): void {
    this.metricsSubscribers.forEach(callback => callback(metrics));
  }
}
