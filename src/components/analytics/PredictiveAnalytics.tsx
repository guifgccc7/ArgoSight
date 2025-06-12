
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  Target,
  Activity,
  Zap,
  BarChart3,
  Shield
} from "lucide-react";

interface PredictionModel {
  id: string;
  name: string;
  type: 'behavior' | 'anomaly' | 'risk' | 'classification';
  accuracy: number;
  confidence: number;
  lastTrained: string;
  status: 'active' | 'training' | 'pending';
  predictions: any[];
}

const PredictiveAnalytics: React.FC = () => {
  const [models, setModels] = useState<PredictionModel[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('vessel-behavior');
  const [isTraining, setIsTraining] = useState(false);

  useEffect(() => {
    // Initialize predictive models
    const initModels: PredictionModel[] = [
      {
        id: 'vessel-behavior',
        name: 'Vessel Behavior Prediction',
        type: 'behavior',
        accuracy: 94.2,
        confidence: 87.5,
        lastTrained: '2024-01-15T10:30:00Z',
        status: 'active',
        predictions: [
          { vessel: 'MV Arctic Explorer', prediction: 'Route deviation likely in 2.5 hours', confidence: 89 },
          { vessel: 'MSC Celestine', prediction: 'Port arrival delay expected', confidence: 76 },
          { vessel: 'Baltic Trader', prediction: 'Speed reduction anticipated', confidence: 82 }
        ]
      },
      {
        id: 'anomaly-detection',
        name: 'Anomaly Detection Engine',
        type: 'anomaly',
        accuracy: 91.8,
        confidence: 92.1,
        lastTrained: '2024-01-14T15:45:00Z',
        status: 'active',
        predictions: [
          { type: 'AIS Signal Gap', location: '59.123°N, 18.456°E', severity: 'high', confidence: 94 },
          { type: 'Unusual Speed Pattern', vessel: 'Unknown Vessel', severity: 'medium', confidence: 78 },
          { type: 'Suspicious Route', area: 'Baltic Sea', severity: 'low', confidence: 65 }
        ]
      },
      {
        id: 'risk-scoring',
        name: 'Port Security Risk Model',
        type: 'risk',
        accuracy: 88.6,
        confidence: 85.3,
        lastTrained: '2024-01-13T08:20:00Z',
        status: 'training',
        predictions: [
          { port: 'Stockholm', riskScore: 23, factors: ['Weather conditions', 'Traffic density'] },
          { port: 'Helsinki', riskScore: 67, factors: ['Unknown vessel proximity', 'AIS irregularities'] },
          { port: 'Copenhagen', riskScore: 12, factors: ['Normal operations'] }
        ]
      },
      {
        id: 'vessel-classification',
        name: 'Satellite Image Classifier',
        type: 'classification',
        accuracy: 96.4,
        confidence: 91.7,
        lastTrained: '2024-01-12T12:00:00Z',
        status: 'active',
        predictions: [
          { image: 'SAT_IMG_001', classification: 'Container Ship', confidence: 97 },
          { image: 'SAT_IMG_002', classification: 'Tanker', confidence: 94 },
          { image: 'SAT_IMG_003', classification: 'Fishing Vessel', confidence: 89 }
        ]
      }
    ];
    setModels(initModels);
  }, []);

  const handleRetrainModel = (modelId: string) => {
    setIsTraining(true);
    setModels(prev => prev.map(model => 
      model.id === modelId 
        ? { ...model, status: 'training' as const }
        : model
    ));

    // Simulate training process
    setTimeout(() => {
      setModels(prev => prev.map(model => 
        model.id === modelId 
          ? { 
              ...model, 
              status: 'active' as const,
              accuracy: model.accuracy + Math.random() * 2,
              lastTrained: new Date().toISOString()
            }
          : model
      ));
      setIsTraining(false);
    }, 3000);
  };

  const getModelIcon = (type: string) => {
    switch (type) {
      case 'behavior': return TrendingUp;
      case 'anomaly': return AlertTriangle;
      case 'risk': return Shield;
      case 'classification': return Target;
      default: return Brain;
    }
  };

  const selectedModelData = models.find(m => m.id === selectedModel);

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <span className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-purple-400" />
            <span>Predictive Analytics Engine</span>
          </span>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-purple-400 border-purple-400">
              AI POWERED
            </Badge>
            <Badge variant="outline" className="text-green-400 border-green-400">
              {models.filter(m => m.status === 'active').length} ACTIVE
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedModel} onValueChange={setSelectedModel} className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            {models.map(model => {
              const Icon = getModelIcon(model.type);
              return (
                <TabsTrigger key={model.id} value={model.id} className="text-xs">
                  <Icon className="h-3 w-3 mr-1" />
                  {model.type.charAt(0).toUpperCase() + model.type.slice(1)}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {models.map(model => (
            <TabsContent key={model.id} value={model.id} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-900 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-400">Model Accuracy</span>
                    <Badge 
                      variant="outline" 
                      className={`${
                        model.status === 'active' ? 'text-green-400 border-green-400' :
                        model.status === 'training' ? 'text-yellow-400 border-yellow-400' :
                        'text-slate-400 border-slate-400'
                      }`}
                    >
                      {model.status.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">
                    {model.accuracy.toFixed(1)}%
                  </div>
                  <Progress value={model.accuracy} className="h-2" />
                </div>

                <div className="bg-slate-900 p-4 rounded-lg">
                  <span className="text-sm text-slate-400">Confidence Level</span>
                  <div className="text-2xl font-bold text-white mb-1">
                    {model.confidence.toFixed(1)}%
                  </div>
                  <Progress value={model.confidence} className="h-2" />
                </div>

                <div className="bg-slate-900 p-4 rounded-lg">
                  <span className="text-sm text-slate-400">Last Training</span>
                  <div className="text-white font-medium">
                    {new Date(model.lastTrained).toLocaleDateString()}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRetrainModel(model.id)}
                    disabled={isTraining || model.status === 'training'}
                    className="mt-2 text-xs"
                  >
                    {model.status === 'training' ? 'Training...' : 'Retrain Model'}
                  </Button>
                </div>
              </div>

              <div className="bg-slate-900 p-4 rounded-lg">
                <h4 className="text-white font-medium mb-3">Recent Predictions</h4>
                <div className="space-y-2">
                  {model.predictions.map((prediction, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-slate-800 rounded">
                      <div className="flex-1">
                        {model.type === 'behavior' && (
                          <div>
                            <span className="text-white font-medium">{prediction.vessel}</span>
                            <p className="text-sm text-slate-300">{prediction.prediction}</p>
                          </div>
                        )}
                        {model.type === 'anomaly' && (
                          <div>
                            <span className="text-white font-medium">{prediction.type}</span>
                            <p className="text-sm text-slate-300">
                              {prediction.location || prediction.vessel || prediction.area}
                            </p>
                          </div>
                        )}
                        {model.type === 'risk' && (
                          <div>
                            <span className="text-white font-medium">{prediction.port}</span>
                            <p className="text-sm text-slate-300">
                              Risk Score: {prediction.riskScore}/100
                            </p>
                          </div>
                        )}
                        {model.type === 'classification' && (
                          <div>
                            <span className="text-white font-medium">{prediction.classification}</span>
                            <p className="text-sm text-slate-300">{prediction.image}</p>
                          </div>
                        )}
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`${
                          prediction.confidence > 85 ? 'text-green-400 border-green-400' :
                          prediction.confidence > 70 ? 'text-yellow-400 border-yellow-400' :
                          'text-red-400 border-red-400'
                        }`}
                      >
                        {prediction.confidence}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PredictiveAnalytics;
