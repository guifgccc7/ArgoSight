
import { alertsService, Alert } from './alertsService';

export interface AlertRule {
  id: string;
  name: string;
  conditions: AlertCondition[];
  actions: AlertAction[];
  priority: number;
  enabled: boolean;
  cooldownPeriod: number; // minutes
  lastTriggered?: string;
}

export interface AlertCondition {
  type: 'anomaly_score' | 'pattern_match' | 'location' | 'vessel_type' | 'time_range';
  operator: 'gt' | 'lt' | 'eq' | 'contains' | 'within';
  value: any;
  weight: number; // 0-1 for condition importance
}

export interface AlertAction {
  type: 'notify' | 'escalate' | 'auto_investigate' | 'block_vessel';
  parameters: Record<string, any>;
}

export interface AlertCorrelation {
  id: string;
  relatedAlerts: string[];
  confidence: number;
  summary: string;
  recommendedAction: string;
}

class IntelligentAlertingSystem {
  private alertRules: Map<string, AlertRule> = new Map();
  private alertHistory: Alert[] = [];
  private correlations: Map<string, AlertCorrelation> = new Map();
  private subscribers: Set<(correlation: AlertCorrelation) => void> = new Set();

  constructor() {
    this.initializeDefaultRules();
    this.startCorrelationEngine();
  }

  private initializeDefaultRules(): void {
    const defaultRules: AlertRule[] = [
      {
        id: 'high-anomaly-critical',
        name: 'Critical Anomaly Detection',
        conditions: [
          {
            type: 'anomaly_score',
            operator: 'gt',
            value: 85,
            weight: 1.0
          }
        ],
        actions: [
          {
            type: 'escalate',
            parameters: { level: 'critical', notify: ['security-team'] }
          }
        ],
        priority: 1,
        enabled: true,
        cooldownPeriod: 5
      },
      {
        id: 'ghost-vessel-pattern',
        name: 'Ghost Vessel Detection',
        conditions: [
          {
            type: 'pattern_match',
            operator: 'contains',
            value: 'ais_manipulation',
            weight: 0.8
          },
          {
            type: 'anomaly_score',
            operator: 'gt',
            value: 60,
            weight: 0.6
          }
        ],
        actions: [
          {
            type: 'auto_investigate',
            parameters: { depth: 'enhanced', duration: 60 }
          },
          {
            type: 'notify',
            parameters: { channels: ['dashboard', 'mobile'] }
          }
        ],
        priority: 2,
        enabled: true,
        cooldownPeriod: 15
      },
      {
        id: 'restricted-area-violation',
        name: 'Restricted Area Violation',
        conditions: [
          {
            type: 'location',
            operator: 'within',
            value: { type: 'restricted', buffer: 1000 },
            weight: 0.9
          }
        ],
        actions: [
          {
            type: 'escalate',
            parameters: { level: 'high', immediate: true }
          }
        ],
        priority: 1,
        enabled: true,
        cooldownPeriod: 0
      }
    ];

    defaultRules.forEach(rule => {
      this.alertRules.set(rule.id, rule);
    });
  }

  async evaluateAlert(alert: Alert, context: any): Promise<void> {
    const triggeredRules: AlertRule[] = [];

    for (const rule of this.alertRules.values()) {
      if (!rule.enabled) continue;

      // Check cooldown period
      if (rule.lastTriggered) {
        const timeSinceLastTrigger = Date.now() - new Date(rule.lastTriggered).getTime();
        if (timeSinceLastTrigger < rule.cooldownPeriod * 60 * 1000) {
          continue;
        }
      }

      const score = this.evaluateConditions(rule.conditions, alert, context);
      if (score > 0.7) { // Threshold for rule activation
        triggeredRules.push(rule);
        rule.lastTriggered = new Date().toISOString();
      }
    }

    // Execute actions for triggered rules
    for (const rule of triggeredRules) {
      await this.executeActions(rule.actions, alert, context);
    }

    // Store alert for correlation analysis
    this.alertHistory.push(alert);
    this.analyzeCorrelations(alert);
  }

  private evaluateConditions(
    conditions: AlertCondition[],
    alert: Alert,
    context: any
  ): number {
    let totalScore = 0;
    let totalWeight = 0;

    for (const condition of conditions) {
      const conditionMet = this.evaluateCondition(condition, alert, context);
      if (conditionMet) {
        totalScore += condition.weight;
      }
      totalWeight += condition.weight;
    }

    return totalWeight > 0 ? totalScore / totalWeight : 0;
  }

  private evaluateCondition(
    condition: AlertCondition,
    alert: Alert,
    context: any
  ): boolean {
    switch (condition.type) {
      case 'anomaly_score':
        const anomalyScore = context.mlAnalysis?.anomalyScore || 0;
        return this.compareValues(anomalyScore, condition.operator, condition.value);

      case 'pattern_match':
        const patterns = context.patterns || [];
        return patterns.some((p: any) => 
          this.compareValues(p.type, condition.operator, condition.value)
        );

      case 'location':
        if (condition.value.type === 'restricted') {
          // Simplified restricted area check
          return alert.location && 
                 Math.abs(alert.location.lat) < 10 && 
                 Math.abs(alert.location.lng) < 10;
        }
        return false;

      case 'vessel_type':
        return context.vesselData && 
               this.compareValues(context.vesselData.vesselType, condition.operator, condition.value);

      default:
        return false;
    }
  }

  private compareValues(actual: any, operator: string, expected: any): boolean {
    switch (operator) {
      case 'gt': return actual > expected;
      case 'lt': return actual < expected;
      case 'eq': return actual === expected;
      case 'contains': return String(actual).includes(String(expected));
      case 'within': return true; // Simplified for demo
      default: return false;
    }
  }

  private async executeActions(
    actions: AlertAction[],
    alert: Alert,
    context: any
  ): Promise<void> {
    for (const action of actions) {
      try {
        await this.executeAction(action, alert, context);
      } catch (error) {
        console.error('Failed to execute alert action:', error);
      }
    }
  }

  private async executeAction(
    action: AlertAction,
    alert: Alert,
    context: any
  ): Promise<void> {
    switch (action.type) {
      case 'escalate':
        alertsService.updateAlertStatus(alert.id, 'escalated');
        console.log(`Alert ${alert.id} escalated to ${action.parameters.level}`);
        break;

      case 'notify':
        console.log(`Notification sent for alert ${alert.id} via ${action.parameters.channels}`);
        break;

      case 'auto_investigate':
        console.log(`Auto-investigation started for alert ${alert.id}`);
        // Could trigger additional ML analysis here
        break;

      case 'block_vessel':
        console.log(`Vessel blocking requested for alert ${alert.id}`);
        break;
    }
  }

  private analyzeCorrelations(newAlert: Alert): void {
    const recentAlerts = this.alertHistory.filter(alert => {
      const timeDiff = Date.now() - new Date(alert.timestamp).getTime();
      return timeDiff < 3600000; // Last hour
    });

    if (recentAlerts.length < 2) return;

    // Simple correlation: alerts in same area
    const nearbyAlerts = recentAlerts.filter(alert => {
      if (!alert.location || !newAlert.location) return false;
      const distance = this.calculateDistance(
        alert.location.lat, alert.location.lng,
        newAlert.location.lat, newAlert.location.lng
      );
      return distance < 50; // 50km radius
    });

    if (nearbyAlerts.length > 2) {
      const correlation: AlertCorrelation = {
        id: `CORR-${Date.now()}`,
        relatedAlerts: nearbyAlerts.map(a => a.id),
        confidence: Math.min(0.95, nearbyAlerts.length * 0.2),
        summary: `${nearbyAlerts.length} related alerts detected in close proximity`,
        recommendedAction: 'Increase surveillance in affected area'
      };

      this.correlations.set(correlation.id, correlation);
      this.notifyCorrelationSubscribers(correlation);
    }
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

  private startCorrelationEngine(): void {
    setInterval(() => {
      // Clean up old correlations
      const cutoff = Date.now() - 24 * 60 * 60 * 1000; // 24 hours
      for (const [id, correlation] of this.correlations.entries()) {
        const oldestAlert = correlation.relatedAlerts
          .map(alertId => this.alertHistory.find(a => a.id === alertId))
          .filter(Boolean)
          .sort((a, b) => new Date(a!.timestamp).getTime() - new Date(b!.timestamp).getTime())[0];
        
        if (oldestAlert && new Date(oldestAlert.timestamp).getTime() < cutoff) {
          this.correlations.delete(id);
        }
      }
    }, 300000); // Every 5 minutes
  }

  private notifyCorrelationSubscribers(correlation: AlertCorrelation): void {
    this.subscribers.forEach(callback => callback(correlation));
  }

  // Public API
  subscribe(callback: (correlation: AlertCorrelation) => void): () => void {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  getAlertRules(): AlertRule[] {
    return Array.from(this.alertRules.values());
  }

  getCorrelations(): AlertCorrelation[] {
    return Array.from(this.correlations.values());
  }

  addRule(rule: AlertRule): void {
    this.alertRules.set(rule.id, rule);
  }

  removeRule(ruleId: string): void {
    this.alertRules.delete(ruleId);
  }

  updateRule(ruleId: string, updates: Partial<AlertRule>): void {
    const rule = this.alertRules.get(ruleId);
    if (rule) {
      this.alertRules.set(ruleId, { ...rule, ...updates });
    }
  }
}

export const intelligentAlertingSystem = new IntelligentAlertingSystem();
