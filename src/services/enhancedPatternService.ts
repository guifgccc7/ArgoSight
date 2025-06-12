
import { mlAnalysisService, MLAnalysisResult, VesselDataPoint } from './mlAnalysisService';
import { BehaviorPattern, patternRecognitionService } from './patternRecognitionService';

export interface EnhancedPattern extends BehaviorPattern {
  mlAnalysis: MLAnalysisResult;
  mlConfidence: number;
  aiRecommendations: string[];
}

class EnhancedPatternService {
  private mlInitialized = false;

  async initialize() {
    if (!this.mlInitialized) {
      await mlAnalysisService.initialize();
      this.mlInitialized = true;
      console.log('Enhanced pattern service with ML initialized');
    }
  }

  async analyzeVesselWithML(vessel: any): Promise<EnhancedPattern[]> {
    await this.initialize();

    // Get traditional pattern detection results
    const traditionalPatterns = patternRecognitionService.analyzeVesselBehavior(vessel);

    // Prepare data for ML analysis
    const vesselData: VesselDataPoint = {
      speed: vessel.speed || 0,
      course: vessel.course || 0,
      lat: vessel.lat || 0,
      lng: vessel.lng || 0,
      vesselType: vessel.vesselType || 'unknown',
      timestamp: vessel.lastUpdate || new Date().toISOString(),
      aisSignalStrength: vessel.aisSignalStrength || Math.random()
    };

    // Perform ML analysis
    const mlAnalysis = await mlAnalysisService.analyzeVesselBehavior(vesselData);

    // Enhance patterns with ML insights
    const enhancedPatterns: EnhancedPattern[] = traditionalPatterns.map(pattern => ({
      ...pattern,
      mlAnalysis,
      mlConfidence: mlAnalysis.confidence,
      aiRecommendations: this.generateAIRecommendations(pattern, mlAnalysis),
      // Adjust risk score based on ML analysis
      riskScore: this.combineRiskScores(pattern.riskScore, mlAnalysis.anomalyScore),
      // Enhance confidence with ML confidence
      confidence: this.combineConfidences(pattern.confidence, mlAnalysis.confidence)
    }));

    // Generate additional ML-detected patterns
    const mlPatterns = this.generateMLPatterns(vessel, mlAnalysis);
    enhancedPatterns.push(...mlPatterns);

    return enhancedPatterns;
  }

  private generateAIRecommendations(pattern: BehaviorPattern, mlAnalysis: MLAnalysisResult): string[] {
    const recommendations: string[] = [];

    if (mlAnalysis.anomalyScore > 70) {
      recommendations.push('High anomaly score detected - priority investigation required');
    }

    if (mlAnalysis.classification === 'suspicious') {
      recommendations.push('ML model classifies behavior as suspicious - increase monitoring');
    }

    if (mlAnalysis.riskFactors.length > 2) {
      recommendations.push('Multiple risk factors identified - consider immediate response');
    }

    if (pattern.severity === 'critical' && mlAnalysis.confidence > 0.8) {
      recommendations.push('Critical pattern confirmed by ML - alert authorities');
    }

    // Add specific recommendations based on pattern type
    switch (pattern.type) {
      case 'ais_manipulation':
        if (mlAnalysis.features[6] < 0.3) {
          recommendations.push('Weak AIS signal supports manipulation hypothesis');
        }
        break;
      case 'speed_anomaly':
        if (mlAnalysis.features[0] > 0.8) {
          recommendations.push('ML confirms speed anomaly - verify vessel capabilities');
        }
        break;
      case 'route_deviation':
        recommendations.push('Cross-reference with weather and traffic data');
        break;
    }

    return recommendations;
  }

  private combineRiskScores(traditionalScore: number, mlScore: number): number {
    // Weighted combination: 60% traditional, 40% ML
    return Math.min(100, (traditionalScore * 0.6) + (mlScore * 0.4));
  }

  private combineConfidences(traditionalConf: number, mlConf: number): number {
    // Use geometric mean for confidence combination
    return Math.sqrt(traditionalConf * mlConf);
  }

  private generateMLPatterns(vessel: any, mlAnalysis: MLAnalysisResult): EnhancedPattern[] {
    const patterns: EnhancedPattern[] = [];

    // Generate pattern based on high anomaly score
    if (mlAnalysis.anomalyScore > 80) {
      patterns.push({
        id: `ml-anomaly-${Date.now()}-${vessel.id}`,
        type: 'speed_anomaly', // Using existing type for compatibility
        severity: mlAnalysis.anomalyScore > 90 ? 'critical' : 'high',
        confidence: mlAnalysis.confidence,
        detectedAt: new Date().toISOString(),
        vesselId: vessel.id,
        location: [vessel.lng, vessel.lat],
        description: `ML detected high anomaly score: ${mlAnalysis.anomalyScore.toFixed(1)}`,
        evidence: { 
          mlFeatures: mlAnalysis.features,
          riskFactors: mlAnalysis.riskFactors,
          classification: mlAnalysis.classification
        },
        riskScore: mlAnalysis.anomalyScore,
        mlAnalysis,
        mlConfidence: mlAnalysis.confidence,
        aiRecommendations: [
          'ML-based anomaly detection triggered',
          'Recommend manual verification of vessel status',
          'Consider satellite imagery confirmation'
        ]
      });
    }

    return patterns;
  }

  async getMLModelStatus() {
    return mlAnalysisService.getModelStatus();
  }

  async batchAnalyzeVessels(vessels: any[]): Promise<EnhancedPattern[]> {
    const allPatterns: EnhancedPattern[] = [];

    for (const vessel of vessels) {
      const patterns = await this.analyzeVesselWithML(vessel);
      allPatterns.push(...patterns);
    }

    return allPatterns;
  }
}

export const enhancedPatternService = new EnhancedPatternService();
