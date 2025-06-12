
import { supabase } from '@/integrations/supabase/client';

export interface AISStreamData {
  mmsi: string;
  shipName: string;
  latitude: number;
  longitude: number;
  speed: number;
  course: number;
  heading: number;
  timestamp: string;
  navigationStatus: string;
}

class AISStreamService {
  private isConnected = false;
  private subscribers: Set<(data: AISStreamData) => void> = new Set();

  async startAISStream(): Promise<void> {
    try {
      console.log('Starting AISStream integration...');
      
      // Call the edge function to start the WebSocket connection
      const { data, error } = await supabase.functions.invoke('aisstream-integration');
      
      if (error) {
        console.error('Error starting AISStream:', error);
        return;
      }
      
      this.isConnected = true;
      console.log('AISStream integration started:', data);
      
      // Start polling for new vessel positions from database
      this.startPositionPolling();
      
    } catch (error) {
      console.error('Failed to start AISStream:', error);
    }
  }

  private startPositionPolling(): void {
    // Poll for recent vessel positions every 10 seconds
    setInterval(async () => {
      try {
        const { data: positions } = await supabase
          .from('vessel_positions')
          .select(`
            *,
            vessels (
              vessel_name,
              vessel_type
            )
          `)
          .eq('source_feed', 'aisstream')
          .gte('timestamp_utc', new Date(Date.now() - 60000).toISOString()) // Last minute
          .order('timestamp_utc', { ascending: false });

        if (positions) {
          positions.forEach(position => {
            const aisData: AISStreamData = {
              mmsi: position.mmsi,
              shipName: position.vessels?.vessel_name || `Vessel-${position.mmsi}`,
              latitude: position.latitude,
              longitude: position.longitude,
              speed: position.speed_knots || 0,
              course: position.course_degrees || 0,
              heading: position.heading_degrees || 0,
              timestamp: position.timestamp_utc,
              navigationStatus: position.navigation_status || 'Unknown'
            };
            
            this.notifySubscribers(aisData);
          });
        }
      } catch (error) {
        console.error('Error polling vessel positions:', error);
      }
    }, 10000);
  }

  private notifySubscribers(data: AISStreamData): void {
    this.subscribers.forEach(callback => callback(data));
  }

  subscribe(callback: (data: AISStreamData) => void): () => void {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  isStreamConnected(): boolean {
    return this.isConnected;
  }

  async getRecentVessels(limit: number = 100): Promise<AISStreamData[]> {
    try {
      const { data: positions } = await supabase
        .from('vessel_positions')
        .select(`
          *,
          vessels (
            vessel_name,
            vessel_type
          )
        `)
        .eq('source_feed', 'aisstream')
        .gte('timestamp_utc', new Date(Date.now() - 3600000).toISOString()) // Last hour
        .order('timestamp_utc', { ascending: false })
        .limit(limit);

      if (!positions) return [];

      return positions.map(position => ({
        mmsi: position.mmsi,
        shipName: position.vessels?.vessel_name || `Vessel-${position.mmsi}`,
        latitude: position.latitude,
        longitude: position.longitude,
        speed: position.speed_knots || 0,
        course: position.course_degrees || 0,
        heading: position.heading_degrees || 0,
        timestamp: position.timestamp_utc,
        navigationStatus: position.navigation_status || 'Unknown'
      }));
    } catch (error) {
      console.error('Error fetching recent vessels:', error);
      return [];
    }
  }
}

export const aisStreamService = new AISStreamService();
