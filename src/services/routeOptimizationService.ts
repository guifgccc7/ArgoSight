
import { weatherService } from './weatherService';

export interface RoutePoint {
  lat: number;
  lng: number;
  timestamp: string;
  estimatedArrival?: string;
}

export interface WeatherHazard {
  type: 'storm' | 'high_winds' | 'poor_visibility' | 'heavy_seas' | 'fog';
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: [number, number];
  radius: number; // km
  validFrom: string;
  validUntil: string;
  description: string;
}

export interface RouteRecommendation {
  id: string;
  vesselId: string;
  originalRoute: RoutePoint[];
  optimizedRoute: RoutePoint[];
  weatherHazards: WeatherHazard[];
  timeSaving: number; // hours
  fuelSaving: number; // percentage
  safetyImprovement: number; // score 0-100
  reasoning: string;
  confidence: number;
  generatedAt: string;
}

export interface SafetyAlert {
  id: string;
  vesselId: string;
  type: 'weather_warning' | 'route_deviation' | 'hazard_proximity';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  location: [number, number];
  weatherConditions: {
    windSpeed: number;
    waveHeight: number;
    visibility: number;
    temperature: number;
  };
  recommendations: string[];
  timestamp: string;
  validUntil: string;
}

class RouteOptimizationService {
  private recommendations: Map<string, RouteRecommendation> = new Map();
  private safetyAlerts: Map<string, SafetyAlert> = new Map();
  private subscribers: Set<(data: { recommendations: RouteRecommendation[], alerts: SafetyAlert[] }) => void> = new Set();

  constructor() {
    this.startWeatherMonitoring();
  }

  private startWeatherMonitoring(): void {
    // Monitor weather conditions every 10 minutes
    setInterval(async () => {
      await this.analyzeWeatherConditions();
    }, 600000);

    // Initial analysis
    setTimeout(() => this.analyzeWeatherConditions(), 5000);
  }

  private async analyzeWeatherConditions(): Promise<void> {
    try {
      // Get current weather data for key maritime routes
      const keyLocations = [
        { lat: 51.5074, lng: -0.1278, name: "English Channel" },
        { lat: 40.7589, lng: -73.9851, name: "North Atlantic" },
        { lat: 25.2048, lng: 55.2708, name: "Persian Gulf" },
        { lat: 1.3521, lng: 103.8198, name: "Singapore Strait" },
        { lat: 29.9792, lng: 31.1342, name: "Suez Canal" }
      ];

      for (const location of keyLocations) {
        const weather = await weatherService.getCurrentWeather(location.lat, location.lng);
        await this.assessWeatherHazards(location, weather);
      }

      this.notifySubscribers();
    } catch (error) {
      console.error('Error analyzing weather conditions:', error);
    }
  }

  private async assessWeatherHazards(location: any, weather: any): Promise<void> {
    const hazards: WeatherHazard[] = [];

    // High wind warning
    if (weather.wind?.speed > 15) { // >15 m/s (30 knots)
      hazards.push({
        type: 'high_winds',
        severity: weather.wind.speed > 25 ? 'critical' : weather.wind.speed > 20 ? 'high' : 'medium',
        location: [location.lng, location.lat],
        radius: 50,
        validFrom: new Date().toISOString(),
        validUntil: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
        description: `High winds of ${Math.round(weather.wind.speed)} m/s detected in ${location.name}`
      });
    }

    // Poor visibility warning
    if (weather.visibility < 1000) { // <1km visibility
      hazards.push({
        type: 'poor_visibility',
        severity: weather.visibility < 500 ? 'high' : 'medium',
        location: [location.lng, location.lat],
        radius: 25,
        validFrom: new Date().toISOString(),
        validUntil: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
        description: `Poor visibility of ${weather.visibility}m in ${location.name}`
      });
    }

    // Storm detection
    if (weather.weather?.[0]?.main === 'Thunderstorm') {
      hazards.push({
        type: 'storm',
        severity: 'high',
        location: [location.lng, location.lat],
        radius: 75,
        validFrom: new Date().toISOString(),
        validUntil: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
        description: `Thunderstorm activity detected in ${location.name}`
      });
    }

    // Generate safety alerts for detected hazards
    for (const hazard of hazards) {
      await this.generateSafetyAlert(hazard, location, weather);
    }
  }

  private async generateSafetyAlert(hazard: WeatherHazard, location: any, weather: any): Promise<void> {
    const alert: SafetyAlert = {
      id: `SAFETY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      vesselId: 'ALL', // General alert for all vessels in area
      type: 'weather_warning',
      severity: hazard.severity,
      title: this.getAlertTitle(hazard.type),
      description: hazard.description,
      location: hazard.location,
      weatherConditions: {
        windSpeed: weather.wind?.speed || 0,
        waveHeight: this.estimateWaveHeight(weather.wind?.speed || 0),
        visibility: weather.visibility || 10000,
        temperature: weather.main?.temp || 15
      },
      recommendations: this.getRecommendations(hazard.type, hazard.severity),
      timestamp: new Date().toISOString(),
      validUntil: hazard.validUntil
    };

    this.safetyAlerts.set(alert.id, alert);
  }

  private getAlertTitle(hazardType: string): string {
    switch (hazardType) {
      case 'storm': return 'Storm Warning';
      case 'high_winds': return 'High Wind Advisory';
      case 'poor_visibility': return 'Visibility Warning';
      case 'heavy_seas': return 'Heavy Sea State Alert';
      case 'fog': return 'Fog Advisory';
      default: return 'Weather Advisory';
    }
  }

  private getRecommendations(hazardType: string, severity: string): string[] {
    const baseRecommendations = {
      storm: [
        'Reduce speed and increase following distance',
        'Secure all loose equipment and cargo',
        'Monitor weather updates continuously',
        'Consider seeking shelter in nearest safe harbor'
      ],
      high_winds: [
        'Reduce speed to maintain control',
        'Adjust course to minimize beam winds',
        'Monitor vessel stability closely',
        'Prepare for course corrections'
      ],
      poor_visibility: [
        'Reduce speed significantly',
        'Sound fog signals as required',
        'Post additional lookouts',
        'Use radar and AIS for navigation'
      ],
      heavy_seas: [
        'Reduce speed to minimize impact',
        'Adjust heading to avoid beam seas',
        'Secure all equipment and personnel',
        'Monitor structural stress indicators'
      ],
      fog: [
        'Reduce to safe navigation speed',
        'Sound fog signals continuously',
        'Maintain radar watch',
        'Post visual lookouts'
      ]
    };

    const recommendations = baseRecommendations[hazardType] || ['Monitor conditions closely'];
    
    if (severity === 'critical') {
      recommendations.unshift('IMMEDIATE ACTION REQUIRED');
      recommendations.push('Consider emergency shelter');
    }

    return recommendations;
  }

  private estimateWaveHeight(windSpeed: number): number {
    // Simplified wave height estimation based on wind speed
    // Beaufort scale approximation
    if (windSpeed < 3) return 0.1;
    if (windSpeed < 7) return 0.5;
    if (windSpeed < 11) return 1.0;
    if (windSpeed < 16) return 2.0;
    if (windSpeed < 21) return 3.5;
    if (windSpeed < 27) return 5.5;
    return 8.0;
  }

  async optimizeRoute(vesselId: string, currentRoute: RoutePoint[]): Promise<RouteRecommendation | null> {
    try {
      const hazards = Array.from(this.safetyAlerts.values())
        .map(alert => ({
          type: 'storm' as const,
          severity: alert.severity,
          location: alert.location,
          radius: 50,
          validFrom: alert.timestamp,
          validUntil: alert.validUntil,
          description: alert.description
        }));

      if (hazards.length === 0) {
        return null; // No optimization needed
      }

      // Simple route optimization - avoid hazard areas
      const optimizedRoute = await this.calculateOptimizedRoute(currentRoute, hazards);
      
      const recommendation: RouteRecommendation = {
        id: `OPT-${Date.now()}`,
        vesselId,
        originalRoute: currentRoute,
        optimizedRoute,
        weatherHazards: hazards,
        timeSaving: this.calculateTimeSaving(currentRoute, optimizedRoute),
        fuelSaving: this.calculateFuelSaving(currentRoute, optimizedRoute),
        safetyImprovement: 85, // Simplified safety score
        reasoning: 'Route optimized to avoid severe weather conditions',
        confidence: 0.92,
        generatedAt: new Date().toISOString()
      };

      this.recommendations.set(recommendation.id, recommendation);
      return recommendation;
    } catch (error) {
      console.error('Error optimizing route:', error);
      return null;
    }
  }

  private async calculateOptimizedRoute(originalRoute: RoutePoint[], hazards: WeatherHazard[]): Promise<RoutePoint[]> {
    // Simplified route optimization - add waypoints to avoid hazards
    const optimized = [...originalRoute];
    
    for (const hazard of hazards) {
      const [hazardLng, hazardLat] = hazard.location;
      
      // Check if any route points are within hazard radius
      for (let i = 0; i < optimized.length - 1; i++) {
        const point1 = optimized[i];
        const point2 = optimized[i + 1];
        
        if (this.isRouteSegmentInHazard(point1, point2, hazardLat, hazardLng, hazard.radius)) {
          // Add detour waypoint
          const detourPoint = this.calculateDetourPoint(point1, point2, hazardLat, hazardLng, hazard.radius);
          optimized.splice(i + 1, 0, detourPoint);
        }
      }
    }
    
    return optimized;
  }

  private isRouteSegmentInHazard(point1: RoutePoint, point2: RoutePoint, hazardLat: number, hazardLng: number, radius: number): boolean {
    // Simplified check - distance from hazard center to route segment
    const midLat = (point1.lat + point2.lat) / 2;
    const midLng = (point1.lng + point2.lng) / 2;
    const distance = this.calculateDistance(midLat, midLng, hazardLat, hazardLng);
    return distance < radius;
  }

  private calculateDetourPoint(point1: RoutePoint, point2: RoutePoint, hazardLat: number, hazardLng: number, radius: number): RoutePoint {
    // Simple detour calculation - offset perpendicular to route
    const offsetDistance = radius * 1.5; // 50% safety margin
    const bearing = this.calculateBearing(point1.lat, point1.lng, point2.lat, point2.lng);
    const perpBearing = bearing + 90; // Perpendicular bearing
    
    const detourPoint = this.calculateDestination(
      (point1.lat + point2.lat) / 2,
      (point1.lng + point2.lng) / 2,
      perpBearing,
      offsetDistance
    );
    
    return {
      lat: detourPoint.lat,
      lng: detourPoint.lng,
      timestamp: new Date().toISOString()
    };
  }

  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private calculateBearing(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const lat1Rad = lat1 * Math.PI / 180;
    const lat2Rad = lat2 * Math.PI / 180;
    
    const y = Math.sin(dLng) * Math.cos(lat2Rad);
    const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) - Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLng);
    
    return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
  }

  private calculateDestination(lat: number, lng: number, bearing: number, distance: number): { lat: number, lng: number } {
    const R = 6371; // Earth's radius in km
    const bearingRad = bearing * Math.PI / 180;
    const latRad = lat * Math.PI / 180;
    const lngRad = lng * Math.PI / 180;
    
    const newLatRad = Math.asin(Math.sin(latRad) * Math.cos(distance / R) +
                                Math.cos(latRad) * Math.sin(distance / R) * Math.cos(bearingRad));
    
    const newLngRad = lngRad + Math.atan2(Math.sin(bearingRad) * Math.sin(distance / R) * Math.cos(latRad),
                                          Math.cos(distance / R) - Math.sin(latRad) * Math.sin(newLatRad));
    
    return {
      lat: newLatRad * 180 / Math.PI,
      lng: newLngRad * 180 / Math.PI
    };
  }

  private calculateTimeSaving(original: RoutePoint[], optimized: RoutePoint[]): number {
    // Simplified calculation - compare total distances
    const originalDistance = this.calculateRouteDistance(original);
    const optimizedDistance = this.calculateRouteDistance(optimized);
    const avgSpeed = 15; // knots
    
    return Math.max(0, (originalDistance - optimizedDistance) / avgSpeed);
  }

  private calculateFuelSaving(original: RoutePoint[], optimized: RoutePoint[]): number {
    // Simplified fuel saving calculation
    const originalDistance = this.calculateRouteDistance(original);
    const optimizedDistance = this.calculateRouteDistance(optimized);
    
    return Math.max(0, ((originalDistance - optimizedDistance) / originalDistance) * 100);
  }

  private calculateRouteDistance(route: RoutePoint[]): number {
    let totalDistance = 0;
    for (let i = 0; i < route.length - 1; i++) {
      totalDistance += this.calculateDistance(
        route[i].lat, route[i].lng,
        route[i + 1].lat, route[i + 1].lng
      );
    }
    return totalDistance;
  }

  // Public API
  subscribe(callback: (data: { recommendations: RouteRecommendation[], alerts: SafetyAlert[] }) => void): () => void {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  private notifySubscribers(): void {
    const data = {
      recommendations: Array.from(this.recommendations.values()),
      alerts: Array.from(this.safetyAlerts.values())
    };
    this.subscribers.forEach(callback => callback(data));
  }

  getRecommendations(): RouteRecommendation[] {
    return Array.from(this.recommendations.values());
  }

  getSafetyAlerts(): SafetyAlert[] {
    return Array.from(this.safetyAlerts.values());
  }

  // Clean up old data
  private cleanupOldData(): void {
    const cutoff = Date.now() - 24 * 60 * 60 * 1000; // 24 hours
    
    for (const [id, alert] of this.safetyAlerts.entries()) {
      if (new Date(alert.validUntil).getTime() < cutoff) {
        this.safetyAlerts.delete(id);
      }
    }
    
    for (const [id, rec] of this.recommendations.entries()) {
      if (new Date(rec.generatedAt).getTime() < cutoff) {
        this.recommendations.delete(id);
      }
    }
  }
}

export const routeOptimizationService = new RouteOptimizationService();
