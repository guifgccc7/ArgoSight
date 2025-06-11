
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Shield, Thermometer, Waves, Clock } from "lucide-react";

const RiskAssessment = () => {
  const [selectedSeason, setSelectedSeason] = useState('summer');
  
  const riskFactors = {
    summer: {
      iceCondition: { level: 15, status: 'low', description: 'Minimal ice coverage, clear passages' },
      weather: { level: 25, status: 'low', description: 'Calm seas, favorable winds' },
      navigation: { level: 20, status: 'low', description: 'Well-established shipping lanes' },
      rescue: { level: 35, status: 'medium', description: 'Limited rescue infrastructure' }
    },
    autumn: {
      iceCondition: { level: 45, status: 'medium', description: 'Increasing ice formation' },
      weather: { level: 55, status: 'medium', description: 'Variable weather conditions' },
      navigation: { level: 40, status: 'medium', description: 'Shorter navigation window' },
      rescue: { level: 45, status: 'medium', description: 'Reduced response capability' }
    },
    winter: {
      iceCondition: { level: 85, status: 'high', description: 'Heavy ice coverage, icebreaker required' },
      weather: { level: 90, status: 'high', description: 'Severe weather, limited visibility' },
      navigation: { level: 95, status: 'high', description: 'Extremely challenging conditions' },
      rescue: { level: 85, status: 'high', description: 'Very limited rescue options' }
    },
    spring: {
      iceCondition: { level: 35, status: 'medium', description: 'Melting ice, unpredictable conditions' },
      weather: { level: 40, status: 'medium', description: 'Improving but variable weather' },
      navigation: { level: 30, status: 'low', description: 'Opening navigation season' },
      rescue: { level: 40, status: 'medium', description: 'Improving response capability' }
    }
  };
  
  const mitigationStrategies = [
    {
      risk: 'Ice Conditions',
      strategy: 'Ice-strengthened hull, real-time ice charts, icebreaker escort',
      effectiveness: 85
    },
    {
      risk: 'Weather Hazards',
      strategy: 'Advanced weather routing, storm avoidance, reinforced structures',
      effectiveness: 78
    },
    {
      risk: 'Navigation Challenges',
      strategy: 'Experienced Arctic pilots, GPS backup systems, radar enhancement',
      effectiveness: 92
    },
    {
      risk: 'Emergency Response',
      strategy: 'Emergency equipment, communication systems, SAR coordination',
      effectiveness: 70
    }
  ];
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'low': return 'text-green-400 border-green-400';
      case 'medium': return 'text-yellow-400 border-yellow-400';
      case 'high': return 'text-red-400 border-red-400';
      default: return 'text-slate-400 border-slate-400';
    }
  };
  
  const getProgressColor = (level: number) => {
    if (level < 30) return 'bg-green-500';
    if (level < 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  const currentRisks = riskFactors[selectedSeason as keyof typeof riskFactors];
  const overallRisk = Math.round((
    currentRisks.iceCondition.level + 
    currentRisks.weather.level + 
    currentRisks.navigation.level + 
    currentRisks.rescue.level
  ) / 4);
  
  return (
    <div className="space-y-6">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Shield className="h-5 w-5 mr-2 text-cyan-400" />
            Arctic Route Risk Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedSeason} onValueChange={setSelectedSeason} className="space-y-4">
            <TabsList className="grid w-full grid-cols-4 bg-slate-900">
              <TabsTrigger value="summer">Summer</TabsTrigger>
              <TabsTrigger value="autumn">Autumn</TabsTrigger>
              <TabsTrigger value="winter">Winter</TabsTrigger>
              <TabsTrigger value="spring">Spring</TabsTrigger>
            </TabsList>
            
            <div className="mt-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Overall Risk Level</h3>
                <Badge 
                  variant="outline" 
                  className={getStatusColor(
                    overallRisk < 30 ? 'low' : overallRisk < 60 ? 'medium' : 'high'
                  )}
                >
                  {overallRisk < 30 ? 'LOW' : overallRisk < 60 ? 'MEDIUM' : 'HIGH'} RISK
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="bg-slate-900 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Thermometer className="h-4 w-4 text-cyan-400" />
                        <span className="text-white font-medium">Ice Conditions</span>
                      </div>
                      <Badge variant="outline" className={getStatusColor(currentRisks.iceCondition.status)}>
                        {currentRisks.iceCondition.status.toUpperCase()}
                      </Badge>
                    </div>
                    <Progress 
                      value={currentRisks.iceCondition.level} 
                      className="mb-2"
                    />
                    <p className="text-sm text-slate-300">{currentRisks.iceCondition.description}</p>
                  </div>
                  
                  <div className="bg-slate-900 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Waves className="h-4 w-4 text-cyan-400" />
                        <span className="text-white font-medium">Weather Conditions</span>
                      </div>
                      <Badge variant="outline" className={getStatusColor(currentRisks.weather.status)}>
                        {currentRisks.weather.status.toUpperCase()}
                      </Badge>
                    </div>
                    <Progress 
                      value={currentRisks.weather.level} 
                      className="mb-2"
                    />
                    <p className="text-sm text-slate-300">{currentRisks.weather.description}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-slate-900 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-4 w-4 text-cyan-400" />
                        <span className="text-white font-medium">Navigation Complexity</span>
                      </div>
                      <Badge variant="outline" className={getStatusColor(currentRisks.navigation.status)}>
                        {currentRisks.navigation.status.toUpperCase()}
                      </Badge>
                    </div>
                    <Progress 
                      value={currentRisks.navigation.level} 
                      className="mb-2"
                    />
                    <p className="text-sm text-slate-300">{currentRisks.navigation.description}</p>
                  </div>
                  
                  <div className="bg-slate-900 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-cyan-400" />
                        <span className="text-white font-medium">Emergency Response</span>
                      </div>
                      <Badge variant="outline" className={getStatusColor(currentRisks.rescue.status)}>
                        {currentRisks.rescue.status.toUpperCase()}
                      </Badge>
                    </div>
                    <Progress 
                      value={currentRisks.rescue.level} 
                      className="mb-2"
                    />
                    <p className="text-sm text-slate-300">{currentRisks.rescue.description}</p>
                  </div>
                </div>
              </div>
            </div>
          </Tabs>
        </CardContent>
      </Card>
      
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Risk Mitigation Strategies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mitigationStrategies.map((item, index) => (
              <div key={index} className="bg-slate-900 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white font-medium">{item.risk}</h4>
                  <Badge variant="outline" className="text-green-400 border-green-400">
                    {item.effectiveness}% EFFECTIVE
                  </Badge>
                </div>
                <p className="text-sm text-slate-300 mb-2">{item.strategy}</p>
                <Progress value={item.effectiveness} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RiskAssessment;
