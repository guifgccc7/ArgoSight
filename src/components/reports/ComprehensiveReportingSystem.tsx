
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  FileText, 
  Download, 
  Calendar, 
  Clock, 
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
  Shield,
  Globe,
  Settings,
  Send
} from "lucide-react";

interface Report {
  id: string;
  title: string;
  type: 'intelligence' | 'security' | 'operations' | 'analysis';
  status: 'generating' | 'ready' | 'scheduled';
  createdAt: string;
  size: string;
  format: 'PDF' | 'Excel' | 'JSON';
  progress?: number;
}

const ComprehensiveReportingSystem: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [reports, setReports] = useState<Report[]>([
    {
      id: 'r1',
      title: 'Daily Intelligence Briefing',
      type: 'intelligence',
      status: 'ready',
      createdAt: '2025-06-12T08:00:00Z',
      size: '2.3 MB',
      format: 'PDF'
    },
    {
      id: 'r2',
      title: 'Arctic Route Analysis',
      type: 'analysis',
      status: 'generating',
      createdAt: '2025-06-12T09:15:00Z',
      size: '1.8 MB',
      format: 'Excel',
      progress: 67
    },
    {
      id: 'r3',
      title: 'Security Threat Assessment',
      type: 'security',
      status: 'scheduled',
      createdAt: '2025-06-12T18:00:00Z',
      size: '4.1 MB',
      format: 'PDF'
    },
    {
      id: 'r4',
      title: 'Weekly Operations Summary',
      type: 'operations',
      status: 'ready',
      createdAt: '2025-06-11T23:59:00Z',
      size: '3.2 MB',
      format: 'JSON'
    }
  ]);

  const stats = {
    totalReports: 156,
    generatedToday: 12,
    scheduledReports: 8,
    avgGenerationTime: '3.2 min'
  };

  const getStatusColor = (status: Report['status']) => {
    switch (status) {
      case 'ready': return 'text-green-400 border-green-400';
      case 'generating': return 'text-yellow-400 border-yellow-400';
      case 'scheduled': return 'text-blue-400 border-blue-400';
      default: return 'text-slate-400 border-slate-400';
    }
  };

  const getTypeIcon = (type: Report['type']) => {
    switch (type) {
      case 'intelligence': return <Shield className="h-4 w-4" />;
      case 'security': return <Shield className="h-4 w-4" />;
      case 'operations': return <Activity className="h-4 w-4" />;
      case 'analysis': return <TrendingUp className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const generateReport = (type: Report['type']) => {
    const newReport: Report = {
      id: `r${Date.now()}`,
      title: `New ${type} Report`,
      type,
      status: 'generating',
      createdAt: new Date().toISOString(),
      size: '0 MB',
      format: 'PDF',
      progress: 0
    };
    
    setReports(prev => [newReport, ...prev]);
    
    // Simulate report generation
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress >= 100) {
        setReports(prev => prev.map(r => 
          r.id === newReport.id 
            ? { ...r, status: 'ready' as const, size: `${(Math.random() * 5 + 1).toFixed(1)} MB`, progress: undefined }
            : r
        ));
        clearInterval(interval);
      } else {
        setReports(prev => prev.map(r => 
          r.id === newReport.id ? { ...r, progress } : r
        ));
      }
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Comprehensive Reporting System</h2>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-green-400 border-green-400">
            AUTOMATED REPORTING
          </Badge>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <FileText className="h-8 w-8 text-blue-400" />
              <div>
                <p className="text-sm text-slate-400">Total Reports</p>
                <p className="text-2xl font-bold text-white">{stats.totalReports}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Clock className="h-8 w-8 text-green-400" />
              <div>
                <p className="text-sm text-slate-400">Generated Today</p>
                <p className="text-2xl font-bold text-white">{stats.generatedToday}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Calendar className="h-8 w-8 text-purple-400" />
              <div>
                <p className="text-sm text-slate-400">Scheduled</p>
                <p className="text-2xl font-bold text-white">{stats.scheduledReports}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-8 w-8 text-cyan-400" />
              <div>
                <p className="text-sm text-slate-400">Avg Generation</p>
                <p className="text-2xl font-bold text-white">{stats.avgGenerationTime}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="dashboard" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="generate" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Generate Reports</span>
          </TabsTrigger>
          <TabsTrigger value="scheduled" className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>Scheduled</span>
          </TabsTrigger>
          <TabsTrigger value="exports" className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export Center</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <div className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Recent Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reports.map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-4 bg-slate-900 rounded-lg border border-slate-700">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-slate-800 rounded-lg">
                          {getTypeIcon(report.type)}
                        </div>
                        <div>
                          <h4 className="text-white font-medium">{report.title}</h4>
                          <p className="text-sm text-slate-400">
                            {new Date(report.createdAt).toLocaleString()} • {report.size}
                          </p>
                          {report.progress !== undefined && (
                            <div className="mt-2">
                              <Progress value={report.progress} className="w-48 h-2" />
                              <p className="text-xs text-slate-400 mt-1">{Math.round(report.progress)}% complete</p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline" className={getStatusColor(report.status)}>
                          {report.status.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className="text-slate-400 border-slate-600">
                          {report.format}
                        </Badge>
                        {report.status === 'ready' && (
                          <Button variant="outline" size="sm" className="text-cyan-400 border-cyan-600">
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="generate">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Quick Reports</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={() => generateReport('intelligence')}
                  className="w-full justify-start bg-blue-600 hover:bg-blue-700"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Generate Intelligence Brief
                </Button>
                <Button
                  onClick={() => generateReport('security')}
                  className="w-full justify-start bg-red-600 hover:bg-red-700"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Security Assessment
                </Button>
                <Button
                  onClick={() => generateReport('operations')}
                  className="w-full justify-start bg-green-600 hover:bg-green-700"
                >
                  <Activity className="h-4 w-4 mr-2" />
                  Operations Summary
                </Button>
                <Button
                  onClick={() => generateReport('analysis')}
                  className="w-full justify-start bg-purple-600 hover:bg-purple-700"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Data Analysis Report
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Custom Report Builder</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-8 text-slate-400">
                  <Settings className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Custom report builder coming soon</p>
                  <p className="text-xs mt-1">Advanced filtering and customization options</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="scheduled">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Scheduled Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-slate-400">
                <Calendar className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Automated Report Scheduling</h3>
                <p className="mb-4">Set up automated reports to be generated and distributed on a schedule</p>
                <Button className="bg-cyan-600 hover:bg-cyan-700">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule New Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exports">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Export Center</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-slate-900 rounded-lg border border-slate-700">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-red-400" />
                  <h3 className="text-white font-medium mb-2">PDF Export</h3>
                  <p className="text-sm text-slate-400 mb-4">Professional formatted reports</p>
                  <Button variant="outline" className="text-red-400 border-red-600">
                    Export PDF
                  </Button>
                </div>
                <div className="text-center p-6 bg-slate-900 rounded-lg border border-slate-700">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 text-green-400" />
                  <h3 className="text-white font-medium mb-2">Excel Export</h3>
                  <p className="text-sm text-slate-400 mb-4">Data analysis and charts</p>
                  <Button variant="outline" className="text-green-400 border-green-600">
                    Export Excel
                  </Button>
                </div>
                <div className="text-center p-6 bg-slate-900 rounded-lg border border-slate-700">
                  <Globe className="h-12 w-12 mx-auto mb-4 text-blue-400" />
                  <h3 className="text-white font-medium mb-2">API Export</h3>
                  <p className="text-sm text-slate-400 mb-4">JSON data for integrations</p>
                  <Button variant="outline" className="text-blue-400 border-blue-600">
                    API Access
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ComprehensiveReportingSystem;
