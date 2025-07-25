import { supabase } from '@/integrations/supabase/client';

export interface AIAnalysisRequest {
  analysisType: 'threat_assessment' | 'pattern_recognition' | 'report_generation' | 'natural_language_query' | 'route_optimization' | 'weather_impact_analysis';
  data?: any;
  query?: string;
  context?: string;
}

export interface AIAnalysisResponse {
  analysis: string;
  analysisType: string;
  timestamp: string;
  model: string;
}

export interface ThreatAssessment {
  riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  threats: Array<{
    type: string;
    description: string;
    confidence: number;
    recommendations: string[];
  }>;
  summary: string;
}

export interface PatternAnalysis {
  patterns: Array<{
    type: string;
    description: string;
    vessels: string[];
    confidence: number;
  }>;
  recommendations: string[];
  insights: string;
}

class MaritimeAIService {
  async analyzeThreat(vesselData: any[], alertData: any[] = []): Promise<AIAnalysisResponse> {
    const { data, error } = await supabase.functions.invoke('maritime-intelligence-ai', {
      body: {
        analysisType: 'threat_assessment',
        data: {
          vessels: vesselData,
          alerts: alertData,
          timestamp: new Date().toISOString()
        }
      }
    });

    if (error) throw error;
    return data;
  }

  async recognizePatterns(vesselData: any[]): Promise<AIAnalysisResponse> {
    const { data, error } = await supabase.functions.invoke('maritime-intelligence-ai', {
      body: {
        analysisType: 'pattern_recognition',
        data: {
          vessels: vesselData,
          timeRange: '24h',
          timestamp: new Date().toISOString()
        }
      }
    });

    if (error) throw error;
    return data;
  }

  async generateReport(reportData: any, reportType: string = 'daily'): Promise<AIAnalysisResponse> {
    const { data, error } = await supabase.functions.invoke('maritime-intelligence-ai', {
      body: {
        analysisType: 'report_generation',
        data: {
          ...reportData,
          reportType,
          generatedAt: new Date().toISOString()
        }
      }
    });

    if (error) throw error;
    return data;
  }

  async queryNaturalLanguage(query: string): Promise<AIAnalysisResponse> {
    const { data, error } = await supabase.functions.invoke('maritime-intelligence-ai', {
      body: {
        analysisType: 'natural_language_query',
        query,
        context: 'maritime intelligence platform'
      }
    });

    if (error) throw error;
    return data;
  }

  async optimizeRoute(routeData: any): Promise<AIAnalysisResponse> {
    const { data, error } = await supabase.functions.invoke('maritime-intelligence-ai', {
      body: {
        analysisType: 'route_optimization',
        data: routeData
      }
    });

    if (error) throw error;
    return data;
  }

  async analyzeWeatherImpact(weatherData: any, operationalData: any): Promise<AIAnalysisResponse> {
    const { data, error } = await supabase.functions.invoke('maritime-intelligence-ai', {
      body: {
        analysisType: 'weather_impact_analysis',
        data: {
          weather: weatherData,
          operations: operationalData,
          timestamp: new Date().toISOString()
        }
      }
    });

    if (error) throw error;
    return data;
  }

  async getAIInsights(vesselData: any[]): Promise<{
    threatAssessment: string;
    patterns: string;
    recommendations: string[];
  }> {
    try {
      // Run multiple AI analyses in parallel
      const [threatResponse, patternResponse] = await Promise.all([
        this.analyzeThreat(vesselData),
        this.recognizePatterns(vesselData)
      ]);

      // Extract key insights
      const recommendations = [
        'Monitor vessels with irregular movement patterns',
        'Investigate AIS signal gaps longer than 4 hours',
        'Track vessels entering restricted zones',
        'Correlate weather conditions with route deviations'
      ];

      return {
        threatAssessment: threatResponse.analysis,
        patterns: patternResponse.analysis,
        recommendations
      };
    } catch (error) {
      console.error('Error getting AI insights:', error);
      return {
        threatAssessment: 'AI analysis temporarily unavailable',
        patterns: 'Pattern recognition offline',
        recommendations: ['Manual monitoring recommended']
      };
    }
  }

  // Real-time threat scoring for vessels
  async scoreVesselThreat(vessel: any): Promise<{
    score: number;
    factors: string[];
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  }> {
    try {
      const response = await this.analyzeThreat([vessel]);
      
      // Parse AI response for threat scoring (simplified)
      const analysis = response.analysis.toLowerCase();
      let score = 0;
      const factors: string[] = [];

      if (analysis.includes('critical')) {
        score += 80;
        factors.push('Critical threat indicators detected');
      }
      if (analysis.includes('suspicious')) {
        score += 40;
        factors.push('Suspicious movement patterns');
      }
      if (analysis.includes('ais')) {
        score += 30;
        factors.push('AIS irregularities');
      }
      if (analysis.includes('route')) {
        score += 20;
        factors.push('Route deviations');
      }

      const riskLevel = score > 70 ? 'CRITICAL' : 
                       score > 50 ? 'HIGH' : 
                       score > 25 ? 'MEDIUM' : 'LOW';

      return { score, factors, riskLevel };
    } catch (error) {
      console.error('Error scoring vessel threat:', error);
      return { score: 0, factors: ['Analysis unavailable'], riskLevel: 'LOW' };
    }
  }
}

export const maritimeAIService = new MaritimeAIService();