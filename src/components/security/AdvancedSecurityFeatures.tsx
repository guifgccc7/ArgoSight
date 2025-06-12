
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, 
  Lock, 
  Eye, 
  FileCheck, 
  Users, 
  AlertTriangle,
  Key,
  Activity,
  Globe,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react";

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  result: 'success' | 'failed' | 'warning';
  ipAddress: string;
  details: string;
}

interface SecurityMetrics {
  encryptionStatus: 'enabled' | 'disabled';
  activeConnections: number;
  failedLogins: number;
  auditLogCount: number;
  lastSecurityScan: string;
  vulnerabilities: number;
  complianceScore: number;
}

const AdvancedSecurityFeatures: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [securityMetrics, setSecurityMetrics] = useState<SecurityMetrics>({
    encryptionStatus: 'enabled',
    activeConnections: 47,
    failedLogins: 3,
    auditLogCount: 2847,
    lastSecurityScan: '2025-06-12T06:00:00Z',
    vulnerabilities: 0,
    complianceScore: 98.7
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    {
      id: 'al1',
      timestamp: '2025-06-12T10:30:15Z',
      user: 'analyst@maritime.gov',
      action: 'VIEW_CLASSIFIED_REPORT',
      resource: '/intelligence/reports/classified/arctic-threat-assessment',
      result: 'success',
      ipAddress: '192.168.1.45',
      details: 'Accessed Arctic threat assessment document'
    },
    {
      id: 'al2',
      timestamp: '2025-06-12T10:28:42Z',
      user: 'unknown@external.com',
      action: 'LOGIN_ATTEMPT',
      resource: '/auth/login',
      result: 'failed',
      ipAddress: '203.0.113.195',
      details: 'Invalid credentials - multiple attempts detected'
    },
    {
      id: 'al3',
      timestamp: '2025-06-12T10:25:33Z',
      user: 'admin@maritime.gov',
      action: 'MODIFY_USER_PERMISSIONS',
      resource: '/admin/users/analyst-2847',
      result: 'success',
      ipAddress: '192.168.1.10',
      details: 'Updated clearance level to TOP_SECRET'
    },
    {
      id: 'al4',
      timestamp: '2025-06-12T10:22:18Z',
      user: 'system',
      action: 'ENCRYPTION_KEY_ROTATION',
      resource: '/security/encryption',
      result: 'success',
      ipAddress: 'localhost',
      details: 'Automatic encryption key rotation completed'
    }
  ]);

  useEffect(() => {
    // Simulate real-time security monitoring
    const interval = setInterval(() => {
      setSecurityMetrics(prev => ({
        ...prev,
        activeConnections: prev.activeConnections + Math.floor(Math.random() * 3) - 1,
        auditLogCount: prev.auditLogCount + Math.floor(Math.random() * 2)
      }));

      // Occasionally add new audit logs
      if (Math.random() > 0.8) {
        const newLog: AuditLog = {
          id: `al${Date.now()}`,
          timestamp: new Date().toISOString(),
          user: 'system',
          action: 'SECURITY_SCAN',
          resource: '/security/monitoring',
          result: 'success',
          ipAddress: 'localhost',
          details: 'Automated security scan completed'
        };
        setAuditLogs(prev => [newLog, ...prev.slice(0, 9)]);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getResultColor = (result: AuditLog['result']) => {
    switch (result) {
      case 'success': return 'text-green-400 border-green-400';
      case 'failed': return 'text-red-400 border-red-400';
      case 'warning': return 'text-yellow-400 border-yellow-400';
      default: return 'text-slate-400 border-slate-400';
    }
  };

  const getResultIcon = (result: AuditLog['result']) => {
    switch (result) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-400" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      default: return <Activity className="h-4 w-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Advanced Security Center</h2>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-green-400 border-green-400">
            <Shield className="h-3 w-3 mr-1" />
            SECURE
          </Badge>
          <Badge variant="outline" className="text-cyan-400 border-cyan-400">
            COMPLIANCE: {securityMetrics.complianceScore}%
          </Badge>
        </div>
      </div>

      {/* Security Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Lock className="h-8 w-8 text-green-400" />
              <div>
                <p className="text-sm text-slate-400">Encryption</p>
                <p className="text-lg font-bold text-white">
                  {securityMetrics.encryptionStatus === 'enabled' ? 'ACTIVE' : 'DISABLED'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Users className="h-8 w-8 text-blue-400" />
              <div>
                <p className="text-sm text-slate-400">Active Connections</p>
                <p className="text-2xl font-bold text-white">{securityMetrics.activeConnections}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-8 w-8 text-red-400" />
              <div>
                <p className="text-sm text-slate-400">Failed Logins</p>
                <p className="text-2xl font-bold text-white">{securityMetrics.failedLogins}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <FileCheck className="h-8 w-8 text-purple-400" />
              <div>
                <p className="text-sm text-slate-400">Audit Logs</p>
                <p className="text-2xl font-bold text-white">{securityMetrics.auditLogCount.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Security Overview</span>
          </TabsTrigger>
          <TabsTrigger value="encryption" className="flex items-center space-x-2">
            <Lock className="h-4 w-4" />
            <span>Encryption</span>
          </TabsTrigger>
          <TabsTrigger value="audit" className="flex items-center space-x-2">
            <Eye className="h-4 w-4" />
            <span>Audit Logs</span>
          </TabsTrigger>
          <TabsTrigger value="compliance" className="flex items-center space-x-2">
            <FileCheck className="h-4 w-4" />
            <span>Compliance</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Security Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">End-to-End Encryption</span>
                  <Badge variant="outline" className="text-green-400 border-green-400">ENABLED</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Two-Factor Authentication</span>
                  <Badge variant="outline" className="text-green-400 border-green-400">ENFORCED</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Access Control</span>
                  <Badge variant="outline" className="text-green-400 border-green-400">RBAC ACTIVE</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Data Anonymization</span>
                  <Badge variant="outline" className="text-cyan-400 border-cyan-400">CONFIGURED</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Compliance Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <div className="text-4xl font-bold text-green-400 mb-2">
                    {securityMetrics.complianceScore}%
                  </div>
                  <Progress value={securityMetrics.complianceScore} className="w-full h-3" />
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">ISO 27001</span>
                    <CheckCircle className="h-4 w-4 text-green-400" />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">SOC 2 Type II</span>
                    <CheckCircle className="h-4 w-4 text-green-400" />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">GDPR</span>
                    <CheckCircle className="h-4 w-4 text-green-400" />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">HIPAA</span>
                    <AlertTriangle className="h-4 w-4 text-yellow-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="encryption">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Encryption Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white">Data at Rest</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
                      <div>
                        <p className="text-white font-medium">AES-256 Encryption</p>
                        <p className="text-sm text-slate-400">Database encryption</p>
                      </div>
                      <Badge variant="outline" className="text-green-400 border-green-400">ACTIVE</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
                      <div>
                        <p className="text-white font-medium">Key Rotation</p>
                        <p className="text-sm text-slate-400">Last: 2 hours ago</p>
                      </div>
                      <Badge variant="outline" className="text-green-400 border-green-400">AUTOMATED</Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white">Data in Transit</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
                      <div>
                        <p className="text-white font-medium">TLS 1.3</p>
                        <p className="text-sm text-slate-400">API communications</p>
                      </div>
                      <Badge variant="outline" className="text-green-400 border-green-400">ENFORCED</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
                      <div>
                        <p className="text-white font-medium">Certificate Pinning</p>
                        <p className="text-sm text-slate-400">Mobile connections</p>
                      </div>
                      <Badge variant="outline" className="text-green-400 border-green-400">ACTIVE</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Audit Trail</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {auditLogs.map((log) => (
                  <div key={log.id} className="flex items-start space-x-4 p-4 bg-slate-900 rounded-lg border border-slate-700">
                    <div className="mt-1">
                      {getResultIcon(log.result)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-white font-medium">{log.action}</h4>
                        <Badge variant="outline" className={getResultColor(log.result)}>
                          {log.result.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-300 mb-1">{log.details}</p>
                      <div className="flex items-center space-x-4 text-xs text-slate-400">
                        <span className="flex items-center space-x-1">
                          <Users className="h-3 w-3" />
                          <span>{log.user}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Globe className="h-3 w-3" />
                          <span>{log.ipAddress}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{new Date(log.timestamp).toLocaleString()}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Compliance Standards</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">ISO 27001:2013</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={100} className="w-20 h-2" />
                      <CheckCircle className="h-4 w-4 text-green-400" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">SOC 2 Type II</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={98} className="w-20 h-2" />
                      <CheckCircle className="h-4 w-4 text-green-400" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">GDPR</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={95} className="w-20 h-2" />
                      <CheckCircle className="h-4 w-4 text-green-400" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">NIST Framework</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={87} className="w-20 h-2" />
                      <AlertTriangle className="h-4 w-4 text-yellow-400" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Security Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start bg-blue-600 hover:bg-blue-700">
                  <Key className="h-4 w-4 mr-2" />
                  Rotate Encryption Keys
                </Button>
                <Button className="w-full justify-start bg-purple-600 hover:bg-purple-700">
                  <FileCheck className="h-4 w-4 mr-2" />
                  Generate Compliance Report
                </Button>
                <Button className="w-full justify-start bg-red-600 hover:bg-red-700">
                  <Shield className="h-4 w-4 mr-2" />
                  Emergency Security Lock
                </Button>
                <Button className="w-full justify-start bg-green-600 hover:bg-green-700">
                  <Activity className="h-4 w-4 mr-2" />
                  Security Health Check
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedSecurityFeatures;
