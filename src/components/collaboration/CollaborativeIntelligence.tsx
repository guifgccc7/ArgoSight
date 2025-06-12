
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Users, 
  Share2, 
  Shield, 
  Bell,
  MessageSquare,
  FileText,
  AlertTriangle,
  Globe,
  Lock,
  UserCheck
} from "lucide-react";

interface Organization {
  id: string;
  name: string;
  type: 'government' | 'port_authority' | 'shipping' | 'intelligence';
  country: string;
  users: number;
  sharedFeeds: number;
  trustLevel: 'high' | 'medium' | 'low';
}

interface SharedIntelligence {
  id: string;
  title: string;
  organization: string;
  type: 'threat' | 'vessel_update' | 'port_alert' | 'weather_warning';
  severity: 'critical' | 'high' | 'medium' | 'low';
  timestamp: string;
  shared_with: string[];
  classification: 'public' | 'restricted' | 'confidential';
}

interface ActiveUser {
  id: string;
  name: string;
  organization: string;
  role: string;
  status: 'online' | 'away' | 'offline';
  lastSeen: string;
}

const CollaborativeIntelligence: React.FC = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [sharedIntel, setSharedIntel] = useState<SharedIntelligence[]>([]);
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);
  const [selectedTab, setSelectedTab] = useState('organizations');

  useEffect(() => {
    // Initialize collaborative data
    const initOrganizations: Organization[] = [
      {
        id: 'sma',
        name: 'Swedish Maritime Administration',
        type: 'government',
        country: 'Sweden',
        users: 45,
        sharedFeeds: 12,
        trustLevel: 'high'
      },
      {
        id: 'fma',
        name: 'Finnish Maritime Administration',
        type: 'government',
        country: 'Finland',
        users: 32,
        sharedFeeds: 8,
        trustLevel: 'high'
      },
      {
        id: 'port-stockholm',
        name: 'Port of Stockholm',
        type: 'port_authority',
        country: 'Sweden',
        users: 18,
        sharedFeeds: 5,
        trustLevel: 'high'
      },
      {
        id: 'maersk',
        name: 'Maersk Line',
        type: 'shipping',
        country: 'Denmark',
        users: 67,
        sharedFeeds: 3,
        trustLevel: 'medium'
      },
      {
        id: 'emsa',
        name: 'European Maritime Safety Agency',
        type: 'intelligence',
        country: 'EU',
        users: 124,
        sharedFeeds: 25,
        trustLevel: 'high'
      }
    ];

    const initSharedIntel: SharedIntelligence[] = [
      {
        id: 'si-001',
        title: 'Suspicious vessel activity in Gotland Basin',
        organization: 'Swedish Maritime Administration',
        type: 'threat',
        severity: 'high',
        timestamp: '2024-01-15T09:30:00Z',
        shared_with: ['Finnish Maritime Administration', 'EMSA'],
        classification: 'restricted'
      },
      {
        id: 'si-002',
        title: 'Port congestion alert - Helsinki',
        organization: 'Finnish Maritime Administration',
        type: 'port_alert',
        severity: 'medium',
        timestamp: '2024-01-15T10:15:00Z',
        shared_with: ['Port of Stockholm', 'Maersk Line'],
        classification: 'public'
      },
      {
        id: 'si-003',
        title: 'Storm warning - Baltic Sea',
        organization: 'EMSA',
        type: 'weather_warning',
        severity: 'critical',
        timestamp: '2024-01-15T08:45:00Z',
        shared_with: ['All Organizations'],
        classification: 'public'
      }
    ];

    const initActiveUsers: ActiveUser[] = [
      {
        id: 'u-001',
        name: 'Anna Lindgren',
        organization: 'Swedish Maritime Administration',
        role: 'Maritime Analyst',
        status: 'online',
        lastSeen: '2024-01-15T10:45:00Z'
      },
      {
        id: 'u-002',
        name: 'Mikael Virtanen',
        organization: 'Finnish Maritime Administration',
        role: 'Port Security Officer',
        status: 'online',
        lastSeen: '2024-01-15T10:42:00Z'
      },
      {
        id: 'u-003',
        name: 'Lars Nielsen',
        organization: 'EMSA',
        role: 'Intelligence Coordinator',
        status: 'away',
        lastSeen: '2024-01-15T10:20:00Z'
      }
    ];

    setOrganizations(initOrganizations);
    setSharedIntel(initSharedIntel);
    setActiveUsers(initActiveUsers);
  }, []);

  const getTrustLevelColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-green-400 border-green-400';
      case 'medium': return 'text-yellow-400 border-yellow-400';
      case 'low': return 'text-red-400 border-red-400';
      default: return 'text-slate-400 border-slate-400';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400 border-red-400';
      case 'high': return 'text-orange-400 border-orange-400';
      case 'medium': return 'text-yellow-400 border-yellow-400';
      case 'low': return 'text-blue-400 border-blue-400';
      default: return 'text-slate-400 border-slate-400';
    }
  };

  const getClassificationIcon = (classification: string) => {
    switch (classification) {
      case 'confidential': return Lock;
      case 'restricted': return Shield;
      case 'public': return Globe;
      default: return FileText;
    }
  };

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <span className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-cyan-400" />
            <span>Collaborative Intelligence Platform</span>
          </span>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-cyan-400 border-cyan-400">
              {organizations.length} PARTNERS
            </Badge>
            <Badge variant="outline" className="text-green-400 border-green-400">
              {activeUsers.filter(u => u.status === 'online').length} ONLINE
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="organizations">
              <Users className="h-4 w-4 mr-1" />
              Partners
            </TabsTrigger>
            <TabsTrigger value="intelligence">
              <Share2 className="h-4 w-4 mr-1" />
              Shared Intel
            </TabsTrigger>
            <TabsTrigger value="users">
              <UserCheck className="h-4 w-4 mr-1" />
              Active Users
            </TabsTrigger>
            <TabsTrigger value="access">
              <Shield className="h-4 w-4 mr-1" />
              Access Control
            </TabsTrigger>
          </TabsList>

          <TabsContent value="organizations" className="space-y-4">
            <div className="space-y-3">
              {organizations.map(org => (
                <div key={org.id} className="bg-slate-900 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="text-white font-medium">{org.name}</h4>
                      <p className="text-sm text-slate-400">{org.country} • {org.type.replace('_', ' ')}</p>
                    </div>
                    <Badge variant="outline" className={getTrustLevelColor(org.trustLevel)}>
                      {org.trustLevel.toUpperCase()} TRUST
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-slate-400">Active Users</span>
                      <div className="text-white font-medium">{org.users}</div>
                    </div>
                    <div>
                      <span className="text-slate-400">Shared Feeds</span>
                      <div className="text-white font-medium">{org.sharedFeeds}</div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="text-xs">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        Contact
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs">
                        <Share2 className="h-3 w-3 mr-1" />
                        Share
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="intelligence" className="space-y-4">
            <ScrollArea className="h-96">
              <div className="space-y-3">
                {sharedIntel.map(intel => {
                  const ClassificationIcon = getClassificationIcon(intel.classification);
                  return (
                    <div key={intel.id} className="bg-slate-900 p-4 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <ClassificationIcon className="h-4 w-4 text-slate-400" />
                            <h4 className="text-white font-medium">{intel.title}</h4>
                          </div>
                          <p className="text-sm text-slate-400">{intel.organization}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className={getSeverityColor(intel.severity)}>
                            {intel.severity.toUpperCase()}
                          </Badge>
                          <Badge variant="outline" className="text-slate-400 border-slate-400">
                            {intel.classification.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">
                            Shared with: {intel.shared_with.join(', ')}
                          </span>
                          <span className="text-slate-400">
                            {new Date(intel.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <div className="space-y-3">
              {activeUsers.map(user => (
                <div key={user.id} className="bg-slate-900 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-slate-700">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="text-white font-medium">{user.name}</h4>
                        <p className="text-sm text-slate-400">{user.role}</p>
                        <p className="text-xs text-slate-500">{user.organization}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant="outline" 
                        className={`${
                          user.status === 'online' ? 'text-green-400 border-green-400' :
                          user.status === 'away' ? 'text-yellow-400 border-yellow-400' :
                          'text-slate-400 border-slate-400'
                        }`}
                      >
                        {user.status.toUpperCase()}
                      </Badge>
                      <Button variant="outline" size="sm" className="text-xs">
                        <MessageSquare className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="access" className="space-y-4">
            <div className="bg-slate-900 p-4 rounded-lg">
              <h4 className="text-white font-medium mb-4">Role-Based Access Control</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-800 rounded">
                  <div>
                    <span className="text-white font-medium">Intelligence Analyst</span>
                    <p className="text-sm text-slate-400">Read/Write access to threat intelligence</p>
                  </div>
                  <Badge variant="outline" className="text-green-400 border-green-400">
                    FULL ACCESS
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-800 rounded">
                  <div>
                    <span className="text-white font-medium">Port Security Officer</span>
                    <p className="text-sm text-slate-400">Read access to port-related intelligence</p>
                  </div>
                  <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                    READ ONLY
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-800 rounded">
                  <div>
                    <span className="text-white font-medium">External Partner</span>
                    <p className="text-sm text-slate-400">Limited access to public intelligence</p>
                  </div>
                  <Badge variant="outline" className="text-blue-400 border-blue-400">
                    RESTRICTED
                  </Badge>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CollaborativeIntelligence;
