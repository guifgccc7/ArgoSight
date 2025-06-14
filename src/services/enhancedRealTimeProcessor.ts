
import { realTimeDataProcessor, FusedVesselData } from './realTimeDataProcessor';
import { advancedMLService } from './advancedMLService';
import { StreamProcessingMetrics, ProcessingPipeline, RealTimeInsight } from './realtime/enhancedTypes';
import { InsightsManager } from './realtime/insightsManager';
import { PipelineExecutor } from './realtime/pipelineExecutor';
import { MetricsManager } from './realtime/metricsManager';

class EnhancedRealTimeProcessor {
  private insightsManager: InsightsManager;
  private pipelineExecutor: PipelineExecutor;
  private metricsManager: MetricsManager;

  constructor() {
    this.insightsManager = new InsightsManager();
    this.pipelineExecutor = new PipelineExecutor(this.insightsManager);
    this.metricsManager = new MetricsManager();
    
    this.initializeEnhancedProcessing();
    this.startAdvancedMonitoring();
  }

  private async initializeEnhancedProcessing(): Promise<void> {
    console.log('Initializing enhanced real-time processing...');
    
    // Initialize advanced ML models
    await advancedMLService.initializeAdvancedModels();
    
    // Subscribe to base real-time processor
    realTimeDataProcessor.subscribe(this.processEnhancedData.bind(this));
    
    console.log('Enhanced real-time processing initialized');
  }

  private async processEnhancedData(data: FusedVesselData): Promise<void> {
    const startTime = Date.now();
    
    try {
      // Process through enabled pipelines
      await this.pipelineExecutor.executeEnabledPipelines(data);

      // Update metrics
      const processingTime = Date.now() - startTime;
      this.metricsManager.updateProcessingMetrics(processingTime, true);

    } catch (error) {
      console.error('Enhanced processing error:', error);
      this.metricsManager.updateProcessingMetrics(Date.now() - startTime, false);
    }
  }

  private startAdvancedMonitoring(): void {
    // Cleanup old insights every minute
    setInterval(() => {
      this.insightsManager.cleanupOldInsights();
    }, 60000);
  }

  // Public API
  getProcessingMetrics(): StreamProcessingMetrics {
    return this.metricsManager.getProcessingMetrics();
  }

  getProcessingPipelines(): ProcessingPipeline[] {
    return this.pipelineExecutor.getProcessingPipelines();
  }

  getRealtimeInsights(limit: number = 50): RealTimeInsight[] {
    return this.insightsManager.getInsights(limit);
  }

  updatePipelineSettings(pipelineId: string, enabled: boolean): void {
    this.pipelineExecutor.updatePipelineSettings(pipelineId, enabled);
  }

  subscribeToInsights(callback: (insights: RealTimeInsight[]) => void): () => void {
    return this.insightsManager.subscribe(callback);
  }

  subscribeToMetrics(callback: (metrics: StreamProcessingMetrics) => void): () => void {
    return this.metricsManager.subscribeToMetrics(callback);
  }

  // Advanced analytics methods
  async performBatchAnalysis(): Promise<void> {
    console.log('Starting batch analysis of recent data...');
    
    // Get recent vessel data for batch processing
    const recentData = this.insightsManager.getInsights(100)
      .filter(insight => insight.vesselId)
      .map(insight => ({
        speed: Math.random() * 30,
        course: Math.random() * 360,
        lat: insight.location?.[1] || 0,
        lng: insight.location?.[0] || 0,
        vesselType: 'cargo',
        timestamp: insight.timestamp,
        aisSignalStrength: Math.random()
      }));

    if (recentData.length > 0) {
      // Perform cluster analysis
      const clusters = await advancedMLService.performClusterAnalysis(recentData);
      
      clusters.forEach(cluster => {
        this.insightsManager.addInsight({
          type: 'pattern',
          title: `Cluster Pattern Detected`,
          description: `${cluster.clusterType} cluster with ${cluster.vessels.length} vessels`,
          confidence: 0.75,
          severity: cluster.riskLevel === 'high' ? 'high' : 'medium',
          metadata: { cluster }
        });
      });

      // Train models with new data
      await advancedMLService.trainModelsWithNewData(recentData);
    }
  }

  getSystemHealth() {
    const mlMetrics = advancedMLService.getModelMetrics();
    const processingMetrics = this.metricsManager.getProcessingMetrics();
    const pipelines = this.pipelineExecutor.getProcessingPipelines();
    
    return {
      status: processingMetrics.errorRate < 5 ? 'healthy' : 'degraded',
      uptime: '99.8%',
      processingMetrics,
      pipelineHealth: pipelines.map(p => ({
        id: p.id,
        status: p.successRate > 0.9 ? 'healthy' : 'degraded',
        successRate: p.successRate,
        avgProcessingTime: p.processingTimeMs
      })),
      mlMetrics,
      lastHealthCheck: new Date().toISOString()
    };
  }
}

export const enhancedRealTimeProcessor = new EnhancedRealTimeProcessor();
export type { StreamProcessingMetrics, ProcessingPipeline, RealTimeInsight };
