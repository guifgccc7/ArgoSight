
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, 
  AlertTriangle, 
  TrendingUp, 
  Eye,
  Brain,
  Target,
  Clock,
  MapPin
} from "lucide-react";
import { patternRecognitionService, ThreatAssessment } from "@/services/patternRecognitionService";

const ThreatAssessmentPanel = () => {
  const [assessments, setAssessments] = useState<ThreatAssessment[]>([]);
  const [selectedAssessment, setSelectedAssessment] = useState<ThreatAssessment | null>(null);

  useEffect(() => {
    // Generate mock threat assessments
    const mockAssessments: ThreatAssessment[] = [
      {
        vesselId: 'MV-ATLANTIC-001',
        overallRisk: 'critical',
        riskScore: 89,
        patterns: [],
        predictions: {
          nextLikelyAction: 'Attempt to enter restricted waters',
          confidence: 0.82,
          timeframe: '2-4 hours'
        },
        recommendations: [
          'Immediate investigation required',
          'Alert maritime authorities',
          'Increase monitoring frequency'
        ]
      },
      {
        vesselId: 'CARGO-STAR-042',
        overallRisk: 'high',
        riskScore: 73,
        patterns: [],
        predictions: {
          nextLikelyAction: 'Continue current suspicious route',
          confidence: 0.67,
          timeframe: '6-12 hours'
        },
        recommendations: [
          'Enhanced surveillance recommended',
          'Coordinate with regional forces'
        ]
      },
      {
        vesselId: 'FISHING-FLEET-15',
        overallRisk: 'medium',
        riskScore: 45,
        patterns: [],
        predictions: {
          nextLikelyAction: 'Resume normal operations',
          confidence: 0.54,
          timeframe: '12-24 hours'
        },
        recommendations: [
          'Continue monitoring',
          'Review historical behavior'
        ]
      }
    ];
    
    setAssessments(mockAssessments);
  }, []);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'text-red-400 border-red-400';
      case 'high': return 'text-orange-400 border-orange-400';
      case 'medium': return 'text-yellow-400 border-yellow-400';
      case 'low': return 'text-green-400 border-green-400';
      default: return 'text-slate-400 border-slate-400';
    }
  };

  const getRiskBgColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'bg-red-500/10 border-red-500/20';
      case 'high': return 'bg-orange-500/10 border-orange-500/20';
      case 'medium': return 'bg-yellow-500/10 border-yellow-500/20';
      case 'low': return 'bg-green-500/10 border-green-500/20';
      default: return 'bg-slate-500/10 border-slate-500/20';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Threat Assessment Center</h2>
          <p className="text-slate-400">AI-powered vessel risk analysis and predictions</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-red-400 border-red-400">
            <AlertTriangle className="h-3 w-3 mr-1" />
            {assessments.filter(a => a.overallRisk === 'critical').length} CRITICAL
          </Badge>
          <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700">
            <Eye className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Threat Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { risk: 'critical', count: assessments.filter(a => a.overallRisk === 'critical').length, icon: AlertTriangle },
          { risk: 'high', count: assessments.filter(a => a.overallRisk === 'high').length, icon: TrendingUp },
          { risk: 'medium', count: assessments.filter(a => a.overallRisk === 'medium').length, icon: Shield },
          { risk: 'low', count: assessments.filter(a => a.overallRisk === 'low').length, icon: Target }
        ].map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.risk} className={`border ${getRiskBgColor(item.risk)}`}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Icon className={`h-8 w-8 ${getRiskColor(item.risk).split(' ')[0]}`} />
                  <div>
                    <p className="text-sm text-slate-400 capitalize">{item.risk} Risk</p>
                    <p className="text-2xl font-bold text-white">{item.count}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Threat Assessments List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Active Threat Assessments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {assessments.map((assessment) => (
                <div 
                  key={assessment.vesselId}
                  className={`p-4 rounded-lg border cursor-pointer transition-all hover:border-slate-600 ${
                    selectedAssessment?.vesselId === assessment.vesselId 
                      ? 'border-cyan-500 bg-cyan-500/5' 
                      : `border ${getRiskBgColor(assessment.overallRisk)}`
                  }`}
                  onClick={() => setSelectedAssessment(assessment)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-medium">{assessment.vesselId}</h3>
                    <Badge variant="outline" className={getRiskColor(assessment.overallRisk)}>
                      {assessment.overallRisk.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Risk Score</span>
                      <span className="text-white font-medium">{assessment.riskScore}/100</span>
                    </div>
                    <Progress value={assessment.riskScore} className="h-2" />
                  </div>
                  
                  <div className="mt-3 text-xs text-slate-400">
                    <div className="flex items-center space-x-1">
                      <Brain className="h-3 w-3" />
                      <span>Next Action: {assessment.predictions.nextLikelyAction}</span>
                    </div>
                    <div className="flex items-center space-x-1 mt-1">
                      <Clock className="h-3 w-3" />
                      <span>Confidence: {Math.round(assessment.predictions.confidence * 100)}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Detailed Assessment View */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Target className="h-5 w-5 mr-2" />
              {selectedAssessment ? `Assessment: ${selectedAssessment.vesselId}` : 'Select Assessment'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedAssessment ? (
              <div className="space-y-6">
                {/* Risk Overview */}
                <div className={`p-4 rounded-lg border ${getRiskBgColor(selectedAssessment.overallRisk)}`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-white font-medium">Overall Risk Level</span>
                    <Badge variant="outline" className={getRiskColor(selectedAssessment.overallRisk)}>
                      {selectedAssessment.overallRisk.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Risk Score</span>
                      <span className="text-white font-bold">{selectedAssessment.riskScore}/100</span>
                    </div>
                    <Progress value={selectedAssessment.riskScore} className="h-3" />
                  </div>
                </div>

                {/* AI Predictions */}
                <div className="space-y-3">
                  <h4 className="text-white font-medium flex items-center">
                    <Brain className="h-4 w-4 mr-2" />
                    AI Predictions
                  </h4>
                  <div className="p-3 bg-slate-900 rounded-lg">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Next Likely Action:</span>
                        <span className="text-white">{selectedAssessment.predictions.nextLikelyAction}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Confidence:</span>
                        <span className="text-cyan-400">{Math.round(selectedAssessment.predictions.confidence * 100)}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Timeframe:</span>
                        <span className="text-white">{selectedAssessment.predictions.timeframe}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="space-y-3">
                  <h4 className="text-white font-medium">Recommended Actions</h4>
                  <div className="space-y-2">
                    {selectedAssessment.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start space-x-2 p-2 bg-slate-900 rounded">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2"></div>
                        <span className="text-sm text-slate-300">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <Button size="sm" className="bg-red-600 hover:bg-red-700 flex-1">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Escalate
                  </Button>
                  <Button size="sm" variant="outline" className="border-slate-600 flex-1">
                    <Eye className="h-4 w-4 mr-2" />
                    Monitor
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Target className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-400 mb-2">Select an Assessment</h3>
                <p className="text-slate-500">Click on a threat assessment to view detailed analysis and recommendations.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ThreatAssessmentPanel;
