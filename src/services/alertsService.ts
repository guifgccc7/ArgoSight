import { liveDataService } from './liveDataService';
import { ghostFleetDetectionService } from './ghostFleetDetectionService';

export interface Alert {
  id: string;
  type: 'ghost_vessel' | 'weather' | 'security' | 'collision' | 'communication' | 'equipment';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  location?: {
    lat: number;
    lng: number;
    name?: string;
  };
  timestamp: string;
  status: 'new' | 'acknowledged' | 'investigating' | 'escalated' | 'resolved';
  assignee?: string;
  source: 'ai_detection' | 'manual' | 'system' | 'satellite';
  metadata?: {
    vesselId?: string;
    confidence?: number;
    evidenceLinks?: string[];
  };
}

export interface AlertsMetrics {
  total: number;
  new: number;
  critical: number;
  resolved: number;
  avgResponseTime: string;
  successRate: string;
}

export interface ReportData {
  generated: string;
  dateRange: {
    from: Date;
    to: Date;
  };
  filters: {
    severity: string;
    type: string;
    status: string;
  };
  summary: {
    totalAlerts: number;
    bySeverity: Record<string, number>;
    byStatus: Record<string, number>;
    byType: Record<string, number>;
  };
  alerts: Alert[];
}

class AlertsService {
  private alerts: Alert[] = [];
  private subscribers: Set<(alerts: Alert[]) => void> = new Set();
  private metricsSubscribers: Set<(metrics: AlertsMetrics) => void> = new Set();
  private alertCounter = 0;

  constructor() {
    this.initializeAlerts();
    this.subscribeToDetectionServices();
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

  private subscribeToDetectionServices() {
    // Subscribe to ghost fleet detection alerts
    ghostFleetDetectionService.subscribe((ghostAlerts) => {
      ghostAlerts.forEach(ghostAlert => {
        const alert: Alert = {
          id: `GF-${this.alertCounter++}`,
          type: 'ghost_vessel',
          severity: ghostAlert.riskLevel,
          title: `${ghostAlert.alertType.replace('_', ' ')} - ${ghostAlert.vesselName}`,
          description: `Vessel ${ghostAlert.vesselName} showing suspicious behavior patterns`,
          location: {
            lat: ghostAlert.location[1],
            lng: ghostAlert.location[0],
            name: `${ghostAlert.location[1].toFixed(2)}, ${ghostAlert.location[0].toFixed(2)}`
          },
          timestamp: ghostAlert.timestamp,
          status: 'new',
          source: 'ai_detection',
          metadata: {
            vesselId: ghostAlert.vesselId,
            confidence: Math.max(...ghostAlert.patterns.map(p => p.confidence))
          }
        };
        this.addAlert(alert);
      });
    });

    // Subscribe to general live data alerts
    liveDataService.subscribe((data) => {
      if (data.alerts) {
        data.alerts.forEach((alert: any) => {
          const newAlert: Alert = {
            id: `SYS-${this.alertCounter++}`,
            type: alert.type,
            severity: alert.severity,
            title: this.getTitleFromDescription(alert.description),
            description: alert.description,
            location: {
              lat: alert.location[1],
              lng: alert.location[0]
            },
            timestamp: alert.timestamp,
            status: 'new',
            source: 'system'
          };
          this.addAlert(newAlert);
        });
      }
    });
  }

  private getTitleFromDescription(description: string): string {
    if (description.includes('AIS manipulation')) return 'AIS Manipulation Detected';
    if (description.includes('vessel behavior')) return 'Suspicious Vessel Behavior';
    if (description.includes('weather')) return 'Severe Weather Alert';
    return 'Maritime Alert';
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

  getAlerts(filters?: {
    severity?: Alert['severity'];
    type?: Alert['type'];
    status?: Alert['status'];
    search?: string;
  }): Alert[] {
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
    const filters: any = {};
    if (config.severity && config.severity !== 'all') filters.severity = config.severity;
    if (config.type && config.type !== 'all') filters.type = config.type;
    if (config.status && config.status !== 'all') filters.status = config.status;

    const alerts = this.getAlerts(filters);
    
    // Filter by date range
    const filteredAlerts = alerts.filter(alert => {
      const alertDate = new Date(alert.timestamp);
      return alertDate >= config.dateRange.from && alertDate <= config.dateRange.to;
    });

    // Generate summary statistics
    const bySeverity: Record<string, number> = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0
    };

    const byStatus: Record<string, number> = {
      new: 0,
      acknowledged: 0,
      investigating: 0,
      escalated: 0,
      resolved: 0
    };

    const byType: Record<string, number> = {
      ghost_vessel: 0,
      weather: 0,
      security: 0,
      collision: 0,
      communication: 0,
      equipment: 0
    };

    filteredAlerts.forEach(alert => {
      bySeverity[alert.severity]++;
      byStatus[alert.status]++;
      byType[alert.type]++;
    });

    return {
      generated: new Date().toISOString(),
      dateRange: config.dateRange,
      filters: {
        severity: config.severity || 'all',
        type: config.type || 'all',
        status: config.status || 'all'
      },
      summary: {
        totalAlerts: filteredAlerts.length,
        bySeverity,
        byStatus,
        byType
      },
      alerts: filteredAlerts
    };
  }

  exportDetectionData(): any {
    const metrics = this.getMetrics();
    return {
      exportedAt: new Date().toISOString(),
      metrics,
      alerts: this.alerts,
      summary: {
        totalAlerts: this.alerts.length,
        alertsByType: this.alerts.reduce((acc, alert) => {
          acc[alert.type] = (acc[alert.type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        alertsBySeverity: this.alerts.reduce((acc, alert) => {
          acc[alert.severity] = (acc[alert.severity] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      }
    };
  }

  getMetrics(): AlertsMetrics {
    const total = this.alerts.length;
    const newAlerts = this.alerts.filter(a => a.status === 'new').length;
    const critical = this.alerts.filter(a => a.severity === 'critical').length;
    const resolved = this.alerts.filter(a => a.status === 'resolved').length;

    return {
      total,
      new: newAlerts,
      critical,
      resolved,
      avgResponseTime: '2.4min',
      successRate: '94.7%'
    };
  }

  subscribe(callback: (alerts: Alert[]) => void) {
    this.subscribers.add(callback);
    callback(this.alerts); // Send current alerts immediately
    return () => this.subscribers.delete(callback);
  }

  subscribeToMetrics(callback: (metrics: AlertsMetrics) => void) {
    this.metricsSubscribers.add(callback);
    callback(this.getMetrics()); // Send current metrics immediately
    return () => this.metricsSubscribers.delete(callback);
  }

  private notifySubscribers() {
    this.subscribers.forEach(callback => callback(this.alerts));
  }

  private notifyMetricsSubscribers() {
    const metrics = this.getMetrics();
    this.metricsSubscribers.forEach(callback => callback(metrics));
  }

  // Simulate real-time alert generation
  startAlertSimulation() {
    setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance every 10 seconds
        this.generateRandomAlert();
      }
    }, 10000);
  }

  private generateRandomAlert() {
    const types: Alert['type'][] = ['ghost_vessel', 'weather', 'security', 'communication'];
    const severities: Alert['severity'][] = ['low', 'medium', 'high', 'critical'];
    
    const type = types[Math.floor(Math.random() * types.length)];
    const severity = severities[Math.floor(Math.random() * severities.length)];
    
    const descriptions = {
      ghost_vessel: 'Vessel went dark in restricted waters',
      weather: 'Storm system approaching maritime routes',
      security: 'Suspicious activity detected in port area',
      communication: 'Loss of communication with vessel fleet'
    };

    const alert: Alert = {
      id: `AUTO-${Date.now()}`,
      type,
      severity,
      title: `${type.replace('_', ' ')} Alert`,
      description: descriptions[type],
      location: {
        lat: Math.random() * 180 - 90,
        lng: Math.random() * 360 - 180
      },
      timestamp: new Date().toISOString(),
      status: 'new',
      source: 'system'
    };

    this.addAlert(alert);
  }
}

export const alertsService = new AlertsService();
