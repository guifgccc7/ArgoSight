
import { Alert } from './types';

export class AlertSimulationService {
  private simulationInterval?: number;

  constructor(private addAlert: (alert: Alert) => void) {}

  startAlertSimulation(): void {
    this.simulationInterval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance every 10 seconds
        this.generateRandomAlert();
      }
    }, 10000);
  }

  stopAlertSimulation(): void {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = undefined;
    }
  }

  private generateRandomAlert(): void {
    const types: Alert['type'][] = ['ghost_vessel', 'weather', 'security', 'communication'];
    const severities: Alert['severity'][] = ['low', 'medium', 'high', 'critical'];
    
    const type = types[Math.floor(Math.random() * types.length)];
    const severity = severities[Math.floor(Math.random() * severities.length)];
    
    const descriptions = {
      ghost_vessel: 'Vessel went dark in restricted waters',
      weather: 'Storm system approaching maritime routes',
      security: 'Suspicious activity detected in port area',
      communication: 'Loss of communication with vessel fleet'
    };

    const alert: Alert = {
      id: `AUTO-${Date.now()}`,
      type,
      severity,
      title: `${type.replace('_', ' ')} Alert`,
      description: descriptions[type],
      location: {
        lat: Math.random() * 180 - 90,
        lng: Math.random() * 360 - 180
      },
      timestamp: new Date().toISOString(),
      status: 'new',
      source: 'system'
    };

    this.addAlert(alert);
  }
}
