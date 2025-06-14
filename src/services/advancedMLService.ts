
import { VesselDataPoint } from './mlAnalysisService';
import { AnomalyDetectionService, AnomalyDetectionResult } from './ml/anomalyDetectionService';
import { PredictiveAnalysisService, PredictiveAnalysisResult } from './ml/predictiveAnalysisService';
import { ClusterAnalysisService, ClusterAnalysisResult } from './ml/clusterAnalysisService';
import { MLTrainingService } from './ml/mlTrainingService';

// Re-export types for backward compatibility
export type { AnomalyDetectionResult, PredictiveAnalysisResult, ClusterAnalysisResult };

class AdvancedMLService {
  private anomalyService: AnomalyDetectionService;
  private predictiveService: PredictiveAnalysisService;
  private clusterService: ClusterAnalysisService;
  private trainingService: MLTrainingService;
  private anomalyThreshold = 0.75;
  private learningRate = 0.01;
  
  constructor() {
    this.anomalyService = new AnomalyDetectionService();
    this.predictiveService = new PredictiveAnalysisService();
    this.clusterService = new ClusterAnalysisService();
    this.trainingService = new MLTrainingService();
  }

  async initializeAdvancedModels(): Promise<void> {
    console.log('Initializing advanced ML models...');
    
    await Promise.all([
      this.anomalyService.initializeAnomalyDetection(),
      this.predictiveService.initializePredictiveModels(),
      this.clusterService.initializeClusteringModels()
    ]);
    
    console.log('Advanced ML models initialized successfully');
  }

  async detectAdvancedAnomalies(vessels: VesselDataPoint[]): Promise<AnomalyDetectionResult[]> {
    return await this.anomalyService.detectAdvancedAnomalies(vessels);
  }

  async performPredictiveAnalysis(vessels: VesselDataPoint[]): Promise<PredictiveAnalysisResult[]> {
    return await this.predictiveService.performPredictiveAnalysis(vessels);
  }

  async performClusterAnalysis(vessels: VesselDataPoint[]): Promise<ClusterAnalysisResult[]> {
    return await this.clusterService.performClusterAnalysis(vessels);
  }

  async trainModelsWithNewData(data: VesselDataPoint[]): Promise<void> {
    return await this.trainingService.trainModelsWithNewData(data);
  }

  getModelMetrics() {
    return {
      ...this.trainingService.getModelMetrics(),
      anomalyThreshold: this.anomalyThreshold
    };
  }
}

export const advancedMLService = new AdvancedMLService();
