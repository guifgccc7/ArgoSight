
import { supabase } from '@/integrations/supabase/client';

export interface ApiHealthStatus {
  service: string;
  status: 'healthy' | 'degraded' | 'down';
  lastCheck: string;
  responseTime?: number;
  errorMessage?: string;
}

class ApiHealthMonitor {
  private checkInterval: NodeJS.Timeout | null = null;
  private healthStatus: Map<string, ApiHealthStatus> = new Map();

  async checkAISStreamHealth(): Promise<ApiHealthStatus> {
    const startTime = Date.now();
    try {
      const { data, error } = await supabase.functions.invoke('aisstream-integration');
      const responseTime = Date.now() - startTime;

      if (error) {
        return {
          service: 'AISStream',
          status: 'down',
          lastCheck: new Date().toISOString(),
          responseTime,
          errorMessage: error.message
        };
      }

      return {
        service: 'AISStream',
        status: 'healthy',
        lastCheck: new Date().toISOString(),
        responseTime
      };
    } catch (error: any) {
      return {
        service: 'AISStream',
        status: 'down',
        lastCheck: new Date().toISOString(),
        responseTime: Date.now() - startTime,
        errorMessage: error.message
      };
    }
  }

  async checkWeatherApiHealth(): Promise<ApiHealthStatus> {
    const startTime = Date.now();
    try {
      const { data, error } = await supabase.functions.invoke('weather-data', {
        body: { lat: 51.5074, lng: -0.1278 } // London coordinates for test
      });
      const responseTime = Date.now() - startTime;

      if (error) {
        return {
          service: 'Weather API',
          status: 'down',
          lastCheck: new Date().toISOString(),
          responseTime,
          errorMessage: error.message
        };
      }

      return {
        service: 'Weather API',
        status: 'healthy',
        lastCheck: new Date().toISOString(),
        responseTime
      };
    } catch (error: any) {
      return {
        service: 'Weather API',
        status: 'down',
        lastCheck: new Date().toISOString(),
        responseTime: Date.now() - startTime,
        errorMessage: error.message
      };
    }
  }

  async checkSatelliteApiHealth(): Promise<ApiHealthStatus> {
    const startTime = Date.now();
    try {
      const { data, error } = await supabase.functions.invoke('satellite-data', {
        body: {
          bbox: {
            coordinates: [[[-1, 50], [1, 50], [1, 52], [-1, 52], [-1, 50]]]
          },
          cloudCover: 0.1
        }
      });
      const responseTime = Date.now() - startTime;

      if (error) {
        return {
          service: 'Satellite API',
          status: 'down',
          lastCheck: new Date().toISOString(),
          responseTime,
          errorMessage: error.message
        };
      }

      return {
        service: 'Satellite API',
        status: 'healthy',
        lastCheck: new Date().toISOString(),
        responseTime
      };
    } catch (error: any) {
      return {
        service: 'Satellite API',
        status: 'down',
        lastCheck: new Date().toISOString(),
        responseTime: Date.now() - startTime,
        errorMessage: error.message
      };
    }
  }

  async checkAllServices(): Promise<ApiHealthStatus[]> {
    console.log('🔍 Checking API health status...');
    
    const checks = await Promise.all([
      this.checkAISStreamHealth(),
      this.checkWeatherApiHealth(),
      this.checkSatelliteApiHealth()
    ]);

    // Update internal status tracking
    checks.forEach(status => {
      this.healthStatus.set(status.service, status);
    });

    console.log('📊 API Health Summary:', checks);
    return checks;
  }

  getHealthStatus(): ApiHealthStatus[] {
    return Array.from(this.healthStatus.values());
  }

  startMonitoring(intervalMinutes: number = 5): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }

    // Initial check
    this.checkAllServices();

    // Set up periodic checks
    this.checkInterval = setInterval(() => {
      this.checkAllServices();
    }, intervalMinutes * 60 * 1000);

    console.log(`🎯 API health monitoring started (checking every ${intervalMinutes} minutes)`);
  }

  stopMonitoring(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
      console.log('⏹️ API health monitoring stopped');
    }
  }
}

export const apiHealthMonitor = new ApiHealthMonitor();
