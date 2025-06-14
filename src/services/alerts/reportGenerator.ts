
import { Alert, ReportData, AlertFilters } from './types';

export class ReportGenerator {
  generateReport(
    alerts: Alert[],
    config: {
      dateRange: { from: Date; to: Date };
      severity?: string;
      type?: string;
      status?: string;
    }
  ): ReportData {
    const filters: AlertFilters = {};
    if (config.severity && config.severity !== 'all') filters.severity = config.severity as Alert['severity'];
    if (config.type && config.type !== 'all') filters.type = config.type as Alert['type'];
    if (config.status && config.status !== 'all') filters.status = config.status as Alert['status'];

    const filteredAlerts = this.filterAlerts(alerts, filters);
    
    // Filter by date range
    const dateFilteredAlerts = filteredAlerts.filter(alert => {
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

    dateFilteredAlerts.forEach(alert => {
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
        totalAlerts: dateFilteredAlerts.length,
        bySeverity,
        byStatus,
        byType
      },
      alerts: dateFilteredAlerts
    };
  }

  private filterAlerts(alerts: Alert[], filters: AlertFilters): Alert[] {
    let filtered = [...alerts];

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

    return filtered;
  }

  exportDetectionData(alerts: Alert[]): any {
    return {
      exportedAt: new Date().toISOString(),
      alerts,
      summary: {
        totalAlerts: alerts.length,
        alertsByType: alerts.reduce((acc, alert) => {
          acc[alert.type] = (acc[alert.type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        alertsBySeverity: alerts.reduce((acc, alert) => {
          acc[alert.severity] = (acc[alert.severity] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      }
    };
  }
}
