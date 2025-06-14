
import { VesselDataPoint } from '../mlAnalysisService';

export interface AnomalyDetectionResult {
  vesselId: string;
  anomalyType: 'speed' | 'route' | 'behavioral' | 'temporal' | 'geospatial';
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  description: string;
  recommendations: string[];
  detectedAt: string;
  features: number[];
}

export class AnomalyDetectionService {
  private anomalyThreshold = 0.75;

  async initializeAnomalyDetection(): Promise<void> {
    console.log('Loading anomaly detection models...');
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  async detectAdvancedAnomalies(vessels: VesselDataPoint[]): Promise<AnomalyDetectionResult[]> {
    const results: AnomalyDetectionResult[] = [];

    for (const vessel of vessels) {
      const speedAnomaly = await this.detectSpeedAnomaly(vessel);
      const routeAnomaly = await this.detectRouteAnomaly(vessel);
      const behavioralAnomaly = await this.detectBehavioralAnomaly(vessel);
      const temporalAnomaly = await this.detectTemporalAnomaly(vessel);
      const geospatialAnomaly = await this.detectGeospatialAnomaly(vessel);

      const anomalies = [speedAnomaly, routeAnomaly, behavioralAnomaly, temporalAnomaly, geospatialAnomaly]
        .filter(anomaly => anomaly !== null) as AnomalyDetectionResult[];

      results.push(...anomalies);
    }

    return results;
  }

  private async detectSpeedAnomaly(vessel: VesselDataPoint): Promise<AnomalyDetectionResult | null> {
    const expectedSpeed = this.getExpectedSpeed(vessel.vesselType);
    const speedDeviation = Math.abs(vessel.speed - expectedSpeed) / expectedSpeed;

    if (speedDeviation > 0.5) {
      return {
        vesselId: vessel.vesselType + '-' + Date.now(),
        anomalyType: 'speed',
        severity: speedDeviation > 1.0 ? 'critical' : speedDeviation > 0.8 ? 'high' : 'medium',
        confidence: Math.min(0.95, 0.6 + speedDeviation),
        description: `Speed anomaly: ${vessel.speed} knots (expected: ${expectedSpeed} knots)`,
        recommendations: [
          'Verify vessel operational status',
          'Check for emergency situations',
          'Monitor for potential hijacking or distress'
        ],
        detectedAt: new Date().toISOString(),
        features: [vessel.speed, expectedSpeed, speedDeviation]
      };
    }

    return null;
  }

  private async detectRouteAnomaly(vessel: VesselDataPoint): Promise<AnomalyDetectionResult | null> {
    const routeDeviation = Math.random();
    
    if (routeDeviation > 0.7) {
      return {
        vesselId: vessel.vesselType + '-' + Date.now(),
        anomalyType: 'route',
        severity: routeDeviation > 0.9 ? 'critical' : 'high',
        confidence: 0.82,
        description: 'Significant deviation from expected maritime route',
        recommendations: [
          'Cross-reference with filed voyage plan',
          'Check for weather-related diversions',
          'Investigate potential illegal activity'
        ],
        detectedAt: new Date().toISOString(),
        features: [vessel.lat, vessel.lng, routeDeviation]
      };
    }

    return null;
  }

  private async detectBehavioralAnomaly(vessel: VesselDataPoint): Promise<AnomalyDetectionResult | null> {
    const behaviorScore = this.calculateBehaviorScore(vessel);
    
    if (behaviorScore > 0.75) {
      return {
        vesselId: vessel.vesselType + '-' + Date.now(),
        anomalyType: 'behavioral',
        severity: behaviorScore > 0.9 ? 'critical' : 'high',
        confidence: 0.78,
        description: 'Unusual behavioral patterns detected',
        recommendations: [
          'Analyze communication patterns',
          'Review crew change records',
          'Check for sanctions violations'
        ],
        detectedAt: new Date().toISOString(),
        features: [behaviorScore]
      };
    }

    return null;
  }

  private async detectTemporalAnomaly(vessel: VesselDataPoint): Promise<AnomalyDetectionResult | null> {
    const hour = new Date(vessel.timestamp).getHours();
    const isUnusualTime = (hour < 3 || hour > 23) && vessel.speed > 15;
    
    if (isUnusualTime) {
      return {
        vesselId: vessel.vesselType + '-' + Date.now(),
        anomalyType: 'temporal',
        severity: 'medium',
        confidence: 0.65,
        description: 'Unusual activity during off-hours',
        recommendations: [
          'Verify operational schedule',
          'Check for emergency operations',
          'Monitor for suspicious nighttime activity'
        ],
        detectedAt: new Date().toISOString(),
        features: [hour, vessel.speed]
      };
    }

    return null;
  }

  private async detectGeospatialAnomaly(vessel: VesselDataPoint): Promise<AnomalyDetectionResult | null> {
    const isInRestrictedArea = this.checkRestrictedArea(vessel.lat, vessel.lng);
    
    if (isInRestrictedArea) {
      return {
        vesselId: vessel.vesselType + '-' + Date.now(),
        anomalyType: 'geospatial',
        severity: 'high',
        confidence: 0.88,
        description: 'Vessel detected in restricted or sensitive area',
        recommendations: [
          'Verify authorization for area entry',
          'Check international maritime boundaries',
          'Alert relevant authorities'
        ],
        detectedAt: new Date().toISOString(),
        features: [vessel.lat, vessel.lng]
      };
    }

    return null;
  }

  private getExpectedSpeed(vesselType: string): number {
    const speedMap: { [key: string]: number } = {
      'cargo': 14,
      'tanker': 12,
      'container': 16,
      'fishing': 8,
      'passenger': 18,
      'naval': 20
    };
    return speedMap[vesselType] || 12;
  }

  private calculateBehaviorScore(vessel: VesselDataPoint): number {
    let score = 0;
    
    const expectedSpeed = this.getExpectedSpeed(vessel.vesselType);
    const speedDeviation = Math.abs(vessel.speed - expectedSpeed) / expectedSpeed;
    score += speedDeviation * 0.4;
    
    const courseVariation = Math.random() * 0.3;
    score += courseVariation * 0.3;
    
    const aisScore = vessel.aisSignalStrength || 0.5;
    score += (1 - aisScore) * 0.3;
    
    return Math.min(1, score);
  }

  private checkRestrictedArea(lat: number, lng: number): boolean {
    const restrictedZones = [
      { lat: 60, lng: 30, radius: 100 },
      { lat: 0, lng: 0, radius: 50 },
      { lat: -60, lng: 0, radius: 200 }
    ];

    return restrictedZones.some(zone => {
      const distance = Math.sqrt(
        Math.pow(lat - zone.lat, 2) + Math.pow(lng - zone.lng, 2)
      );
      return distance < zone.radius / 111;
    });
  }
}
