import { Alert, AlertsMetrics, ReportData, AlertFilters } from './alerts/types';
import { AlertMetricsManager } from './alerts/metricsManager';
import { AlertSubscriptionManager } from './alerts/subscriptionManager';
import { AlertSimulationService } from './alerts/simulationService';
import { ReportGenerator } from './alerts/reportGenerator';

class AlertsService {
  private alerts: Alert[] = [];
  private subscribers: Set<(alerts: Alert[]) => void> = new Set();
  private metricsManager: AlertMetricsManager;
  private subscriptionManager: AlertSubscriptionManager;
  private simulationService: AlertSimulationService;
  private reportGenerator: ReportGenerator;

  constructor() {
    this.metricsManager = new AlertMetricsManager();
    this.subscriptionManager = new AlertSubscriptionManager(this.addAlert.bind(this));
    this.simulationService = new AlertSimulationService(this.addAlert.bind(this));
    this.reportGenerator = new ReportGenerator();
    
    this.initializeAlerts();
    this.subscriptionManager.initializeSubscriptions();
  }

  private initializeAlerts() {
    // Initialize with some mock alerts for demonstration
    this.alerts = [
      {
        id: 'ALT-001',
        type: 'security',
        severity: 'critical',
        title: 'Unauthorized Port Access',
        description: 'Unauthorized access detected in secure cargo area at Port of Rotterdam',
        location: { lat: 51.9244, lng: 4.4777, name: 'Port of Rotterdam - Terminal 3' },
        timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
        status: 'investigating',
        assignee: 'Agent Martinez',
        source: 'ai_detection',
        metadata: { confidence: 0.94 }
      },
      {
        id: 'ALT-002',
        type: 'ghost_vessel',
        severity: 'high',
        title: 'Vessel Route Deviation',
        description: 'MV Atlantic Star deviating from approved route without notification',
        location: { lat: 55.0, lng: 2.0, name: 'North Sea - Sector 7A' },
        timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
        status: 'escalated',
        assignee: 'Agent Chen',
        source: 'ai_detection',
        metadata: { vesselId: 'IMO-001', confidence: 0.87 }
      }
    ];
  }

  addAlert(alert: Alert) {
    this.alerts.unshift(alert);
    // Keep only last 100 alerts
    if (this.alerts.length > 100) {
      this.alerts = this.alerts.slice(0, 100);
    }
    this.notifySubscribers();
    this.notifyMetricsSubscribers();
  }

  updateAlertStatus(alertId: string, status: Alert['status'], assignee?: string) {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.status = status;
      if (assignee) alert.assignee = assignee;
      this.notifySubscribers();
      this.notifyMetricsSubscribers();
    }
  }

  getAlerts(filters?: AlertFilters): Alert[] {
    let filtered = [...this.alerts];

    if (filters) {
      if (filters.severity) {
        filtered = filtered.filter(a => a.severity === filters.severity);
      }
      if (filters.type) {
        filtered = filtered.filter(a => a.type === filters.type);
      }
      if (filters.status) {
        filtered = filtered.filter(a => a.status === filters.status);
      }
      if (filters.search) {
        const search = filters.search.toLowerCase();
        filtered = filtered.filter(a => 
          a.title.toLowerCase().includes(search) ||
          a.description.toLowerCase().includes(search) ||
          a.location?.name?.toLowerCase().includes(search)
        );
      }
    }

    return filtered;
  }

  generateReport(config: {
    dateRange: { from: Date; to: Date };
    severity?: string;
    type?: string;
    status?: string;
  }): ReportData {
    return this.reportGenerator.generateReport(this.alerts, config);
  }

  exportDetectionData(): any {
    const metrics = this.getMetrics();
    return {
      ...this.reportGenerator.exportDetectionData(this.alerts),
      metrics
    };
  }

  getMetrics(): AlertsMetrics {
    return this.metricsManager.calculateMetrics(this.alerts);
  }

  subscribe(callback: (alerts: Alert[]) => void) {
    this.subscribers.add(callback);
    callback(this.alerts); // Send current alerts immediately
    return () => this.subscribers.delete(callback);
  }

  subscribeToMetrics(callback: (metrics: AlertsMetrics) => void) {
    return this.metricsManager.subscribeToMetrics(callback);
  }

  private notifySubscribers() {
    this.subscribers.forEach(callback => callback(this.alerts));
  }

  private notifyMetricsSubscribers() {
    const metrics = this.getMetrics();
    this.metricsManager.notifyMetricsSubscribers(metrics);
  }

  // Simulation methods
  startAlertSimulation() {
    this.simulationService.startAlertSimulation();
  }

  stopAlertSimulation() {
    this.simulationService.stopAlertSimulation();
  }
}

export const alertsService = new AlertsService();
export type { Alert, AlertsMetrics, ReportData };
