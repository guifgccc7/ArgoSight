
export interface VesselBehaviorPattern {
  id: string;
  vesselId: string;
  patternType: 'ais_gap' | 'route_deviation' | 'speed_anomaly' | 'identity_switch' | 'dark_fishing' | 'loitering';
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  detectedAt: string;
  location: [number, number];
  description: string;
  evidence: {
    timeGap?: number;
    gapStart?: string;
    deviationDistance?: number;
    speedChange?: number;
    maxSpeed?: number;
    avgSpeed?: number;
    speedVariation?: number;
    courseChanges?: number;
    loiteringRadius?: number;
    duration?: number;
    previousIdentity?: string;
  };
}

export interface GhostVesselAlert {
  id: string;
  vesselId: string;
  vesselName: string;
  alertType: 'newly_dark' | 'suspicious_behavior' | 'sanction_evasion' | 'illegal_fishing';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  location: [number, number];
  timestamp: string;
  patterns: VesselBehaviorPattern[];
  recommendation: string;
}

class GhostFleetDetectionService {
  private detectionHistory: Map<string, VesselBehaviorPattern[]> = new Map();
  private subscribers: Set<(alerts: GhostVesselAlert[]) => void> = new Set();

  // Advanced detection algorithms
  detectSuspiciousBehavior(vessels: any[]): GhostVesselAlert[] {
    const alerts: GhostVesselAlert[] = [];

    vessels.forEach(vessel => {
      const patterns = this.analyzeVesselBehavior(vessel);
      
      if (patterns.length > 0) {
        const alert = this.generateAlert(vessel, patterns);
        if (alert) {
          alerts.push(alert);
        }
      }
    });

    return alerts;
  }

  private analyzeVesselBehavior(vessel: any): VesselBehaviorPattern[] {
    const patterns: VesselBehaviorPattern[] = [];
    const vesselHistory = this.detectionHistory.get(vessel.id) || [];

    // Detection Algorithm 1: AIS Signal Gaps
    if (vessel.status === 'dark' || this.hasSignalGap(vessel)) {
      patterns.push({
        vesselId: vessel.id,
        patternType: 'ais_gap',
        severity: this.calculateAISGapSeverity(vessel),
        confidence: 0.85,
        detectedAt: new Date().toISOString(),
        location: [vessel.lng, vessel.lat],
        description: 'Vessel has turned off AIS transponder or signal lost',
        evidence: {
          timeGap: this.calculateTimeGap(vessel)
        }
      });
    }

    // Detection Algorithm 2: Route Deviation
    const routeDeviation = this.detectRouteDeviation(vessel);
    if (routeDeviation.isDeviated) {
      patterns.push({
        vesselId: vessel.id,
        patternType: 'route_deviation',
        severity: routeDeviation.severity,
        confidence: 0.72,
        detectedAt: new Date().toISOString(),
        location: [vessel.lng, vessel.lat],
        description: 'Vessel has deviated significantly from expected route',
        evidence: {
          deviationDistance: routeDeviation.distance
        }
      });
    }

    // Detection Algorithm 3: Speed Anomalies
    const speedAnomaly = this.detectSpeedAnomaly(vessel, vesselHistory);
    if (speedAnomaly.isAnomalous) {
      patterns.push({
        vesselId: vessel.id,
        patternType: 'speed_anomaly',
        severity: speedAnomaly.severity,
        confidence: 0.68,
        detectedAt: new Date().toISOString(),
        location: [vessel.lng, vessel.lat],
        description: 'Unusual speed changes detected',
        evidence: {
          speedChange: speedAnomaly.change
        }
      });
    }

    // Detection Algorithm 4: Identity Switching
    if (this.detectIdentitySwitch(vessel)) {
      patterns.push({
        vesselId: vessel.id,
        patternType: 'identity_switch',
        severity: 'high',
        confidence: 0.91,
        detectedAt: new Date().toISOString(),
        location: [vessel.lng, vessel.lat],
        description: 'Potential vessel identity manipulation detected',
        evidence: {
          previousIdentity: this.getPreviousIdentity(vessel.id)
        }
      });
    }

    // Update detection history
    this.updateDetectionHistory(vessel.id, patterns);

    return patterns;
  }

  private hasSignalGap(vessel: any): boolean {
    const lastUpdate = new Date(vessel.lastUpdate);
    const now = new Date();
    const timeDiff = now.getTime() - lastUpdate.getTime();
    return timeDiff > 2 * 60 * 60 * 1000; // 2 hours
  }

  private calculateAISGapSeverity(vessel: any): 'low' | 'medium' | 'high' | 'critical' {
    const timeSinceLastUpdate = this.calculateTimeGap(vessel);
    
    if (timeSinceLastUpdate > 24) return 'critical';
    if (timeSinceLastUpdate > 12) return 'high';
    if (timeSinceLastUpdate > 6) return 'medium';
    return 'low';
  }

  private calculateTimeGap(vessel: any): number {
    const lastUpdate = new Date(vessel.lastUpdate);
    const now = new Date();
    return (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60); // hours
  }

  private detectRouteDeviation(vessel: any): { isDeviated: boolean; distance: number; severity: 'low' | 'medium' | 'high' | 'critical' } {
    // Simulate route analysis - in reality this would use historical route data
    const randomDeviation = Math.random();
    
    if (randomDeviation > 0.85) {
      const distance = Math.random() * 100 + 50; // 50-150 km deviation
      let severity: 'low' | 'medium' | 'high' | 'critical' = 'low';
      
      if (distance > 120) severity = 'critical';
      else if (distance > 80) severity = 'high';
      else if (distance > 40) severity = 'medium';
      
      return { isDeviated: true, distance, severity };
    }
    
    return { isDeviated: false, distance: 0, severity: 'low' };
  }

  private detectSpeedAnomaly(vessel: any, history: VesselBehaviorPattern[]): { isAnomalous: boolean; change: number; severity: 'low' | 'medium' | 'high' | 'critical' } {
    // Simulate speed anomaly detection
    const normalSpeed = vessel.vesselType === 'tanker' ? 12 : vessel.vesselType === 'cargo' ? 15 : 10;
    const speedDiff = Math.abs(vessel.speed - normalSpeed);
    
    if (speedDiff > 8) {
      let severity: 'low' | 'medium' | 'high' | 'critical' = 'low';
      
      if (speedDiff > 20) severity = 'critical';
      else if (speedDiff > 15) severity = 'high';
      else if (speedDiff > 10) severity = 'medium';
      
      return { isAnomalous: true, change: speedDiff, severity };
    }
    
    return { isAnomalous: false, change: 0, severity: 'low' };
  }

  private detectIdentitySwitch(vessel: any): boolean {
    // Simulate identity switch detection - would check against vessel registry
    return Math.random() > 0.95; // 5% chance of detected identity switch
  }

  private getPreviousIdentity(vesselId: string): string {
    return `PREV-${vesselId.slice(-4)}`;
  }

  private updateDetectionHistory(vesselId: string, patterns: VesselBehaviorPattern[]) {
    const existing = this.detectionHistory.get(vesselId) || [];
    const updated = [...existing, ...patterns].slice(-50); // Keep last 50 patterns
    this.detectionHistory.set(vesselId, updated);
  }

  private generateAlert(vessel: any, patterns: VesselBehaviorPattern[]): GhostVesselAlert | null {
    if (patterns.length === 0) return null;

    // Calculate overall risk level
    const maxSeverity = this.getMaxSeverity(patterns);
    const riskLevel = this.calculateRiskLevel(patterns);

    return {
      id: `alert-${Date.now()}-${vessel.id}`,
      vesselId: vessel.id,
      vesselName: vessel.name,
      alertType: this.determineAlertType(patterns),
      riskLevel,
      location: [vessel.lng, vessel.lat],
      timestamp: new Date().toISOString(),
      patterns,
      recommendation: this.generateRecommendation(patterns, riskLevel)
    };
  }

  private getMaxSeverity(patterns: VesselBehaviorPattern[]): 'low' | 'medium' | 'high' | 'critical' {
    const severityOrder = { low: 1, medium: 2, high: 3, critical: 4 };
    return patterns.reduce((max, pattern) => 
      severityOrder[pattern.severity] > severityOrder[max] ? pattern.severity : max, 'low');
  }

  private calculateRiskLevel(patterns: VesselBehaviorPattern[]): 'low' | 'medium' | 'high' | 'critical' {
    const criticalPatterns = patterns.filter(p => p.severity === 'critical').length;
    const highPatterns = patterns.filter(p => p.severity === 'high').length;
    
    if (criticalPatterns > 0) return 'critical';
    if (highPatterns > 1) return 'high';
    if (patterns.length > 2) return 'medium';
    return 'low';
  }

  private determineAlertType(patterns: VesselBehaviorPattern[]): 'newly_dark' | 'suspicious_behavior' | 'sanction_evasion' | 'illegal_fishing' {
    if (patterns.some(p => p.patternType === 'ais_gap')) return 'newly_dark';
    if (patterns.some(p => p.patternType === 'identity_switch')) return 'sanction_evasion';
    if (patterns.length > 2) return 'suspicious_behavior';
    return 'illegal_fishing';
  }

  private generateRecommendation(patterns: VesselBehaviorPattern[], riskLevel: string): string {
    const recommendations = {
      critical: 'Immediate investigation required. Alert authorities and increase monitoring.',
      high: 'Priority investigation needed. Enhanced tracking recommended.',
      medium: 'Monitor closely and investigate when resources permit.',
      low: 'Continue routine monitoring with automated alerts.'
    };
    
    return recommendations[riskLevel as keyof typeof recommendations];
  }

  // Public methods
  subscribe(callback: (alerts: GhostVesselAlert[]) => void) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  getDetectionStats() {
    return {
      totalVesselsMonitored: this.detectionHistory.size,
      activeAlerts: Array.from(this.detectionHistory.values()).flat().length,
      detectionAlgorithms: ['AIS Gap Detection', 'Route Deviation', 'Speed Anomaly', 'Identity Switch'],
      confidenceThreshold: 0.65
    };
  }

  exportDetectionData(): any[] {
    const data: any[] = [];
    this.detectionHistory.forEach((patterns, vesselId) => {
      patterns.forEach(pattern => {
        data.push({
          vesselId,
          ...pattern,
          exportedAt: new Date().toISOString()
        });
      });
    });
    return data;
  }
}

export const ghostFleetDetectionService = new GhostFleetDetectionService();
