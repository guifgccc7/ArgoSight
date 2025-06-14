
import { FusedVesselData } from './types';
import { alertsService } from '../alertsService';

export class AlertTrigger {
  async triggerAlert(
    vesselData: FusedVesselData, 
    mlAnalysis: any, 
    patterns: any[]
  ): Promise<void> {
    const criticalPatterns = patterns.filter(p => p.severity === 'critical');
    
    if (criticalPatterns.length > 0 || mlAnalysis.anomalyScore > 90) {
      const alert = {
        id: `RT-${Date.now()}`,
        type: 'ghost_vessel' as const,
        severity: 'critical' as const,
        title: `Real-time Threat Detection: ${vesselData.vesselType}`,
        description: `High-confidence threat detected with ${mlAnalysis.anomalyScore.toFixed(1)}% anomaly score`,
        location: {
          lat: vesselData.lat,
          lng: vesselData.lng,
          name: `${vesselData.lat.toFixed(2)}, ${vesselData.lng.toFixed(2)}`
        },
        timestamp: new Date().toISOString(),
        status: 'new' as const,
        source: 'ai_detection' as const,
        metadata: {
          confidence: mlAnalysis.confidence,
          anomalyScore: mlAnalysis.anomalyScore,
          sources: vesselData.sources,
          reliability: vesselData.reliability
        }
      };

      alertsService.addAlert(alert);
    }
  }
}
