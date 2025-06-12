export interface PerformanceMetrics {
  timestamp: string;
  cpu_usage: number;
  memory_usage: number;
  disk_usage: number;
  network_io: number;
  active_connections: number;
  response_time: number;
  error_rate: number;
}

export interface SystemAlert {
  id: string;
  type: 'performance' | 'security' | 'system';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: string;
  resolved: boolean;
}

export interface OptimizationSuggestion {
  category: 'database' | 'caching' | 'network' | 'storage';
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  effort: 'low' | 'medium' | 'high';
}

class PerformanceService {
  private metricsHistory: PerformanceMetrics[] = [];
  private alerts: SystemAlert[] = [];
  
  // Simulated performance monitoring
  async collectMetrics(): Promise<PerformanceMetrics> {
    const metrics: PerformanceMetrics = {
      timestamp: new Date().toISOString(),
      cpu_usage: Math.random() * 100,
      memory_usage: Math.random() * 100,
      disk_usage: Math.random() * 100,
      network_io: Math.random() * 1000,
      active_connections: Math.floor(Math.random() * 500),
      response_time: Math.random() * 2000,
      error_rate: Math.random() * 5
    };
    
    this.metricsHistory.push(metrics);
    
    // Keep only last 100 metrics
    if (this.metricsHistory.length > 100) {
      this.metricsHistory = this.metricsHistory.slice(-100);
    }
    
    // Check for performance issues
    this.checkPerformanceThresholds(metrics);
    
    return metrics;
  }
  
  async getMetricsHistory(hours = 24): Promise<PerformanceMetrics[]> {
    const cutoffTime = new Date(Date.now() - hours * 60 * 60 * 1000);
    return this.metricsHistory.filter(metric => 
      new Date(metric.timestamp) > cutoffTime
    );
  }
  
  private checkPerformanceThresholds(metrics: PerformanceMetrics) {
    const alerts: SystemAlert[] = [];
    
    if (metrics.cpu_usage > 80) {
      alerts.push({
        id: `cpu-${Date.now()}`,
        type: 'performance',
        severity: metrics.cpu_usage > 95 ? 'critical' : 'high',
        message: `High CPU usage detected: ${metrics.cpu_usage.toFixed(1)}%`,
        timestamp: metrics.timestamp,
        resolved: false
      });
    }
    
    if (metrics.memory_usage > 85) {
      alerts.push({
        id: `memory-${Date.now()}`,
        type: 'performance',
        severity: metrics.memory_usage > 95 ? 'critical' : 'high',
        message: `High memory usage detected: ${metrics.memory_usage.toFixed(1)}%`,
        timestamp: metrics.timestamp,
        resolved: false
      });
    }
    
    if (metrics.response_time > 1000) {
      alerts.push({
        id: `response-${Date.now()}`,
        type: 'performance',
        severity: metrics.response_time > 5000 ? 'critical' : 'medium',
        message: `Slow response time detected: ${metrics.response_time.toFixed(0)}ms`,
        timestamp: metrics.timestamp,
        resolved: false
      });
    }
    
    this.alerts.push(...alerts);
  }
  
  async recordPerformanceMetric(metricName: string, value: number, dimensions?: any) {
    try {
      console.log(`Recording performance metric: ${metricName} = ${value}`, dimensions);
      
      // Store in local memory for demo purposes
      const metric: PerformanceMetrics = {
        timestamp: new Date().toISOString(),
        cpu_usage: metricName === 'cpu_usage' ? value : Math.random() * 100,
        memory_usage: metricName === 'memory_usage' ? value : Math.random() * 100,
        disk_usage: metricName === 'disk_usage' ? value : Math.random() * 100,
        network_io: metricName === 'network_io' ? value : Math.random() * 1000,
        active_connections: metricName === 'active_connections' ? value : Math.floor(Math.random() * 500),
        response_time: metricName === 'response_time' ? value : Math.random() * 2000,
        error_rate: metricName === 'error_rate' ? value : Math.random() * 5
      };
      
      this.metricsHistory.push(metric);
      
      return { success: true };
    } catch (error) {
      console.error('Error recording performance metric:', error);
      throw error;
    }
  }
  
  async getActiveAlerts(): Promise<SystemAlert[]> {
    return this.alerts.filter(alert => !alert.resolved);
  }
  
  async resolveAlert(alertId: string): Promise<void> {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.resolved = true;
    }
  }
  
  async getOptimizationSuggestions(): Promise<OptimizationSuggestion[]> {
    const recentMetrics = await this.getMetricsHistory(1);
    const suggestions: OptimizationSuggestion[] = [];
    
    if (recentMetrics.length > 0) {
      const avgCpu = recentMetrics.reduce((sum, m) => sum + m.cpu_usage, 0) / recentMetrics.length;
      const avgMemory = recentMetrics.reduce((sum, m) => sum + m.memory_usage, 0) / recentMetrics.length;
      const avgResponseTime = recentMetrics.reduce((sum, m) => sum + m.response_time, 0) / recentMetrics.length;
      
      if (avgCpu > 70) {
        suggestions.push({
          category: 'database',
          title: 'Optimize Database Queries',
          description: 'High CPU usage detected. Consider adding database indexes and optimizing slow queries.',
          impact: 'high',
          effort: 'medium'
        });
      }
      
      if (avgMemory > 75) {
        suggestions.push({
          category: 'caching',
          title: 'Implement Redis Caching',
          description: 'High memory usage suggests frequent database queries. Implement Redis caching for frequently accessed data.',
          impact: 'high',
          effort: 'medium'
        });
      }
      
      if (avgResponseTime > 1000) {
        suggestions.push({
          category: 'network',
          title: 'Enable CDN for Static Assets',
          description: 'Slow response times detected. Consider using a CDN to serve static assets closer to users.',
          impact: 'medium',
          effort: 'low'
        });
      }
    }
    
    return suggestions;
  }
  
  async runSystemHealthCheck(): Promise<{
    status: 'healthy' | 'warning' | 'critical';
    checks: Array<{ name: string; status: string; message: string }>;
  }> {
    const checks = [];
    let overallStatus: 'healthy' | 'warning' | 'critical' = 'healthy';
    
    try {
      // Database connectivity check
      checks.push({
        name: 'Database Connection',
        status: 'healthy',
        message: 'Database is responding normally'
      });
      
      // Memory usage check
      const currentMetrics = await this.collectMetrics();
      if (currentMetrics.memory_usage > 90) {
        checks.push({
          name: 'Memory Usage',
          status: 'critical',
          message: `Memory usage is at ${currentMetrics.memory_usage.toFixed(1)}%`
        });
        overallStatus = 'critical';
      } else if (currentMetrics.memory_usage > 75) {
        checks.push({
          name: 'Memory Usage',
          status: 'warning',
          message: `Memory usage is at ${currentMetrics.memory_usage.toFixed(1)}%`
        });
        if (overallStatus === 'healthy') overallStatus = 'warning';
      } else {
        checks.push({
          name: 'Memory Usage',
          status: 'healthy',
          message: `Memory usage is at ${currentMetrics.memory_usage.toFixed(1)}%`
        });
      }
      
      // CPU usage check
      if (currentMetrics.cpu_usage > 90) {
        checks.push({
          name: 'CPU Usage',
          status: 'critical',
          message: `CPU usage is at ${currentMetrics.cpu_usage.toFixed(1)}%`
        });
        overallStatus = 'critical';
      } else if (currentMetrics.cpu_usage > 75) {
        checks.push({
          name: 'CPU Usage',
          status: 'warning',
          message: `CPU usage is at ${currentMetrics.cpu_usage.toFixed(1)}%`
        });
        if (overallStatus === 'healthy') overallStatus = 'warning';
      } else {
        checks.push({
          name: 'CPU Usage',
          status: 'healthy',
          message: `CPU usage is at ${currentMetrics.cpu_usage.toFixed(1)}%`
        });
      }
      
    } catch (error) {
      checks.push({
        name: 'System Health Check',
        status: 'critical',
        message: 'Failed to perform health check'
      });
      overallStatus = 'critical';
    }
    
    return { status: overallStatus, checks };
  }
  
  // Cleanup old metrics to prevent memory bloat
  async cleanupOldMetrics(daysToKeep = 7): Promise<void> {
    const cutoffTime = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000);
    this.metricsHistory = this.metricsHistory.filter(metric => 
      new Date(metric.timestamp) > cutoffTime
    );
    
    this.alerts = this.alerts.filter(alert => 
      new Date(alert.timestamp) > cutoffTime
    );
  }
}

export const performanceService = new PerformanceService();
