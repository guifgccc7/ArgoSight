
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  FileText, 
  Settings, 
  Database, 
  Shield, 
  Activity, 
  Download,
  ExternalLink,
  Book,
  Code,
  Users
} from "lucide-react";

const SystemDocumentation = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const documentationSections = [
    {
      id: 'overview',
      title: 'System Overview',
      icon: FileText,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">ArgoSight Maritime Intelligence Platform</h3>
            <p className="text-slate-300 mb-4">
              ArgoSight is a comprehensive maritime intelligence platform that provides real-time vessel tracking, 
              advanced analytics, threat detection, and operational intelligence for maritime security operations.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white text-sm">Core Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-slate-300 text-sm space-y-2">
                    <li>• Real-time vessel tracking</li>
                    <li>• Advanced data fusion</li>
                    <li>• AI-powered analytics</li>
                    <li>• Ghost fleet detection</li>
                    <li>• Climate intelligence</li>
                    <li>• Multi-organization support</li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white text-sm">Technology Stack</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-slate-300 text-sm space-y-2">
                    <li>• React + TypeScript</li>
                    <li>• Supabase Database</li>
                    <li>• Real-time subscriptions</li>
                    <li>• Advanced charting</li>
                    <li>• Role-based access</li>
                    <li>• Performance monitoring</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'api',
      title: 'API Reference',
      icon: Code,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Data Integration Service API</h3>
            <div className="space-y-4">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white text-sm">Vessel Management</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="bg-slate-900 p-3 rounded">
                    <code className="text-green-400 text-sm">
                      dataIntegrationService.createVessel(vessel: VesselData)
                    </code>
                    <p className="text-slate-400 text-xs mt-1">Create a new vessel record</p>
                  </div>
                  <div className="bg-slate-900 p-3 rounded">
                    <code className="text-green-400 text-sm">
                      dataIntegrationService.getVessels(organizationId?: string)
                    </code>
                    <p className="text-slate-400 text-xs mt-1">Retrieve vessels for organization</p>
                  </div>
                  <div className="bg-slate-900 p-3 rounded">
                    <code className="text-green-400 text-sm">
                      dataIntegrationService.addVesselPosition(position: VesselPosition)
                    </code>
                    <p className="text-slate-400 text-xs mt-1">Add vessel position data</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white text-sm">Alert Management</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="bg-slate-900 p-3 rounded">
                    <code className="text-green-400 text-sm">
                      dataIntegrationService.createAlert(alert: AlertData)
                    </code>
                    <p className="text-slate-400 text-xs mt-1">Create new security alert</p>
                  </div>
                  <div className="bg-slate-900 p-3 rounded">
                    <code className="text-green-400 text-sm">
                      dataIntegrationService.getAlerts(organizationId?, status?)
                    </code>
                    <p className="text-slate-400 text-xs mt-1">Retrieve filtered alerts</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'database',
      title: 'Database Schema',
      icon: Database,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Production Database Schema</h3>
            <div className="grid gap-4">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white text-sm">Core Tables</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <Badge variant="outline" className="mb-2">organizations</Badge>
                      <p className="text-slate-300 text-sm">Multi-tenant organization management</p>
                    </div>
                    <div>
                      <Badge variant="outline" className="mb-2">profiles</Badge>
                      <p className="text-slate-300 text-sm">Enhanced user profiles with roles</p>
                    </div>
                    <div>
                      <Badge variant="outline" className="mb-2">vessels</Badge>
                      <p className="text-slate-300 text-sm">Vessel registry and metadata</p>
                    </div>
                    <div>
                      <Badge variant="outline" className="mb-2">vessel_positions</Badge>
                      <p className="text-slate-300 text-sm">Real-time position tracking</p>
                    </div>
                    <div>
                      <Badge variant="outline" className="mb-2">alerts</Badge>
                      <p className="text-slate-300 text-sm">Security and operational alerts</p>
                    </div>
                    <div>
                      <Badge variant="outline" className="mb-2">analytics_data</Badge>
                      <p className="text-slate-300 text-sm">Performance and business metrics</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'security',
      title: 'Security & Access',
      icon: Shield,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Security Implementation</h3>
            <div className="space-y-4">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white text-sm">Row Level Security (RLS)</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300 text-sm mb-3">
                    All tables implement organization-based data isolation using Supabase RLS policies.
                  </p>
                  <ul className="text-slate-300 text-sm space-y-1">
                    <li>• Users can only access data from their organization</li>
                    <li>• Admins have cross-organization access</li>
                    <li>• Real-time subscriptions respect RLS policies</li>
                    <li>• Security definer functions prevent recursive queries</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white text-sm">User Roles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-red-600">Admin</Badge>
                      <span className="text-slate-300 text-sm">Full system access</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-cyan-600">Analyst</Badge>
                      <span className="text-slate-300 text-sm">Data analysis and reporting</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-green-600">Operator</Badge>
                      <span className="text-slate-300 text-sm">Operational monitoring</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'deployment',
      title: 'Deployment Guide',
      icon: Settings,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Production Deployment</h3>
            <div className="space-y-4">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white text-sm">Environment Setup</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h4 className="text-white text-sm font-medium mb-2">1. Supabase Configuration</h4>
                    <ul className="text-slate-300 text-sm space-y-1">
                      <li>• Run all database migrations</li>
                      <li>• Configure authentication providers</li>
                      <li>• Set up RLS policies</li>
                      <li>• Enable realtime for required tables</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-white text-sm font-medium mb-2">2. Application Deployment</h4>
                    <ul className="text-slate-300 text-sm space-y-1">
                      <li>• Build optimized production bundle</li>
                      <li>• Configure CDN for static assets</li>
                      <li>• Set up monitoring and logging</li>
                      <li>• Configure backup procedures</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white text-sm">Performance Optimization</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-slate-300 text-sm space-y-1">
                    <li>• Database indexing for optimal queries</li>
                    <li>• Caching strategies for large datasets</li>
                    <li>• Bundle size optimization</li>
                    <li>• Real-time data compression</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'monitoring',
      title: 'Monitoring & Analytics',
      icon: Activity,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">System Monitoring</h3>
            <div className="space-y-4">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white text-sm">Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-slate-300 text-sm space-y-1">
                    <li>• Page load times and API response times</li>
                    <li>• Error rates and system uptime</li>
                    <li>• User activity and session analytics</li>
                    <li>• Database performance metrics</li>
                    <li>• Real-time data freshness indicators</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white text-sm">Health Checks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-slate-300 text-sm">Database connectivity</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-slate-300 text-sm">Authentication service</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-slate-300 text-sm">Real-time subscriptions</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-slate-300 text-sm">External data feeds</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )
    }
  ];

  const exportDocumentation = () => {
    const docContent = documentationSections.map(section => 
      `# ${section.title}\n\n${section.content}\n\n`
    ).join('');
    
    const blob = new Blob([docContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'argosight-documentation.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
            <Book className="h-6 w-6 text-cyan-400" />
            <span>System Documentation</span>
          </h2>
          <p className="text-slate-400 mt-1">Comprehensive platform documentation and guides</p>
        </div>
        <Button
          onClick={exportDocumentation}
          variant="outline"
          className="border-slate-600 text-slate-300 hover:bg-slate-700"
        >
          <Download className="h-4 w-4 mr-2" />
          Export Docs
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-800 border-slate-700 lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-white text-sm">Navigation</CardTitle>
          </CardHeader>
          <CardContent>
            <nav className="space-y-2">
              {documentationSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full text-left p-2 rounded flex items-center space-x-2 transition-colors ${
                    activeSection === section.id
                      ? 'bg-cyan-600 text-white'
                      : 'text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <section.icon className="h-4 w-4" />
                  <span className="text-sm">{section.title}</span>
                </button>
              ))}
            </nav>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700 lg:col-span-3">
          <CardContent className="p-0">
            <ScrollArea className="h-[600px] p-6">
              {documentationSections.find(s => s.id === activeSection)?.content}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SystemDocumentation;
