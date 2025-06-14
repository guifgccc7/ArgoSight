
import { FusedVesselData } from './types';
import { mlAnalysisService, VesselDataPoint } from '../mlAnalysisService';
import { enhancedPatternService } from '../enhancedPatternService';
import { AlertTrigger } from './alertTrigger';

export class DataProcessor {
  private alertTrigger: AlertTrigger;
  private subscribers: Set<(data: FusedVesselData) => void> = new Set();

  constructor() {
    this.alertTrigger = new AlertTrigger();
  }

  async processVesselData(data: VesselDataPoint, sourceId: string): Promise<void> {
    const startTime = Date.now();
    
    try {
      // Perform ML analysis
      const mlAnalysis = await mlAnalysisService.analyzeVesselBehavior(data);

      // Get enhanced patterns
      const patterns = await enhancedPatternService.analyzeVesselWithML({
        id: data.vesselType + '-' + Date.now(),
        ...data
      });

      // Create fused data object
      const fusedData: FusedVesselData = {
        ...data,
        sources: [sourceId],
        confidence: mlAnalysis.confidence,
        reliability: 0.95, // Default reliability
        fusedAt: new Date().toISOString()
      };

      // Check for critical alerts
      if (mlAnalysis.anomalyScore > 80 || patterns.some(p => p.severity === 'critical')) {
        await this.alertTrigger.triggerAlert(fusedData, mlAnalysis, patterns);
      }

      // Notify subscribers
      this.notifySubscribers(fusedData);

      return Promise.resolve();

    } catch (error) {
      console.error('Error processing vessel data:', error);
      throw error;
    }
  }

  subscribe(callback: (data: FusedVesselData) => void): () => void {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  private notifySubscribers(data: FusedVesselData): void {
    this.subscribers.forEach(callback => callback(data));
  }
}
