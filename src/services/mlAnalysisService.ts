
export interface MLAnalysisResult {
  anomalyScore: number;
  classification: string;
  confidence: number;
  features: number[];
  riskFactors: string[];
}

export interface VesselDataPoint {
  speed: number;
  course: number;
  lat: number;
  lng: number;
  vesselType: string;
  timestamp: string;
  aisSignalStrength?: number;
}

class MLAnalysisService {
  private textClassifier: any = null; // Changed from Pipeline to any to avoid type conflicts
  private isInitialized = false;
  private initializationPromise: Promise<void> | null = null;

  async initialize() {
    if (this.isInitialized) return;
    if (this.initializationPromise) return this.initializationPromise;

    this.initializationPromise = this.loadModels();
    await this.initializationPromise;
  }

  private async loadModels() {
    try {
      console.log('Loading ML models...');
      
      // Dynamically import the pipeline function to avoid type issues
      const { pipeline } = await import('@huggingface/transformers');
      
      // Load a lightweight text classification model for analyzing vessel descriptions/communications
      this.textClassifier = await pipeline(
        'text-classification',
        'Xenova/distilbert-base-uncased-finetuned-sst-2-english',
        { device: 'cpu' } // Use CPU for stability across all devices
      );

      this.isInitialized = true;
      console.log('ML models loaded successfully');
    } catch (error) {
      console.error('Failed to load ML models:', error);
      // Graceful fallback to rule-based analysis
      this.isInitialized = false;
    }
  }

  async analyzeVesselBehavior(data: VesselDataPoint): Promise<MLAnalysisResult> {
    // Ensure models are loaded
    await this.initialize();

    // Extract numerical features for anomaly detection
    const features = this.extractFeatures(data);
    
    // Calculate anomaly score using statistical methods
    const anomalyScore = this.calculateAnomalyScore(features);
    
    // Classify behavior pattern
    const classification = await this.classifyBehavior(data);
    
    // Identify risk factors
    const riskFactors = this.identifyRiskFactors(data, features);
    
    return {
      anomalyScore,
      classification: classification.label,
      confidence: classification.confidence,
      features,
      riskFactors
    };
  }

  private extractFeatures(data: VesselDataPoint): number[] {
    // Extract normalized features for ML analysis
    const features = [
      this.normalizeSpeed(data.speed),
      this.normalizeCourse(data.course),
      this.normalizeLatitude(data.lat),
      this.normalizeLongitude(data.lng),
      this.getVesselTypeEncoding(data.vesselType),
      this.getTimeFeature(data.timestamp),
      data.aisSignalStrength || 0.5
    ];
    
    return features;
  }

  private calculateAnomalyScore(features: number[]): number {
    // Simple statistical anomaly detection using z-score
    const mean = features.reduce((sum, val) => sum + val, 0) / features.length;
    const variance = features.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / features.length;
    const stdDev = Math.sqrt(variance);
    
    // Calculate composite z-score
    const zScores = features.map(val => Math.abs((val - mean) / (stdDev || 1)));
    const maxZScore = Math.max(...zScores);
    
    // Convert to 0-100 anomaly score
    return Math.min(100, maxZScore * 20);
  }

  private async classifyBehavior(data: VesselDataPoint): Promise<{ label: string; confidence: number }> {
    if (!this.isInitialized || !this.textClassifier) {
      // Fallback to rule-based classification
      return this.ruleBasedClassification(data);
    }

    try {
      // Create a text description of the vessel behavior for classification
      const behaviorDescription = this.createBehaviorDescription(data);
      
      const result = await this.textClassifier(behaviorDescription);
      
      // Map sentiment classification to behavior categories
      const label = result[0].label === 'POSITIVE' ? 'normal' : 'suspicious';
      const confidence = result[0].score;
      
      return { label, confidence };
    } catch (error) {
      console.error('ML classification failed, using fallback:', error);
      return this.ruleBasedClassification(data);
    }
  }

  private createBehaviorDescription(data: VesselDataPoint): string {
    return `Vessel moving at ${data.speed} knots on course ${data.course} degrees in position ${data.lat.toFixed(2)}, ${data.lng.toFixed(2)}. Type: ${data.vesselType}`;
  }

  private ruleBasedClassification(data: VesselDataPoint): { label: string; confidence: number } {
    let suspiciousFactors = 0;
    
    if (data.speed < 0 || data.speed > 40) suspiciousFactors++;
    if (data.course < 0 || data.course > 360) suspiciousFactors++;
    if (Math.abs(data.lat) > 90 || Math.abs(data.lng) > 180) suspiciousFactors++;
    
    const label = suspiciousFactors > 1 ? 'suspicious' : 'normal';
    const confidence = suspiciousFactors > 1 ? 0.7 + (suspiciousFactors * 0.1) : 0.8;
    
    return { label, confidence };
  }

  private identifyRiskFactors(data: VesselDataPoint, features: number[]): string[] {
    const factors: string[] = [];
    
    if (data.speed > 30) factors.push('High speed for vessel type');
    if (data.speed < 1 && data.vesselType !== 'fishing') factors.push('Unusually slow movement');
    if (features[0] > 0.8) factors.push('Speed anomaly detected');
    if (features[6] < 0.3) factors.push('Weak AIS signal');
    if (Math.abs(data.lat) < 5 && Math.abs(data.lng) < 5) factors.push('Operating in sensitive area');
    
    return factors;
  }

  // Feature normalization methods
  private normalizeSpeed(speed: number): number {
    return Math.min(1, Math.max(0, speed / 40)); // Normalize to 0-1 range
  }

  private normalizeCourse(course: number): number {
    return course / 360; // Normalize to 0-1 range
  }

  private normalizeLatitude(lat: number): number {
    return (lat + 90) / 180; // Normalize to 0-1 range
  }

  private normalizeLongitude(lng: number): number {
    return (lng + 180) / 360; // Normalize to 0-1 range
  }

  private getVesselTypeEncoding(type: string): number {
    const typeMap: { [key: string]: number } = {
      'cargo': 0.2,
      'tanker': 0.4,
      'container': 0.6,
      'fishing': 0.8,
      'passenger': 1.0,
      'naval': 0.3
    };
    return typeMap[type.toLowerCase()] || 0.5;
  }

  private getTimeFeature(timestamp: string): number {
    const date = new Date(timestamp);
    const hour = date.getHours();
    // Convert hour to a cyclical feature (0-1)
    return (Math.sin(2 * Math.PI * hour / 24) + 1) / 2;
  }

  // Batch analysis for multiple vessels
  async analyzeBatch(vessels: VesselDataPoint[]): Promise<MLAnalysisResult[]> {
    const results = await Promise.all(
      vessels.map(vessel => this.analyzeVesselBehavior(vessel))
    );
    return results;
  }

  // Get model status
  getModelStatus() {
    return {
      initialized: this.isInitialized,
      textClassifierLoaded: !!this.textClassifier,
      modelsAvailable: ['text-classification', 'anomaly-detection']
    };
  }
}

export const mlAnalysisService = new MLAnalysisService();
