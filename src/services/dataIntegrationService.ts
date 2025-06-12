
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
  // Vessel Management
  async createVessel(vessel: VesselData) {
    const { data, error } = await supabase
      .from('vessels')
      .insert(vessel)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getVessels(organizationId?: string) {
    let query = supabase.from('vessels').select('*');
    
    if (organizationId) {
      query = query.eq('organization_id', organizationId);
    }
    
    const { data, error } = await query.eq('is_active', true);
    if (error) throw error;
    return data;
  }

  async updateVessel(id: string, updates: Partial<VesselData>) {
    const { data, error } = await supabase
      .from('vessels')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Vessel Position Tracking
  async addVesselPosition(position: VesselPosition) {
    const { data, error } = await supabase
      .from('vessel_positions')
      .insert(position)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getVesselPositions(vesselId: string, limit = 100) {
    const { data, error } = await supabase
      .from('vessel_positions')
      .select('*')
      .eq('vessel_id', vesselId)
      .order('timestamp', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data;
  }

  async getLatestVesselPositions(organizationId?: string) {
    let query = `
      SELECT DISTINCT ON (v.id) 
        v.*, 
        vp.latitude, 
        vp.longitude, 
        vp.speed, 
        vp.heading, 
        vp.timestamp as last_position_time
      FROM vessels v
      LEFT JOIN vessel_positions vp ON v.id = vp.vessel_id
    `;
    
    if (organizationId) {
      query += ` WHERE v.organization_id = '${organizationId}'`;
    }
    
    query += ` ORDER BY v.id, vp.timestamp DESC`;
    
    const { data, error } = await supabase.rpc('execute_sql', { query });
    if (error) throw error;
    return data;
  }

  // Alert Management
  async createAlert(alert: AlertData) {
    const { data, error } = await supabase
      .from('alerts')
      .insert(alert)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getAlerts(organizationId?: string, status?: string) {
    let query = supabase.from('alerts').select('*, vessels(name, mmsi)');
    
    if (organizationId) {
      query = query.eq('organization_id', organizationId);
    }
    
    if (status) {
      query = query.eq('status', status);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }

  async updateAlert(id: string, updates: any) {
    const { data, error } = await supabase
      .from('alerts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Analytics Data
  async recordAnalyticsMetric(metric: AnalyticsMetric) {
    const { data, error } = await supabase
      .from('analytics_data')
      .insert(metric)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getAnalyticsData(
    metricName: string, 
    organizationId?: string, 
    timeRange?: { start: string; end: string }
  ) {
    let query = supabase
      .from('analytics_data')
      .select('*')
      .eq('metric_name', metricName);
    
    if (organizationId) {
      query = query.eq('organization_id', organizationId);
    }
    
    if (timeRange) {
      query = query
        .gte('timestamp', timeRange.start)
        .lte('timestamp', timeRange.end);
    }
    
    const { data, error } = await query.order('timestamp', { ascending: false });
    if (error) throw error;
    return data;
  }

  // Real-time subscriptions
  subscribeToVesselPositions(callback: (payload: any) => void, organizationId?: string) {
    const channel = supabase
      .channel('vessel_positions_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'vessel_positions',
          filter: organizationId ? `vessel_id=in.(SELECT id FROM vessels WHERE organization_id='${organizationId}')` : undefined
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
          table: 'alerts',
          filter: organizationId ? `organization_id=eq.${organizationId}` : undefined
        },
        callback
      )
      .subscribe();
    
    return channel;
  }

  // Data import/export utilities
  async importVesselData(vessels: VesselData[]) {
    const { data, error } = await supabase
      .from('vessels')
      .upsert(vessels, { onConflict: 'mmsi' })
      .select();
    
    if (error) throw error;
    return data;
  }

  async exportAnalyticsData(organizationId?: string, format = 'json') {
    let query = supabase.from('analytics_data').select('*');
    
    if (organizationId) {
      query = query.eq('organization_id', organizationId);
    }
    
    const { data, error } = await query.order('timestamp', { ascending: false });
    if (error) throw error;
    
    if (format === 'csv') {
      return this.convertToCSV(data);
    }
    
    return data;
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
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
    
    const { error } = await supabase
      .from('vessel_positions')
      .delete()
      .lt('timestamp', cutoffDate.toISOString());
    
    if (error) throw error;
  }

  async getSystemHealth() {
    try {
      const [vessels, alerts, positions] = await Promise.all([
        supabase.from('vessels').select('id', { count: 'exact', head: true }),
        supabase.from('alerts').select('id', { count: 'exact', head: true }),
        supabase.from('vessel_positions').select('id', { count: 'exact', head: true })
      ]);

      return {
        vessels_count: vessels.count || 0,
        alerts_count: alerts.count || 0,
        positions_count: positions.count || 0,
        last_check: new Date().toISOString()
      };
    } catch (error) {
      throw error;
    }
  }
}

export const dataIntegrationService = new DataIntegrationService();
