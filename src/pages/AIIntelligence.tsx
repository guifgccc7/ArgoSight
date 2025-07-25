import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Zap, Shield, FileText, TrendingUp, Eye } from "lucide-react";
import AIAnalyticsChat from "@/components/intelligence/AIAnalyticsChat";
import ThreatAnalysisPanel from "@/components/intelligence/ThreatAnalysisPanel";
import AutoReportGenerator from "@/components/intelligence/AutoReportGenerator";

const AIIntelligence = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">AI Maritime Intelligence</h1>
          <p className="text-slate-400 mt-1">Advanced AI-powered maritime threat analysis and intelligence</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-cyan-400 border-cyan-400">
            <Brain className="h-3 w-3 mr-1" />
            AI ACTIVE
          </Badge>
          <Badge variant="outline" className="text-green-400 border-green-400">
            REAL-TIME
          </Badge>
          <Badge variant="outline" className="text-red-400 border-red-400">
            THREAT ANALYSIS
          </Badge>
        </div>
      </div>

      {/* AI Intelligence Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">AI Analysis Engine</CardTitle>
            <Brain className="h-4 w-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">GPT-4.1</div>
            <p className="text-xs text-slate-400">
              <span className="text-green-400">Online</span> • Maritime Intelligence
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Threat Detection</CardTitle>
            <Shield className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">97.3%</div>
            <p className="text-xs text-slate-400">
              <span className="text-green-400">Accuracy</span> • Last 30 days
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Auto Reports</CardTitle>
            <FileText className="h-4 w-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">24/7</div>
            <p className="text-xs text-slate-400">
              <span className="text-cyan-400">+15</span> today
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Pattern Recognition</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">156</div>
            <p className="text-xs text-slate-400">
              <span className="text-orange-400">+12</span> new patterns
            </p>
          </CardContent>
        </Card>
      </div>

      {/* AI Chat Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AIAnalyticsChat />
        </div>
        <div>
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Zap className="h-5 w-5 text-yellow-400" />
                <span>AI Capabilities</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-slate-700 rounded-lg">
                  <Shield className="h-5 w-5 text-red-400" />
                  <div>
                    <div className="text-sm font-medium text-white">Threat Assessment</div>
                    <div className="text-xs text-slate-400">Real-time vessel risk scoring</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-slate-700 rounded-lg">
                  <Eye className="h-5 w-5 text-cyan-400" />
                  <div>
                    <div className="text-sm font-medium text-white">Pattern Recognition</div>
                    <div className="text-xs text-slate-400">Ghost fleet identification</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-slate-700 rounded-lg">
                  <FileText className="h-5 w-5 text-green-400" />
                  <div>
                    <div className="text-sm font-medium text-white">Report Generation</div>
                    <div className="text-xs text-slate-400">Automated intelligence briefs</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-slate-700 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-purple-400" />
                  <div>
                    <div className="text-sm font-medium text-white">Route Optimization</div>
                    <div className="text-xs text-slate-400">AI-powered routing analysis</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Threat Analysis and Report Generation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ThreatAnalysisPanel />
        <AutoReportGenerator />
      </div>

      {/* AI Performance Metrics */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Brain className="h-5 w-5 text-cyan-400" />
            <span>AI Performance Metrics</span>
            <Badge variant="outline" className="text-green-400 border-green-400">
              OPERATIONAL
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="text-sm text-slate-300 font-medium">Analysis Speed</div>
              <div className="text-2xl font-bold text-cyan-400">2.3s</div>
              <div className="text-xs text-slate-400">Average response time</div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm text-slate-300 font-medium">Data Processing</div>
              <div className="text-2xl font-bold text-green-400">847K</div>
              <div className="text-xs text-slate-400">Vessels analyzed today</div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm text-slate-300 font-medium">Threat Predictions</div>
              <div className="text-2xl font-bold text-orange-400">94.7%</div>
              <div className="text-xs text-slate-400">Accuracy rate</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIIntelligence;