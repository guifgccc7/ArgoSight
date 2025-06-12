import { supabase } from '@/integrations/supabase/client';

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical';
  uptime: number;
  responseTime: number;
  errorRate: number;
  activeUsers: number;
  dataFreshness: number;
}

class PerformanceService {
  private metrics: PerformanceMetric[] = [];
  private performanceObserver?: PerformanceObserver;

  constructor() {
    this.initializePerformanceMonitoring();
  }

  private initializePerformanceMonitoring() {
    // Monitor page load times
    if (typeof window !== 'undefined' && 'performance' in window) {
      this.recordPageLoadMetrics();
      this.initializePerformanceObserver();
    }
  }

  private recordPageLoadMetrics() {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    if (navigation) {
      this.addMetric({
        name: 'page_load_time',
        value: navigation.loadEventEnd - navigation.fetchStart,
        unit: 'ms',
        timestamp: new Date().toISOString(),
        metadata: {
          dns_lookup: navigation.domainLookupEnd - navigation.domainLookupStart,
          tcp_connect: navigation.connectEnd - navigation.connectStart,
          server_response: navigation.responseEnd - navigation.requestStart,
          dom_processing: navigation.domContentLoadedEventEnd - navigation.responseEnd
        }
      });
    }
  }

  private initializePerformanceObserver() {
    if ('PerformanceObserver' in window) {
      this.performanceObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'measure') {
            this.addMetric({
              name: entry.name,
              value: entry.duration,
              unit: 'ms',
              timestamp: new Date().toISOString()
            });
          }
        });
      });

      this.performanceObserver.observe({ entryTypes: ['measure', 'navigation'] });
    }
  }

  addMetric(metric: PerformanceMetric) {
    this.metrics.push(metric);
    
    // Keep only last 1000 metrics in memory
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000);
    }

    // Send critical metrics to backend
    if (this.isCriticalMetric(metric)) {
      this.sendMetricToBackend(metric);
    }
  }

  private isCriticalMetric(metric: PerformanceMetric): boolean {
    const criticalMetrics = ['page_load_time', 'api_response_time', 'error_rate'];
    return criticalMetrics.includes(metric.name) || metric.value > 5000; // Over 5 seconds
  }

  private async sendMetricToBackend(metric: PerformanceMetric) {
    try {
      await supabase.from('analytics_data').insert({
        metric_name: metric.name,
        metric_value: metric.value,
        dimensions: {
          unit: metric.unit,
          metadata: metric.metadata,
          user_agent: navigator.userAgent,
          viewport: `${window.innerWidth}x${window.innerHeight}`
        },
        timestamp: metric.timestamp
      });
    } catch (error) {
      console.error('Failed to send metric to backend:', error);
    }
  }

  measureApiCall<T>(name: string, apiCall: Promise<T>): Promise<T> {
    const startTime = performance.now();
    
    return apiCall
      .then((result) => {
        const endTime = performance.now();
        this.addMetric({
          name: `api_${name}_success`,
          value: endTime - startTime,
          unit: 'ms',
          timestamp: new Date().toISOString()
        });
        return result;
      })
      .catch((error) => {
        const endTime = performance.now();
        this.addMetric({
          name: `api_${name}_error`,
          value: endTime - startTime,
          unit: 'ms',
          timestamp: new Date().toISOString(),
          metadata: { error: error.message }
        });
        throw error;
      });
  }

  async getSystemHealth(): Promise<SystemHealth> {
    const now = Date.now();
    const oneHourAgo = new Date(now - 60 * 60 * 1000).toISOString();

    try {
      // Test database connectivity
      const dbStart = performance.now();
      await supabase.from('profiles').select('id').limit(1);
      const dbResponseTime = performance.now() - dbStart;

      // Get recent metrics
      const recentMetrics = this.metrics.filter(
        m => new Date(m.timestamp).getTime() > now - 60 * 60 * 1000
      );

      const errors = recentMetrics.filter(m => m.name.includes('error'));
      const successfulCalls = recentMetrics.filter(m => m.name.includes('success'));
      
      const errorRate = successfulCalls.length > 0 
        ? (errors.length / (errors.length + successfulCalls.length)) * 100 
        : 0;

      const avgResponseTime = recentMetrics
        .filter(m => m.name.includes('api_'))
        .reduce((sum, m) => sum + m.value, 0) / Math.max(recentMetrics.length, 1);

      // Mock data freshness (in production, this would check actual data timestamps)
      const dataFreshness = Math.random() * 60; // 0-60 seconds

      let status: 'healthy' | 'warning' | 'critical' = 'healthy';
      if (errorRate > 10 || avgResponseTime > 3000 || dataFreshness > 300) {
        status = 'critical';
      } else if (errorRate > 5 || avgResponseTime > 1000 || dataFreshness > 120) {
        status = 'warning';
      }

      return {
        status,
        uptime: now - performance.timeOrigin,
        responseTime: avgResponseTime,
        errorRate,
        activeUsers: Math.floor(Math.random() * 50) + 10, // Mock data
        dataFreshness
      };
    } catch (error) {
      console.error('Error getting system health:', error);
      return {
        status: 'critical',
        uptime: 0,
        responseTime: 0,
        errorRate: 100,
        activeUsers: 0,
        dataFreshness: 0
      };
    }
  }

  getMetrics(timeRange?: { start: string; end: string }): PerformanceMetric[] {
    if (!timeRange) return this.metrics;

    const start = new Date(timeRange.start).getTime();
    const end = new Date(timeRange.end).getTime();

    return this.metrics.filter(m => {
      const timestamp = new Date(m.timestamp).getTime();
      return timestamp >= start && timestamp <= end;
    });
  }

  clearMetrics() {
    this.metrics = [];
  }

  startMeasurement(name: string) {
    performance.mark(`${name}_start`);
  }

  endMeasurement(name: string) {
    performance.mark(`${name}_end`);
    performance.measure(name, `${name}_start`, `${name}_end`);
  }

  // Bundle size analysis
  async analyzeBundleSize() {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      
      this.addMetric({
        name: 'network_connection',
        value: connection.downlink || 0,
        unit: 'mbps',
        timestamp: new Date().toISOString(),
        metadata: {
          effective_type: connection.effectiveType,
          rtt: connection.rtt
        }
      });
    }

    // Analyze loaded resources
    const resources = performance.getEntriesByType('resource');
    const totalSize = resources.reduce((sum, resource: any) => {
      return sum + (resource.transferSize || 0);
    }, 0);

    this.addMetric({
      name: 'total_bundle_size',
      value: totalSize,
      unit: 'bytes',
      timestamp: new Date().toISOString(),
      metadata: {
        resource_count: resources.length
      }
    });
  }

  destroy() {
    if (this.performanceObserver) {
      this.performanceObserver.disconnect();
    }
  }
}

export const performanceService = new PerformanceService();

// Auto-cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    performanceService.destroy();
  });
}
