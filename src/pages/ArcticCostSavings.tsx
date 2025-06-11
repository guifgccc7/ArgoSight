
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, Calculator, Shield, Globe, BarChart3 } from "lucide-react";
import CostCalculator from "@/components/arctic/CostCalculator";
import RiskAssessment from "@/components/arctic/RiskAssessment";
import MarketAnalysis from "@/components/arctic/MarketAnalysis";

const ArcticCostSavings = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Arctic Route Cost Savings Analysis</h1>
        <div className="text-sm text-slate-400">
          Real-time market data • Updated {new Date().toLocaleDateString()}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-400" />
              <span className="text-white">Potential Industry Savings</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">$2.1B</div>
            <p className="text-slate-400">Annual savings potential</p>
            <div className="text-sm text-green-300 mt-1">+24% vs 2023</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-cyan-400" />
              <span className="text-white">Route Efficiency</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cyan-400">35%</div>
            <p className="text-slate-400">Distance reduction vs Suez</p>
            <div className="text-sm text-cyan-300 mt-1">8 days faster</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="h-5 w-5 text-yellow-400" />
              <span className="text-white">Market Growth</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-400">18.5%</div>
            <p className="text-slate-400">Annual growth rate (CAGR)</p>
            <div className="text-sm text-yellow-300 mt-1">156 vessels active</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="calculator" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-slate-900 border-slate-700">
          <TabsTrigger value="calculator" className="flex items-center space-x-2">
            <Calculator className="h-4 w-4" />
            <span>Cost Calculator</span>
          </TabsTrigger>
          <TabsTrigger value="risk" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Risk Assessment</span>
          </TabsTrigger>
          <TabsTrigger value="market" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Market Analysis</span>
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <span>Strategic Insights</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calculator">
          <CostCalculator />
        </TabsContent>

        <TabsContent value="risk">
          <RiskAssessment />
        </TabsContent>

        <TabsContent value="market">
          <MarketAnalysis />
        </TabsContent>

        <TabsContent value="insights">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Strategic Business Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-cyan-400">Key Recommendations</h3>
                  
                  <div className="bg-slate-900 p-4 rounded-lg">
                    <h4 className="text-white font-medium mb-2">Immediate Actions</h4>
                    <ul className="space-y-2 text-sm text-slate-300">
                      <li>• Invest in ice-strengthened vessel modifications</li>
                      <li>• Establish partnerships with Arctic service providers</li>
                      <li>• Develop Arctic-specific crew training programs</li>
                      <li>• Secure comprehensive Arctic insurance coverage</li>
                    </ul>
                  </div>
                  
                  <div className="bg-slate-900 p-4 rounded-lg">
                    <h4 className="text-white font-medium mb-2">Medium-term Strategy</h4>
                    <ul className="space-y-2 text-sm text-slate-300">
                      <li>• Build strategic fuel depots along Arctic routes</li>
                      <li>• Develop proprietary ice navigation technology</li>
                      <li>• Form Arctic shipping consortiums</li>
                      <li>• Establish year-round Arctic operations</li>
                    </ul>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-green-400">Competitive Advantages</h3>
                  
                  <div className="bg-slate-900 p-4 rounded-lg">
                    <h4 className="text-white font-medium mb-2">First-Mover Benefits</h4>
                    <ul className="space-y-2 text-sm text-slate-300">
                      <li>• Premium pricing for Arctic expertise</li>
                      <li>• Preferred partnerships with Arctic nations</li>
                      <li>• Access to prime Arctic infrastructure sites</li>
                      <li>• Regulatory influence in Arctic shipping standards</li>
                    </ul>
                  </div>
                  
                  <div className="bg-slate-900 p-4 rounded-lg">
                    <h4 className="text-white font-medium mb-2">Market Positioning</h4>
                    <ul className="space-y-2 text-sm text-slate-300">
                      <li>• Leader in sustainable Arctic shipping</li>
                      <li>• Pioneer in Arctic route optimization</li>
                      <li>• Trusted partner for high-value cargo</li>
                      <li>• Innovation hub for Arctic technologies</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-cyan-900 to-blue-900 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-white mb-4">Investment Outlook</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-cyan-400">$50M</div>
                    <div className="text-sm text-cyan-200">Initial Investment Required</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-400">24 months</div>
                    <div className="text-sm text-green-200">Expected ROI Timeline</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-yellow-400">300%</div>
                    <div className="text-sm text-yellow-200">5-Year ROI Potential</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ArcticCostSavings;
