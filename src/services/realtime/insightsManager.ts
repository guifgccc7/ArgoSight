import { RealTimeInsight } from './enhancedTypes';

export class InsightsManager {
  private insights: RealTimeInsight[] = [];
  private subscribers: Set<(insights: RealTimeInsight[]) => void> = new Set();

  addInsight(insightData: Omit<RealTimeInsight, 'id' | 'timestamp'>): void {
    const insight: RealTimeInsight = {
      id: `insight-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      ...insightData
    };

    this.insights.unshift(insight);
    
    // Keep only recent insights (last 1000)
    if (this.insights.length > 1000) {
      this.insights = this.insights.slice(0, 1000);
    }

    this.notifySubscribers();
  }

  getInsights(limit: number = 50): RealTimeInsight[] {
    return this.insights.slice(0, limit);
  }

  getRecentCriticalInsights(): RealTimeInsight[] {
    return this.insights.filter(
      insight => insight.severity === 'critical' && 
      Date.now() - new Date(insight.timestamp).getTime() < 60000 // Last minute
    );
  }

  subscribe(callback: (insights: RealTimeInsight[]) => void): () => void {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  private notifySubscribers(): void {
    this.subscribers.forEach(callback => callback(this.insights.slice(0, 50)));
  }

  cleanupOldInsights(): void {
    const cutoff = Date.now() - (24 * 60 * 60 * 1000); // 24 hours
    this.insights = this.insights.filter(
      insight => new Date(insight.timestamp).getTime() > cutoff
    );
  }
}
