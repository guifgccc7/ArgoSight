interface ProductionConfig {
  mapbox: {
    accessToken: string;
    style: string;
  };
  email: {
    provider: string;
    apiKey: string;
    fromAddress: string;
  };
  monitoring: {
    logLevel: string;
    metricsInterval: number;
    alertThresholds: {
      errorRate: number;
      responseTime: number;
      diskUsage: number;
    };
  };
  database: {
    connectionPoolSize: number;
    queryTimeout: number;
    archivingEnabled: boolean;
    retentionDays: number;
  };
}

class ProductionConfigService {
  private config: ProductionConfig = {
    mapbox: {
      accessToken: 'pk.eyJ1IjoiZ3VpNzc3NyIsImEiOiJjbWJyenl1aDQwY2t1MmlzN2RlbG9jbnVhIn0.Ioi4GvqrDAPLuj_3qOglcg', // Demo token
      style: 'mapbox://styles/mapbox/dark-v11'
    },
    email: {
      provider: 'sendgrid',
      apiKey: 'SENDGRID_API_KEY',
      fromAddress: 'alerts@argosight.com'
    },
    monitoring: {
      logLevel: 'info',
      metricsInterval: 60000, // 1 minute
      alertThresholds: {
        errorRate: 5, // 5%
        responseTime: 2000, // 2 seconds
        diskUsage: 85 // 85%
      }
    },
    database: {
      connectionPoolSize: 20,
      queryTimeout: 30000, // 30 seconds
      archivingEnabled: true,
      retentionDays: 90
    }
  };

  getConfig(): ProductionConfig {
    return this.config;
  }

  updateConfig(updates: Partial<ProductionConfig>): void {
    this.config = { ...this.config, ...updates };
    console.log('Production configuration updated:', updates);
  }

  // Environment-specific configurations
  getEnvironmentConfig(): string {
    if (typeof window !== 'undefined') {
      // Client-side detection
      const hostname = window.location.hostname;
      if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
        return 'development';
      } else if (hostname.includes('staging')) {
        return 'staging';
      } else {
        return 'production';
      }
    }
    return 'production'; // Default to production
  }

  // API Key management (for display purposes only - actual keys should be in Supabase secrets)
  getRequiredAPIKeys(): { name: string; description: string; url: string; required: boolean }[] {
    return [
      {
        name: 'AISSTREAM_API_KEY',
        description: 'AISStream API key for real-time vessel tracking data',
        url: 'https://aisstream.io/',
        required: true
      },
      {
        name: 'OPENWEATHER_API_KEY',
        description: 'OpenWeather API key for weather data',
        url: 'https://openweathermap.org/api',
        required: true
      },
      {
        name: 'PLANET_API_KEY',
        description: 'Planet Labs API key for satellite imagery',
        url: 'https://www.planet.com/account/#/user-settings',
        required: false
      },
      {
        name: 'SENDGRID_API_KEY',
        description: 'SendGrid API key for email notifications',
        url: 'https://app.sendgrid.com/settings/api_keys',
        required: false
      },
      {
        name: 'SENTINEL_API_KEY',
        description: 'Sentinel Hub API key for satellite data',
        url: 'https://apps.sentinel-hub.com/dashboard/',
        required: false
      }
    ];
  }

  // Performance optimization settings
  getOptimizationSettings() {
    return {
      database: {
        enableQueryOptimization: true,
        useConnectionPooling: true,
        enableCaching: true,
        cacheTimeout: 300000 // 5 minutes
      },
      api: {
        enableRateLimiting: true,
        maxRequestsPerMinute: 1000,
        enableCompression: true
      },
      monitoring: {
        enableRealTimeMetrics: true,
        enableErrorTracking: true,
        enablePerformanceTracing: true
      }
    };
  }

  // Security settings for production
  getSecuritySettings() {
    return {
      cors: {
        allowedOrigins: [
          'https://argosight.com',
          'https://*.argosight.com',
          'https://dxjiouxgpycrildioigv.supabase.co'
        ]
      },
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
      },
      encryption: {
        enableDataEncryption: true,
        enableTransportEncryption: true
      }
    };
  }
}

export const productionConfigService = new ProductionConfigService();
