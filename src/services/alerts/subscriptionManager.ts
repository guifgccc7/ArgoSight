
import { Alert } from './types';
import { liveDataService } from '../liveDataService';
import { ghostFleetDetectionService } from '../ghostFleetDetectionService';
import { routeOptimizationService } from '../routeOptimizationService';

export class AlertSubscriptionManager {
  private alertCounter = 0;

  constructor(private addAlert: (alert: Alert) => void) {}

  initializeSubscriptions(): void {
    this.subscribeToGhostFleetDetection();
    this.subscribeToLiveDataService();
    this.subscribeToRouteOptimization();
  }

  private subscribeToGhostFleetDetection(): void {
    ghostFleetDetectionService.subscribe((ghostAlerts) => {
      ghostAlerts.forEach(ghostAlert => {
        const alert: Alert = {
          id: `GF-${this.alertCounter++}`,
          type: 'ghost_vessel',
          severity: ghostAlert.riskLevel,
          title: `${ghostAlert.alertType.replace('_', ' ')} - ${ghostAlert.vesselName}`,
          description: `Vessel ${ghostAlert.vesselName} showing suspicious behavior patterns`,
          location: {
            lat: ghostAlert.location[1],
            lng: ghostAlert.location[0],
            name: `${ghostAlert.location[1].toFixed(2)}, ${ghostAlert.location[0].toFixed(2)}`
          },
          timestamp: ghostAlert.timestamp,
          status: 'new',
          source: 'ai_detection',
          metadata: {
            vesselId: ghostAlert.vesselId,
            confidence: Math.max(...ghostAlert.patterns.map(p => p.confidence))
          }
        };
        this.addAlert(alert);
      });
    });
  }

  private subscribeToLiveDataService(): void {
    liveDataService.subscribe((data) => {
      if (data.alerts) {
        data.alerts.forEach((alert: any) => {
          const newAlert: Alert = {
            id: `SYS-${this.alertCounter++}`,
            type: alert.type,
            severity: alert.severity,
            title: this.getTitleFromDescription(alert.description),
            description: alert.description,
            location: {
              lat: alert.location[1],
              lng: alert.location[0]
            },
            timestamp: alert.timestamp,
            status: 'new',
            source: 'system'
          };
          this.addAlert(newAlert);
        });
      }
    });
  }

  private subscribeToRouteOptimization(): void {
    routeOptimizationService.subscribe(({ alerts: routeAlerts }) => {
      routeAlerts.forEach(routeAlert => {
        const alert: Alert = {
          id: `ROUTE-${this.alertCounter++}`,
          type: routeAlert.type === 'weather_warning' ? 'weather' : 'security',
          severity: routeAlert.severity,
          title: routeAlert.title,
          description: routeAlert.description,
          location: {
            lat: routeAlert.location[1],
            lng: routeAlert.location[0],
            name: `${routeAlert.location[1].toFixed(2)}, ${routeAlert.location[0].toFixed(2)}`
          },
          timestamp: routeAlert.timestamp,
          status: 'new',
          source: 'ai_detection',
          metadata: {
            confidence: 0.95,
            weatherConditions: routeAlert.weatherConditions
          }
        };
        this.addAlert(alert);
      });
    });
  }

  private getTitleFromDescription(description: string): string {
    if (description.includes('AIS manipulation')) return 'AIS Manipulation Detected';
    if (description.includes('vessel behavior')) return 'Suspicious Vessel Behavior';
    if (description.includes('weather')) return 'Severe Weather Alert';
    return 'Maritime Alert';
  }
}
