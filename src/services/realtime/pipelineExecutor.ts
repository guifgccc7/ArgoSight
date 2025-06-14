
import { ProcessingPipeline } from './enhancedTypes';
import { FusedVesselData } from './types';
import { InsightsManager } from './insightsManager';
import { advancedMLService } from '../advancedMLService';
import { alertsService } from '../alertsService';

export class PipelineExecutor {
  private processingPipelines: ProcessingPipeline[] = [
    {
      id: 'data_validation',
      name: 'Data Validation',
      enabled: true,
      priority: 1,
      processingTimeMs: 5,
      successRate: 0.995
    },
    {
      id: 'anomaly_detection',
      name: 'ML Anomaly Detection',
      enabled: true,
      priority: 2,
      processingTimeMs: 45,
      successRate: 0.92
    },
    {
      id: 'predictive_analysis',
      name: 'Predictive Analytics',
      enabled: true,
      priority: 3,
      processingTimeMs: 80,
      successRate: 0.88
    },
    {
      id: 'alert_generation',
      name: 'Alert Generation',
      enabled: true,
      priority: 4,
      processingTimeMs: 15,
      successRate: 0.98
    }
  ];

  constructor(private insightsManager: InsightsManager) {}

  async executeEnabledPipelines(data: FusedVesselData): Promise<void> {
    const enabledPipelines = this.processingPipelines
      .filter(p => p.enabled)
      .sort((a, b) => a.priority - b.priority);

    for (const pipeline of enabledPipelines) {
      await this.executePipeline(pipeline, data);
    }
  }

  private async executePipeline(pipeline: ProcessingPipeline, data: FusedVesselData): Promise<void> {
    const pipelineStart = Date.now();

    try {
      switch (pipeline.id) {
        case 'data_validation':
          await this.validateData(data);
          break;
        
        case 'anomaly_detection':
          await this.performAnomalyDetection(data);
          break;
        
        case 'predictive_analysis':
          await this.performPredictiveAnalysis(data);
          break;
        
        case 'alert_generation':
          await this.generateAlerts(data);
          break;
      }

      pipeline.successRate = (pipeline.successRate * 0.99) + (0.01 * 1);
      
    } catch (error) {
      console.error(`Pipeline ${pipeline.id} failed:`, error);
      pipeline.successRate = (pipeline.successRate * 0.99) + (0.01 * 0);
    }

    pipeline.processingTimeMs = Date.now() - pipelineStart;
  }

  private async validateData(data: FusedVesselData): Promise<void> {
    const validationErrors: string[] = [];

    if (!data.lat || Math.abs(data.lat) > 90) {
      validationErrors.push('Invalid latitude');
    }

    if (!data.lng || Math.abs(data.lng) > 180) {
      validationErrors.push('Invalid longitude');
    }

    if (data.speed < 0 || data.speed > 50) {
      validationErrors.push('Suspicious speed value');
    }

    if (validationErrors.length > 0) {
      this.insightsManager.addInsight({
        type: 'alert',
        title: 'Data Validation Warning',
        description: `Data quality issues: ${validationErrors.join(', ')}`,
        confidence: 0.95,
        severity: 'medium',
        vesselId: data.vesselType,
        metadata: { validationErrors, originalData: data }
      });
    }
  }

  private async performAnomalyDetection(data: FusedVesselData): Promise<void> {
    const vesselData = {
      speed: data.speed,
      course: data.course,
      lat: data.lat,
      lng: data.lng,
      vesselType: data.vesselType,
      timestamp: data.fusedAt,
      aisSignalStrength: data.reliability
    };

    const anomalies = await advancedMLService.detectAdvancedAnomalies([vesselData]);
    
    anomalies.forEach(anomaly => {
      this.insightsManager.addInsight({
        type: 'anomaly',
        title: `${anomaly.anomalyType.toUpperCase()} Anomaly Detected`,
        description: anomaly.description,
        confidence: anomaly.confidence,
        severity: anomaly.severity,
        vesselId: anomaly.vesselId,
        location: [data.lng, data.lat],
        metadata: { anomaly, recommendations: anomaly.recommendations }
      });
    });
  }

  private async performPredictiveAnalysis(data: FusedVesselData): Promise<void> {
    const vesselData = {
      speed: data.speed,
      course: data.course,
      lat: data.lat,
      lng: data.lng,
      vesselType: data.vesselType,
      timestamp: data.fusedAt,
      aisSignalStrength: data.reliability
    };

    const predictions = await advancedMLService.performPredictiveAnalysis([vesselData]);
    
    predictions.forEach(prediction => {
      this.insightsManager.addInsight({
        type: 'prediction',
        title: `${prediction.predictionType.replace('_', ' ').toUpperCase()} Prediction`,
        description: `Confidence: ${(prediction.confidence * 100).toFixed(1)}% - ${prediction.timeHorizon}`,
        confidence: prediction.confidence,
        severity: prediction.confidence > 0.8 ? 'high' : 'medium',
        vesselId: prediction.vesselId,
        location: [data.lng, data.lat],
        metadata: { prediction, factors: prediction.factors }
      });
    });
  }

  private async generateAlerts(data: FusedVesselData): Promise<void> {
    const criticalInsights = this.insightsManager.getRecentCriticalInsights();
    
    if (criticalInsights.length > 0) {
      const alert = {
        id: `ENHANCED-${Date.now()}`,
        type: 'ghost_vessel' as const,
        severity: 'critical' as const,
        title: 'Enhanced ML Detection Alert',
        description: `Multiple critical insights detected for vessel ${data.vesselType}`,
        location: {
          lat: data.lat,
          lng: data.lng,
          name: `${data.lat.toFixed(2)}, ${data.lng.toFixed(2)}`
        },
        timestamp: new Date().toISOString(),
        status: 'new' as const,
        source: 'ai_detection' as const,
        metadata: {
          insights: criticalInsights,
          confidence: Math.max(...criticalInsights.map(i => i.confidence))
        }
      };

      alertsService.addAlert(alert);
    }
  }

  getProcessingPipelines(): ProcessingPipeline[] {
    return [...this.processingPipelines];
  }

  updatePipelineSettings(pipelineId: string, enabled: boolean): void {
    const pipeline = this.processingPipelines.find(p => p.id === pipelineId);
    if (pipeline) {
      pipeline.enabled = enabled;
      console.log(`Pipeline ${pipelineId} ${enabled ? 'enabled' : 'disabled'}`);
    }
  }
}
