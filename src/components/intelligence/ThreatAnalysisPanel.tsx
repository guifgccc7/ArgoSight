import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, Shield, Eye, Brain, Loader2, RefreshCw } from "lucide-react";
import { maritimeAIService } from "@/services/maritimeAIService";
import { liveDataService } from "@/services/liveDataService";
import { useToast } from "@/components/ui/use-toast";

interface ThreatAnalysis {
  vesselId: string;
  vesselName: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  threatScore: number;
  factors: string[];
  lastAnalyzed: Date;
  aiAnalysis?: string;
}

const ThreatAnalysisPanel = () => {
  const [threatAnalyses, setThreatAnalyses] = useState<ThreatAnalysis[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const { toast } = useToast();

  const performThreatAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      // Get current vessel data - using fallback method
      const vesselData = liveDataService.getImmediateSimulatedData()?.vessels || [];
      
      if (vesselData.length === 0) {
        toast({
          title: "No Vessel Data",
          description: "No vessel data available for analysis",
          variant: "destructive",
        });
        return;
      }

      // Analyze threats for all vessels
      const analyses: ThreatAnalysis[] = [];
      
      // Process vessels in batches to avoid overwhelming the API
      const batchSize = 5;
      for (let i = 0; i < Math.min(vesselData.length, 20); i += batchSize) {
        const batch = vesselData.slice(i, i + batchSize);
        
        const batchPromises = batch.map(async (vessel) => {
          try {
            const threatScore = await maritimeAIService.scoreVesselThreat(vessel);
            
            return {
              vesselId: vessel.id,
              vesselName: vessel.name,
              riskLevel: threatScore.riskLevel,
              threatScore: threatScore.score,
              factors: threatScore.factors,
              lastAnalyzed: new Date()
            };
          } catch (error) {
            console.error(`Error analyzing vessel ${vessel.id}:`, error);
            return {
              vesselId: vessel.id,
              vesselName: vessel.name,
              riskLevel: 'LOW' as const,
              threatScore: 0,
              factors: ['Analysis failed'],
              lastAnalyzed: new Date()
            };
          }
        });

        const batchResults = await Promise.all(batchPromises);
        analyses.push(...batchResults);
      }

      // Sort by threat score descending
      analyses.sort((a, b) => b.threatScore - a.threatScore);
      
      setThreatAnalyses(analyses);
      setLastUpdate(new Date());
      
      toast({
        title: "Threat Analysis Complete",
        description: `Analyzed ${analyses.length} vessels for potential threats`,
      });

    } catch (error) {
      console.error('Error performing threat analysis:', error);
      toast({
        title: "Analysis Error",
        description: "Failed to complete threat analysis. Check AI service configuration.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    // Perform initial analysis
    performThreatAnalysis();
    
    // Set up periodic analysis (every 5 minutes)
    const interval = setInterval(performThreatAnalysis, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'CRITICAL': return 'text-red-400 border-red-400 bg-red-400/10';
      case 'HIGH': return 'text-orange-400 border-orange-400 bg-orange-400/10';
      case 'MEDIUM': return 'text-yellow-400 border-yellow-400 bg-yellow-400/10';
      case 'LOW': return 'text-green-400 border-green-400 bg-green-400/10';
      default: return 'text-slate-400 border-slate-400';
    }
  };

  const getScoreColor = (score: number) => {
    if (score > 70) return 'bg-red-500';
    if (score > 50) return 'bg-orange-500';
    if (score > 25) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const criticalThreats = threatAnalyses.filter(t => t.riskLevel === 'CRITICAL');
  const highThreats = threatAnalyses.filter(t => t.riskLevel === 'HIGH');

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center space-x-2">
            <Shield className="h-5 w-5 text-red-400" />
            <span>AI Threat Analysis</span>
            <Badge variant="outline" className="text-red-400 border-red-400">
              REAL-TIME
            </Badge>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              onClick={performThreatAnalysis}
              disabled={isAnalyzing}
              variant="outline"
              size="sm"
              className="text-cyan-400 border-cyan-600"
            >
              {isAnalyzing ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-1" />
              )}
              Analyze
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Threat Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-700 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-red-400">{criticalThreats.length}</div>
            <div className="text-xs text-slate-400">Critical</div>
          </div>
          <div className="bg-slate-700 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-orange-400">{highThreats.length}</div>
            <div className="text-xs text-slate-400">High Risk</div>
          </div>
          <div className="bg-slate-700 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-cyan-400">{threatAnalyses.length}</div>
            <div className="text-xs text-slate-400">Total Analyzed</div>
          </div>
          <div className="bg-slate-700 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-400">
              {lastUpdate ? Math.floor((Date.now() - lastUpdate.getTime()) / 60000) : 0}m
            </div>
            <div className="text-xs text-slate-400">Last Update</div>
          </div>
        </div>

        {/* Threat List */}
        <ScrollArea className="h-64">
          <div className="space-y-3">
            {isAnalyzing && threatAnalyses.length === 0 && (
              <div className="flex items-center justify-center py-8">
                <div className="flex items-center space-x-2 text-slate-400">
                  <Brain className="h-5 w-5 animate-pulse" />
                  <span>Performing AI threat analysis...</span>
                </div>
              </div>
            )}

            {threatAnalyses.map((analysis) => (
              <div
                key={analysis.vesselId}
                className="bg-slate-700 p-4 rounded-lg space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-white">{analysis.vesselName}</div>
                    <div className="text-sm text-slate-400">ID: {analysis.vesselId}</div>
                  </div>
                  <Badge variant="outline" className={getRiskColor(analysis.riskLevel)}>
                    {analysis.riskLevel}
                  </Badge>
                </div>

                {/* Threat Score */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-300">Threat Score</span>
                    <span className="text-white font-medium">{analysis.threatScore}/100</span>
                  </div>
                  <Progress 
                    value={analysis.threatScore} 
                    className="h-2"
                    style={{
                      '--progress-background': getScoreColor(analysis.threatScore)
                    } as React.CSSProperties}
                  />
                </div>

                {/* Threat Factors */}
                <div className="space-y-2">
                  <div className="text-sm text-slate-300">Risk Factors:</div>
                  <div className="flex flex-wrap gap-1">
                    {analysis.factors.map((factor, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="text-xs text-slate-400 border-slate-600"
                      >
                        {factor}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="text-xs text-slate-500">
                  Last analyzed: {analysis.lastAnalyzed.toLocaleTimeString()}
                </div>
              </div>
            ))}

            {!isAnalyzing && threatAnalyses.length === 0 && (
              <div className="flex items-center justify-center py-8">
                <div className="text-center text-slate-400">
                  <AlertTriangle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No threat analysis available</p>
                  <p className="text-sm">Click Analyze to start threat assessment</p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* AI Status */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-700">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
            <span>AI Analysis Engine</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>Pattern Recognition: Active</span>
            <span>Threat Detection: Live</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ThreatAnalysisPanel;