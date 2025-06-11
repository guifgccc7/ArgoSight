
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Heart, Ship, AlertCircle, Phone, MapPin } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MigrationDashboard = () => {
  const rescueOperations = [
    { id: "RO-001", status: "active", location: "35.2°N, 14.5°E", people: 127, vessel: "Ocean Viking", time: "2 hours ago" },
    { id: "RO-002", status: "completed", location: "36.8°N, 12.1°E", people: 89, vessel: "Sea Watch", time: "6 hours ago" },
    { id: "RO-003", status: "en-route", location: "34.9°N, 18.2°E", people: 156, vessel: "Aquarius", time: "30 minutes ago" },
  ];

  const rescueData = [
    { month: 'Jan', rescues: 45, people: 2340 },
    { month: 'Feb', rescues: 52, people: 2890 },
    { month: 'Mar', rescues: 38, people: 1950 },
    { month: 'Apr', rescues: 67, people: 3420 },
    { month: 'May', rescues: 89, people: 4560 },
    { month: 'Jun', rescues: 156, people: 7890 },
  ];

  const humanitarianStats = {
    totalRescued: 23456,
    activeMissions: 8,
    ngoVessels: 12,
    coastGuardUnits: 24,
    medicalEvacuations: 45
  };

  return (
    <div className="space-y-6">
      {/* Humanitarian Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 text-green-400 mx-auto mb-2" />
            <p className="text-sm text-slate-400">Total Rescued</p>
            <p className="text-2xl font-bold text-white">{humanitarianStats.totalRescued.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4 text-center">
            <Ship className="h-8 w-8 text-blue-400 mx-auto mb-2" />
            <p className="text-sm text-slate-400">Active Missions</p>
            <p className="text-2xl font-bold text-white">{humanitarianStats.activeMissions}</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4 text-center">
            <Heart className="h-8 w-8 text-red-400 mx-auto mb-2" />
            <p className="text-sm text-slate-400">NGO Vessels</p>
            <p className="text-2xl font-bold text-white">{humanitarianStats.ngoVessels}</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4 text-center">
            <AlertCircle className="h-8 w-8 text-cyan-400 mx-auto mb-2" />
            <p className="text-sm text-slate-400">Coast Guard</p>
            <p className="text-2xl font-bold text-white">{humanitarianStats.coastGuardUnits}</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4 text-center">
            <Phone className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
            <p className="text-sm text-slate-400">Medical Evacs</p>
            <p className="text-2xl font-bold text-white">{humanitarianStats.medicalEvacuations}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Rescue Operations */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Active Rescue Operations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {rescueOperations.map((operation) => (
                <div key={operation.id} className="p-4 bg-slate-900 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-white">{operation.id}</span>
                    <Badge 
                      variant="outline" 
                      className={`${
                        operation.status === 'active' ? 'text-green-400 border-green-400' : 
                        operation.status === 'completed' ? 'text-blue-400 border-blue-400' : 
                        'text-yellow-400 border-yellow-400'
                      }`}
                    >
                      {operation.status.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-300">Location:</span>
                      <span className="text-white">{operation.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">People:</span>
                      <span className="text-cyan-400">{operation.people}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Vessel:</span>
                      <span className="text-white">{operation.vessel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Time:</span>
                      <span className="text-slate-400">{operation.time}</span>
                    </div>
                  </div>
                  {operation.status === 'active' && (
                    <div className="mt-3 flex space-x-2">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        Monitor
                      </Button>
                      <Button size="sm" variant="outline">
                        Contact
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Rescue Trends Chart */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Rescue Operations Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={rescueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #374151',
                      borderRadius: '0.5rem'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="rescues" 
                    stroke="#06b6d4" 
                    strokeWidth={3}
                    name="Rescue Operations"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="people" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    name="People Rescued"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MigrationDashboard;
