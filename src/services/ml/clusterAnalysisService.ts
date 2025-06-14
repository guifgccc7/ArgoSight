
import { VesselDataPoint } from '../mlAnalysisService';

export interface ClusterAnalysisResult {
  clusterId: string;
  vessels: string[];
  clusterType: 'route_similarity' | 'behavior_pattern' | 'temporal_pattern';
  characteristics: string[];
  riskLevel: 'low' | 'medium' | 'high';
}

export class ClusterAnalysisService {
  async initializeClusteringModels(): Promise<void> {
    console.log('Loading clustering models...');
    await new Promise(resolve => setTimeout(resolve, 600));
  }

  async performClusterAnalysis(vessels: VesselDataPoint[]): Promise<ClusterAnalysisResult[]> {
    const clusters: ClusterAnalysisResult[] = [];

    const routeClusters = this.clusterByRoute(vessels);
    clusters.push(...routeClusters);

    const behaviorClusters = this.clusterByBehavior(vessels);
    clusters.push(...behaviorClusters);

    return clusters;
  }

  private clusterByRoute(vessels: VesselDataPoint[]): ClusterAnalysisResult[] {
    const clusters = new Map<string, VesselDataPoint[]>();
    
    vessels.forEach(vessel => {
      const regionKey = `${Math.floor(vessel.lat / 10)}_${Math.floor(vessel.lng / 10)}`;
      if (!clusters.has(regionKey)) {
        clusters.set(regionKey, []);
      }
      clusters.get(regionKey)!.push(vessel);
    });

    return Array.from(clusters.entries())
      .filter(([_, vessels]) => vessels.length > 1)
      .map(([regionKey, vessels]) => ({
        clusterId: `route_${regionKey}`,
        vessels: vessels.map(v => v.vesselType + '-' + Date.now()),
        clusterType: 'route_similarity' as const,
        characteristics: ['similar geographic area', 'coordinated movement'],
        riskLevel: vessels.length > 5 ? 'high' : 'medium' as const
      }));
  }

  private clusterByBehavior(vessels: VesselDataPoint[]): ClusterAnalysisResult[] {
    const speedGroups = new Map<string, VesselDataPoint[]>();
    
    vessels.forEach(vessel => {
      const speedCategory = vessel.speed < 5 ? 'slow' : vessel.speed < 15 ? 'medium' : 'fast';
      if (!speedGroups.has(speedCategory)) {
        speedGroups.set(speedCategory, []);
      }
      speedGroups.get(speedCategory)!.push(vessel);
    });

    return Array.from(speedGroups.entries())
      .filter(([_, vessels]) => vessels.length > 2)
      .map(([category, vessels]) => ({
        clusterId: `behavior_${category}`,
        vessels: vessels.map(v => v.vesselType + '-' + Date.now()),
        clusterType: 'behavior_pattern' as const,
        characteristics: [`${category} speed pattern`, 'synchronized behavior'],
        riskLevel: category === 'slow' ? 'high' : 'medium' as const
      }));
  }
}
