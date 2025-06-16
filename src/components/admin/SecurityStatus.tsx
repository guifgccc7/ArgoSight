
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, CheckCircle } from 'lucide-react';

export const SecurityStatus: React.FC = () => {
  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Shield className="h-5 w-5 mr-2" />
          Security Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 bg-slate-900 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">SSL/TLS Encryption</span>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
          </div>
          <div className="p-3 bg-slate-900 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Row Level Security</span>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
          </div>
          <div className="p-3 bg-slate-900 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">API Authentication</span>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
          </div>
          <div className="p-3 bg-slate-900 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Data Encryption</span>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
