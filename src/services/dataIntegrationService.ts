
import { supabase } from '@/integrations/supabase/client';

export interface VesselData {
  id?: string;
  mmsi: string;
  imo?: string;
  name: string;
  call_sign?: string;
  vessel_type?: string;
  flag_country?: string;
  length?: number;
  width?: number;
  gross_tonnage?: number;
  organization_id?: string;
}

export interface VesselPosition {
  vessel_id: string;
  latitude: number;
  longitude: number;
  speed?: number;
  heading?: number;
  course?: number;
  timestamp?: string;
  source?: string;
}

export interface AlertData {
  title: string;
  description?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: string;
  vessel_id?: string;
  organization_id?: string;
  location?: any;
  metadata?: any;
}

export interface AnalyticsMetric {
  metric_name: string;
  metric_value: number;
  dimensions?: any;
  organization_id?: string;
  timestamp?: string;
}

class DataIntegrationService {
  // Vessel Management using RPC calls to avoid type issues
  async createVessel(vessel: VesselData) {
    try {
      const { data, error } = await (supabase as any).rpc('create_vessel', {
        vessel_data: vessel
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating vessel:', error);
      throw error;
    }
  }

  async getVessels(organizationId?: string) {
    try {
      const { data, error } = await (supabase as any).rpc('get_vessels', {
        org_id: organizationId
      });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching vessels:', error);
      return [];
    }
  }

  async updateVessel(id: string, updates: Partial<VesselData>) {
    try {
      const { data, error } = await (supabase as any).rpc('update_vessel', {
        vessel_id: id,
        updates: updates
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating vessel:', error);
      throw error;
    }
  }

  // Vessel Position Tracking
  async addVesselPosition(position: VesselPosition) {
    try {
      const { data, error } = await (supabase as any).rpc('add_vessel_position', {
        position_data: position
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding vessel position:', error);
      throw error;
    }
  }

  async getVesselPositions(vesselId: string, limit = 100) {
    try {
      const { data, error } = await (supabase as any).rpc('get_vessel_positions', {
        vessel_id: vesselId,
        result_limit: limit
      });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching vessel positions:', error);
      return [];
    }
  }

  async getLatestVesselPositions(organizationId?: string) {
    try {
      const { data, error } = await (supabase as any).rpc('get_latest_vessel_positions', {
        org_id: organizationId
      });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching latest vessel positions:', error);
      return [];
    }
  }

  // Alert Management
  async createAlert(alert: AlertData) {
    try {
      const { data, error } = await (supabase as any).rpc('create_alert', {
        alert_data: alert
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating alert:', error);
      throw error;
    }
  }

  async getAlerts(organizationId?: string, status?: string) {
    try {
      const { data, error } = await (supabase as any).rpc('get_alerts', {
        org_id: organizationId,
        alert_status: status
      });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching alerts:', error);
      return [];
    }
  }

  async updateAlert(id: string, updates: any) {
    try {
      const { data, error } = await (supabase as any).rpc('update_alert', {
        alert_id: id,
        updates: updates
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating alert:', error);
      throw error;
    }
  }

  // Analytics Data
  async recordAnalyticsMetric(metric: AnalyticsMetric) {
    try {
      const { data, error } = await (supabase as any).rpc('record_analytics_metric', {
        metric_data: metric
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error recording analytics metric:', error);
      throw error;
    }
  }

  async getAnalyticsData(
    metricName: string, 
    organizationId?: string, 
    timeRange?: { start: string; end: string }
  ) {
    try {
      const { data, error } = await (supabase as any).rpc('get_analytics_data', {
        metric_name: metricName,
        org_id: organizationId,
        time_range: timeRange
      });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      return [];
    }
  }

  // Real-time subscriptions using generic channel approach
  subscribeToVesselPositions(callback: (payload: any) => void, organizationId?: string) {
    const channel = supabase
      .channel('vessel_positions_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'vessel_positions'
        },
        callback
      )
      .subscribe();
    
    return channel;
  }

  subscribeToAlerts(callback: (payload: any) => void, organizationId?: string) {
    const channel = supabase
      .channel('alerts_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'alerts'
        },
        callback
      )
      .subscribe();
    
    return channel;
  }

  // Data import/export utilities
  async importVesselData(vessels: VesselData[]) {
    try {
      const { data, error } = await (supabase as any).rpc('import_vessel_data', {
        vessels_data: vessels
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error importing vessel data:', error);
      throw error;
    }
  }

  async exportAnalyticsData(organizationId?: string, format = 'json') {
    try {
      const { data, error } = await (supabase as any).rpc('export_analytics_data', {
        org_id: organizationId,
        export_format: format
      });
      
      if (error) throw error;
      
      if (format === 'csv') {
        return this.convertToCSV(data);
      }
      
      return data;
    } catch (error) {
      console.error('Error exporting analytics data:', error);
      throw error;
    }
  }

  private convertToCSV(data: any[]): string {
    if (!data.length) return '';
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => 
          JSON.stringify(row[header] || '')
        ).join(',')
      )
    ].join('\n');
    
    return csvContent;
  }

  // Performance optimization utilities
  async cleanupOldPositions(daysToKeep = 30) {
    try {
      const { error } = await (supabase as any).rpc('cleanup_old_positions', {
        days_to_keep: daysToKeep
      });
      
      if (error) throw error;
    } catch (error) {
      console.error('Error cleaning up old positions:', error);
      throw error;
    }
  }

  async getSystemHealth() {
    try {
      const { data, error } = await (supabase as any).rpc('get_system_health');
      
      if (error) throw error;
      
      return data || {
        vessels_count: 0,
        alerts_count: 0,
        positions_count: 0,
        last_check: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting system health:', error);
      return {
        vessels_count: 0,
        alerts_count: 0,
        positions_count: 0,
        last_check: new Date().toISOString()
      };
    }
  }
}

export const dataIntegrationService = new DataIntegrationService();
