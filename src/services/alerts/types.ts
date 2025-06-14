
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
    weatherConditions?: {
      windSpeed: number;
      waveHeight: number;
      visibility: number;
      temperature: number;
    };
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

export interface AlertFilters {
  severity?: Alert['severity'];
  type?: Alert['type'];
  status?: Alert['status'];
  search?: string;
}
