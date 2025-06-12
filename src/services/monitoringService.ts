import { supabase } from '@/integrations/supabase/client';

export interface SystemMetric {
  name: string;
  value: number;
  unit: string;
  component: string;
  timestamp: string;
  threshold?: number;
  status: 'normal' | 'warning' | 'critical';
}

export interface PerformanceMetrics {
  responseTime: number;
  throughput: number;
  errorRate: number;
  memoryUsage: number;
  cpuUsage: number;
  diskUsage: number;
  activeConnections: number;
}

class MonitoringService {
  private metrics: Map<string, SystemMetric[]> = new Map();
  private subscribers: Set<(metrics: PerformanceMetrics) => void> = new Set();
  private isMonitoring = false;

  startMonitoring(): void {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    console.log('Starting production monitoring...');

    // Collect metrics every minute
    setInterval(() => {
      this.collectSystemMetrics();
    }, 60000);

    // Monitor real-time performance every 10 seconds
    setInterval(() => {
      this.collectPerformanceMetrics();
    }, 10000);

    // Generate health reports every 5 minutes
    setInterval(() => {
      this.generateHealthReport();
    }, 5 * 60 * 1000);
  }

  private async collectSystemMetrics(): Promise<void> {
    try {
      const timestamp = new Date().toISOString();

      // Database metrics
      const { data: healthData } = await supabase.rpc('get_system_health');
      
      if (healthData) {
        await this.recordMetric({
          name: 'vessels_count',
          value: healthData.vessels_count || 0,
          unit: 'count',
          component: 'database',
          timestamp,
          status: 'normal'
        });

        await this.recordMetric({
          name: 'positions_last_24h',
          value: healthData.positions_last_24h || 0,
          unit: 'count',
          component: 'data_ingestion',
          timestamp,
          threshold: 1000,
          status: healthData.positions_last_24h > 1000 ? 'normal' : 'warning'
        });

        await this.recordMetric({
          name: 'api_errors_last_hour',
          value: healthData.api_errors_last_hour || 0,
          unit: 'count',
          component: 'api',
          timestamp,
          threshold: 10,
          status: healthData.api_errors_last_hour > 10 ? 'critical' : 'normal'
        });
      }

      // Simulated system metrics (in production, these would come from actual monitoring)
      await this.recordMetric({
        name: 'response_time',
        value: 150 + Math.random() * 100,
        unit: 'ms',
        component: 'api',
        timestamp,
        threshold: 2000,
        status: 'normal'
      });

      await this.recordMetric({
        name: 'memory_usage',
        value: 65 + Math.random() * 20,
        unit: 'percent',
        component: 'system',
        timestamp,
        threshold: 85,
        status: 'normal'
      });

      await this.recordMetric({
        name: 'cpu_usage',
        value: 45 + Math.random() * 30,
        unit: 'percent',
        component: 'system',
        timestamp,
        threshold: 80,
        status: 'normal'
      });

    } catch (error) {
      console.error('Error collecting system metrics:', error);
    }
  }

  private async recordMetric(metric: SystemMetric): Promise<void> {
    // Store in local cache
    const key = `${metric.component}.${metric.name}`;
    if (!this.metrics.has(key)) {
      this.metrics.set(key, []);
    }
    
    const metricHistory = this.metrics.get(key)!;
    metricHistory.push(metric);
    
    // Keep only last 100 entries
    if (metricHistory.length > 100) {
      metricHistory.shift();
    }

    // Store in database
    await supabase.from('system_metrics').insert({
      metric_name: metric.name,
      metric_value: metric.value,
      metric_unit: metric.unit,
      component: metric.component,
      timestamp_utc: metric.timestamp,
      metadata: {
        threshold: metric.threshold,
        status: metric.status
      }
    });
  }

  private collectPerformanceMetrics(): void {
    // Simulate real-time performance metrics
    const metrics: PerformanceMetrics = {
      responseTime: 150 + Math.random() * 100,
      throughput: 25 + Math.random() * 10,
      errorRate: Math.random() * 2,
      memoryUsage: 65 + Math.random() * 20,
      cpuUsage: 45 + Math.random() * 30,
      diskUsage: 70 + Math.random() * 15,
      activeConnections: 15 + Math.floor(Math.random() * 10)
    };

    // Notify subscribers
    this.subscribers.forEach(callback => callback(metrics));
  }

  private async generateHealthReport(): Promise<void> {
    console.log('Generating system health report...');
    
    const report = {
      timestamp: new Date().toISOString(),
      status: 'healthy',
      metrics: {
        total_vessels: await this.getLatestMetricValue('database.vessels_count'),
        data_ingestion_rate: await this.getLatestMetricValue('data_ingestion.positions_last_24h'),
        error_rate: await this.getLatestMetricValue('api.api_errors_last_hour'),
        response_time: await this.getLatestMetricValue('api.response_time'),
        memory_usage: await this.getLatestMetricValue('system.memory_usage'),
        cpu_usage: await this.getLatestMetricValue('system.cpu_usage')
      },
      alerts: await this.checkAlertConditions()
    };

    console.log('Health Report:', report);
  }

  private async getLatestMetricValue(metricKey: string): Promise<number> {
    const history = this.metrics.get(metricKey);
    return history && history.length > 0 ? history[history.length - 1].value : 0;
  }

  private async checkAlertConditions(): Promise<string[]> {
    const alerts: string[] = [];
    
    const errorRate = await this.getLatestMetricValue('api.api_errors_last_hour');
    if (errorRate > 10) {
      alerts.push(`High error rate detected: ${errorRate} errors in the last hour`);
    }

    const memoryUsage = await this.getLatestMetricValue('system.memory_usage');
    if (memoryUsage > 85) {
      alerts.push(`High memory usage: ${memoryUsage.toFixed(1)}%`);
    }

    const cpuUsage = await this.getLatestMetricValue('system.cpu_usage');
    if (cpuUsage > 80) {
      alerts.push(`High CPU usage: ${cpuUsage.toFixed(1)}%`);
    }

    return alerts;
  }

  // Database optimization
  async optimizeDatabase(): Promise<void> {
    console.log('Starting database optimization...');
    
    try {
      // Clean up old position data (keep last 30 days)
      const { data } = await supabase.rpc('cleanup_old_positions', { days_to_keep: 30 });
      console.log(`Archived ${data} old position records`);

      // Additional optimization queries could go here
      // For example: VACUUM, REINDEX, UPDATE STATISTICS, etc.
      
    } catch (error) {
      console.error('Database optimization failed:', error);
    }
  }

  // Public API
  subscribe(callback: (metrics: PerformanceMetrics) => void): () => void {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  getMetricHistory(component: string, metricName: string): SystemMetric[] {
    const key = `${component}.${metricName}`;
    return this.metrics.get(key) || [];
  }

  async getSystemHealth(): Promise<any> {
    const { data } = await supabase.rpc('get_system_health');
    return data;
  }

  async getRecentAlerts(): Promise<any[]> {
    const { data } = await supabase
      .from('api_integration_logs')
      .select('*')
      .gte('timestamp_utc', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .gte('status_code', 400)
      .order('timestamp_utc', { ascending: false })
      .limit(10);

    return data || [];
  }
}

export const monitoringService = new MonitoringService();
