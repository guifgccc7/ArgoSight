
import { supabase } from '@/integrations/supabase/client';
import { realDataIntegrationService } from './realDataIntegrationService';
import { aisStreamService } from './aisStreamService';

export interface DataFeedConfig {
  ais: {
    enabled: boolean;
    interval: number; // minutes
    providers: string[];
    regions: Array<{
      name: string;
      bbox: { north: number; south: number; east: number; west: number };
    }>;
  };
  weather: {
    enabled: boolean;
    interval: number; // minutes
    locations: Array<{ lat: number; lng: number; name: string }>;
  };
  satellite: {
    enabled: boolean;
    interval: number; // hours
    regions: Array<{
      name: string;
      bbox: { north: number; south: number; east: number; west: number };
    }>;
  };
}

class RealTimeDataFeedManager {
  private isRunning = false;
  private intervals: NodeJS.Timeout[] = [];
  private config: DataFeedConfig = {
    ais: {
      enabled: true,
      interval: 5, // every 5 minutes
      providers: ['marinetraffic', 'vesselfinder'],
      regions: [
        {
          name: 'Mediterranean Sea',
          bbox: { north: 45, south: 30, east: 40, west: -10 }
        },
        {
          name: 'North Sea',
          bbox: { north: 62, south: 50, east: 8, west: -4 }
        },
        {
          name: 'English Channel',
          bbox: { north: 52, south: 49, east: 2, west: -6 }
        }
      ]
    },
    weather: {
      enabled: true,
      interval: 30, // every 30 minutes
      locations: [
        { lat: 60, lng: 0, name: 'North Sea' },
        { lat: 40, lng: -70, name: 'North Atlantic' },
        { lat: 35, lng: 15, name: 'Mediterranean' },
        { lat: 50, lng: -4, name: 'English Channel' },
        { lat: 70, lng: 30, name: 'Arctic Ocean' }
      ]
    },
    satellite: {
      enabled: true,
      interval: 120, // every 2 hours
      regions: [
        {
          name: 'Mediterranean Focus',
          bbox: { north: 45, south: 30, east: 40, west: -10 }
        },
        {
          name: 'North Sea Focus',
          bbox: { north: 62, south: 50, east: 8, west: -4 }
        }
      ]
    }
  };

  async startDataFeeds(): Promise<void> {
    if (this.isRunning) {
      console.log('Data feeds already running');
      return;
    }

    console.log('🚀 Starting real-time data feeds...');
    this.isRunning = true;

    // Start AIS data feeds
    if (this.config.ais.enabled) {
      this.startAISFeeds();
    }

    // Start weather data feeds
    if (this.config.weather.enabled) {
      this.startWeatherFeeds();
    }

    // Start satellite data feeds
    if (this.config.satellite.enabled) {
      this.startSatelliteFeeds();
    }

    // Start AISStream real-time feed
    await aisStreamService.startAISStream();

    this.logSystemActivity('Real-time data feeds started');
  }

  private startAISFeeds(): void {
    console.log('📡 Starting AIS data feeds...');
    
    // Initial fetch
    this.fetchAllAISData();
    
    // Set up interval
    const aisInterval = setInterval(() => {
      this.fetchAllAISData();
    }, this.config.ais.interval * 60 * 1000);
    
    this.intervals.push(aisInterval);
  }

  private async fetchAllAISData(): Promise<void> {
    for (const provider of this.config.ais.providers) {
      for (const region of this.config.ais.regions) {
        try {
          console.log(`Fetching AIS data from ${provider} for ${region.name}`);
          await realDataIntegrationService.integrateAISData(provider, region.bbox);
        } catch (error) {
          console.error(`Failed to fetch AIS data from ${provider} for ${region.name}:`, error);
        }
      }
    }
  }

  private startWeatherFeeds(): void {
    console.log('🌊 Starting weather data feeds...');
    
    // Initial fetch
    this.fetchAllWeatherData();
    
    // Set up interval
    const weatherInterval = setInterval(() => {
      this.fetchAllWeatherData();
    }, this.config.weather.interval * 60 * 1000);
    
    this.intervals.push(weatherInterval);
  }

  private async fetchAllWeatherData(): Promise<void> {
    try {
      console.log('Fetching weather data for all locations');
      await realDataIntegrationService.integrateWeatherData(
        'openweather-marine',
        this.config.weather.locations
      );
    } catch (error) {
      console.error('Failed to fetch weather data:', error);
    }
  }

  private startSatelliteFeeds(): void {
    console.log('🛰️ Starting satellite data feeds...');
    
    // Initial fetch
    this.fetchAllSatelliteData();
    
    // Set up interval
    const satelliteInterval = setInterval(() => {
      this.fetchAllSatelliteData();
    }, this.config.satellite.interval * 60 * 60 * 1000);
    
    this.intervals.push(satelliteInterval);
  }

  private async fetchAllSatelliteData(): Promise<void> {
    for (const region of this.config.satellite.regions) {
      try {
        console.log(`Fetching satellite data for ${region.name}`);
        await realDataIntegrationService.integrateSatelliteData('planet-labs', region.bbox);
      } catch (error) {
        console.error(`Failed to fetch satellite data for ${region.name}:`, error);
      }
    }
  }

  stopDataFeeds(): void {
    if (!this.isRunning) {
      console.log('Data feeds not running');
      return;
    }

    console.log('⏹️ Stopping real-time data feeds...');
    
    // Clear all intervals
    this.intervals.forEach(interval => clearInterval(interval));
    this.intervals = [];
    
    this.isRunning = false;
    this.logSystemActivity('Real-time data feeds stopped');
  }

  getStatus(): { isRunning: boolean; config: DataFeedConfig } {
    return {
      isRunning: this.isRunning,
      config: this.config
    };
  }

  updateConfig(newConfig: Partial<DataFeedConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    if (this.isRunning) {
      console.log('Restarting feeds with new configuration...');
      this.stopDataFeeds();
      setTimeout(() => this.startDataFeeds(), 1000);
    }
  }

  private async logSystemActivity(activity: string): Promise<void> {
    try {
      await supabase.from('system_metrics').insert({
        metric_name: 'data_feed_activity',
        metric_value: this.isRunning ? 1 : 0,
        component: 'real_time_data_manager',
        metadata: { activity, timestamp: new Date().toISOString() }
      });
    } catch (error) {
      console.error('Failed to log system activity:', error);
    }
  }

  async getDataFeedMetrics(): Promise<any> {
    try {
      const { data: metrics } = await supabase
        .from('system_metrics')
        .select('*')
        .eq('component', 'real_time_data_manager')
        .order('timestamp_utc', { ascending: false })
        .limit(10);

      return metrics || [];
    } catch (error) {
      console.error('Failed to get data feed metrics:', error);
      return [];
    }
  }
}

export const realTimeDataFeedManager = new RealTimeDataFeedManager();
