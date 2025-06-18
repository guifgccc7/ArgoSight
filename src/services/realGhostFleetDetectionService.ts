
import { supabase } from '@/integrations/supabase/client';
import { VesselBehaviorPattern, GhostVesselAlert } from './ghostFleetDetectionService';

interface RealVesselData {
  mmsi: string;
  latitude: number;
  longitude: number;
  speed_knots: number;
  course_degrees: number;
  timestamp_utc: string;
  source_feed: string;
  vessel_name?: string;
}

class RealGhostFleetDetectionService {
  private subscribers: Set<(alerts: GhostVesselAlert[]) => void> = new Set();
  private detectionHistory: Map<string, VesselBehaviorPattern[]> = new Map();
  private vesselHistory: Map<string, RealVesselData[]> = new Map();

  async analyzeRealVesselData(): Promise<GhostVesselAlert[]> {
    const alerts: GhostVesselAlert[] = [];

    try {
      // Get vessel positions from last 24 hours
      const { data: positions, error } = await supabase
        .from('vessel_positions')
        .select(`
          mmsi, latitude, longitude, speed_knots, course_degrees, 
          timestamp_utc, source_feed,
          vessels(vessel_name)
        `)
        .gte('timestamp_utc', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('timestamp_utc', { ascending: false });

      if (error) {
        console.error('Error fetching vessel data:', error);
        return alerts;
      }

      // Group by MMSI to analyze each vessel's behavior
      const vesselGroups = new Map<string, RealVesselData[]>();
      positions?.forEach((pos: any) => {
        const vesselData: RealVesselData = {
          mmsi: pos.mmsi,
          latitude: pos.latitude,
          longitude: pos.longitude,
          speed_knots: pos.speed_knots || 0,
          course_degrees: pos.course_degrees || 0,
          timestamp_utc: pos.timestamp_utc,
          source_feed: pos.source_feed,
          vessel_name: pos.vessels?.vessel_name
        };

        if (!vesselGroups.has(pos.mmsi)) {
          vesselGroups.set(pos.mmsi, []);
        }
        vesselGroups.get(pos.mmsi)!.push(vesselData);
      });

      // Analyze each vessel for suspicious patterns
      for (const [mmsi, vesselPositions] of vesselGroups) {
        const patterns = this.detectSuspiciousPatterns(mmsi, vesselPositions);
        
        if (patterns.length > 0) {
          const alert = this.generateGhostVesselAlert(mmsi, vesselPositions[0], patterns);
          alerts.push(alert);
        }
      }

      console.log(`Analyzed ${vesselGroups.size} vessels, found ${alerts.length} suspicious patterns`);

    } catch (error) {
      console.error('Error in real ghost fleet detection:', error);
    }

    return alerts;
  }

  private detectSuspiciousPatterns(mmsi: string, positions: RealVesselData[]): VesselBehaviorPattern[] {
    const patterns: VesselBehaviorPattern[] = [];

    if (positions.length < 2) return patterns;

    // Sort positions by time
    positions.sort((a, b) => new Date(a.timestamp_utc).getTime() - new Date(b.timestamp_utc).getTime());

    // 1. Detect AIS signal gaps
    const aisGapPattern = this.detectAISGaps(mmsi, positions);
    if (aisGapPattern) patterns.push(aisGapPattern);

    // 2. Detect speed anomalies
    const speedPattern = this.detectSpeedAnomalies(mmsi, positions);
    if (speedPattern) patterns.push(speedPattern);

    // 3. Detect course deviations
    const coursePattern = this.detectCourseAnomalies(mmsi, positions);
    if (coursePattern) patterns.push(coursePattern);

    // 4. Detect loitering behavior
    const loiteringPattern = this.detectLoitering(mmsi, positions);
    if (loiteringPattern) patterns.push(loiteringPattern);

    return patterns;
  }

  private detectAISGaps(mmsi: string, positions: RealVesselData[]): VesselBehaviorPattern | null {
    let maxGap = 0;
    let gapStart = '';
    
    for (let i = 1; i < positions.length; i++) {
      const timeDiff = new Date(positions[i].timestamp_utc).getTime() - 
                      new Date(positions[i-1].timestamp_utc).getTime();
      const hoursDiff = timeDiff / (1000 * 60 * 60);
      
      if (hoursDiff > maxGap) {
        maxGap = hoursDiff;
        gapStart = positions[i-1].timestamp_utc;
      }
    }

    // Consider gaps > 4 hours suspicious
    if (maxGap > 4) {
      return {
        id: `ais-gap-${Date.now()}-${mmsi}`,
        vesselId: mmsi,
        patternType: 'ais_gap',
        severity: maxGap > 24 ? 'critical' : maxGap > 12 ? 'high' : 'medium',
        confidence: Math.min(0.95, 0.6 + (maxGap / 48)),
        detectedAt: new Date().toISOString(),
        location: [positions[positions.length - 1].longitude, positions[positions.length - 1].latitude],
        description: `AIS signal gap of ${maxGap.toFixed(1)} hours detected`,
        evidence: {
          timeGap: maxGap,
          gapStart
        }
      };
    }

    return null;
  }

  private detectSpeedAnomalies(mmsi: string, positions: RealVesselData[]): VesselBehaviorPattern | null {
    const speeds = positions.map(p => p.speed_knots).filter(s => s > 0);
    if (speeds.length < 3) return null;

    const avgSpeed = speeds.reduce((sum, s) => sum + s, 0) / speeds.length;
    const maxSpeed = Math.max(...speeds);
    const minSpeed = Math.min(...speeds);

    // Detect unrealistic speeds or extreme variations
    if (maxSpeed > 50 || (maxSpeed - minSpeed) > 30) {
      return {
        id: `speed-anomaly-${Date.now()}-${mmsi}`,
        vesselId: mmsi,
        patternType: 'speed_anomaly',
        severity: maxSpeed > 50 ? 'critical' : 'high',
        confidence: 0.8,
        detectedAt: new Date().toISOString(),
        location: [positions[positions.length - 1].longitude, positions[positions.length - 1].latitude],
        description: `Suspicious speed patterns: max ${maxSpeed.toFixed(1)} kts, avg ${avgSpeed.toFixed(1)} kts`,
        evidence: {
          maxSpeed,
          avgSpeed,
          speedVariation: maxSpeed - minSpeed
        }
      };
    }

    return null;
  }

  private detectCourseAnomalies(mmsi: string, positions: RealVesselData[]): VesselBehaviorPattern | null {
    let drasticChanges = 0;
    
    for (let i = 1; i < positions.length; i++) {
      const courseDiff = Math.abs(positions[i].course_degrees - positions[i-1].course_degrees);
      const normalizedDiff = Math.min(courseDiff, 360 - courseDiff);
      
      if (normalizedDiff > 90) { // Course change > 90 degrees
        drasticChanges++;
      }
    }

    if (drasticChanges > 3) {
      return {
        id: `course-anomaly-${Date.now()}-${mmsi}`,
        vesselId: mmsi,
        patternType: 'route_deviation',
        severity: 'medium',
        confidence: 0.7,
        detectedAt: new Date().toISOString(),
        location: [positions[positions.length - 1].longitude, positions[positions.length - 1].latitude],
        description: `Multiple drastic course changes detected (${drasticChanges} times)`,
        evidence: {
          courseChanges: drasticChanges
        }
      };
    }

    return null;
  }

  private detectLoitering(mmsi: string, positions: RealVesselData[]): VesselBehaviorPattern | null {
    if (positions.length < 5) return null;

    // Check if vessel has been in small area for extended time
    const recentPositions = positions.slice(-10); // Last 10 positions
    const avgLat = recentPositions.reduce((sum, p) => sum + p.latitude, 0) / recentPositions.length;
    const avgLng = recentPositions.reduce((sum, p) => sum + p.longitude, 0) / recentPositions.length;

    // Calculate max distance from center
    const maxDistance = Math.max(...recentPositions.map(p => {
      const latDiff = (p.latitude - avgLat) * 111; // Rough km conversion
      const lngDiff = (p.longitude - avgLng) * 111 * Math.cos(avgLat * Math.PI / 180);
      return Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);
    }));

    const timeSpan = new Date(recentPositions[recentPositions.length - 1].timestamp_utc).getTime() - 
                     new Date(recentPositions[0].timestamp_utc).getTime();
    const hoursSpan = timeSpan / (1000 * 60 * 60);

    // If vessel stayed within 5km for more than 8 hours
    if (maxDistance < 5 && hoursSpan > 8) {
      return {
        id: `loitering-${Date.now()}-${mmsi}`,
        vesselId: mmsi,
        patternType: 'loitering',
        severity: 'medium',
        confidence: 0.75,
        detectedAt: new Date().toISOString(),
        location: [avgLng, avgLat],
        description: `Vessel loitering in ${maxDistance.toFixed(1)}km area for ${hoursSpan.toFixed(1)} hours`,
        evidence: {
          loiteringRadius: maxDistance,
          duration: hoursSpan
        }
      };
    }

    return null;
  }

  private generateGhostVesselAlert(mmsi: string, latestPosition: RealVesselData, patterns: VesselBehaviorPattern[]): GhostVesselAlert {
    const criticalPatterns = patterns.filter(p => p.severity === 'critical').length;
    const highPatterns = patterns.filter(p => p.severity === 'high').length;
    
    let riskLevel: 'low' | 'medium' | 'high' | 'critical';
    if (criticalPatterns > 0) riskLevel = 'critical';
    else if (highPatterns > 1) riskLevel = 'high';
    else if (patterns.length > 2) riskLevel = 'medium';
    else riskLevel = 'low';

    let alertType: 'newly_dark' | 'suspicious_behavior' | 'sanction_evasion' | 'illegal_fishing';
    if (patterns.some(p => p.patternType === 'ais_gap')) alertType = 'newly_dark';
    else if (patterns.some(p => p.patternType === 'speed_anomaly')) alertType = 'sanction_evasion';
    else if (patterns.some(p => p.patternType === 'loitering')) alertType = 'illegal_fishing';
    else alertType = 'suspicious_behavior';

    return {
      id: `real-alert-${Date.now()}-${mmsi}`,
      vesselId: mmsi,
      vesselName: latestPosition.vessel_name || `MMSI-${mmsi}`,
      alertType,
      riskLevel,
      location: [latestPosition.longitude, latestPosition.latitude],
      timestamp: new Date().toISOString(),
      patterns,
      recommendation: this.generateRecommendation(riskLevel, patterns)
    };
  }

  private generateRecommendation(riskLevel: string, patterns: VesselBehaviorPattern[]): string {
    const recommendations = {
      critical: 'IMMEDIATE ACTION: Alert maritime authorities and initiate tracking protocols.',
      high: 'HIGH PRIORITY: Increase monitoring frequency and prepare response team.',
      medium: 'Monitor closely and investigate within 24 hours.',
      low: 'Continue routine monitoring with automated alerts.'
    };
    
    return recommendations[riskLevel as keyof typeof recommendations];
  }

  // Public API
  subscribe(callback: (alerts: GhostVesselAlert[]) => void) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  async startRealTimeDetection() {
    // Run initial analysis
    const alerts = await this.analyzeRealVesselData();
    this.notifySubscribers(alerts);

    // Set up periodic analysis every 5 minutes
    setInterval(async () => {
      const newAlerts = await this.analyzeRealVesselData();
      this.notifySubscribers(newAlerts);
    }, 5 * 60 * 1000);

    console.log('Real-time ghost fleet detection started');
  }

  private notifySubscribers(alerts: GhostVesselAlert[]) {
    this.subscribers.forEach(callback => callback(alerts));
  }
}

export const realGhostFleetDetectionService = new RealGhostFleetDetectionService();
