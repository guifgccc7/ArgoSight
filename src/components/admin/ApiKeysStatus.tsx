
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Key, CheckCircle, AlertTriangle } from 'lucide-react';

interface ApiKey {
  name: string;
  description: string;
  url: string;
  required: boolean;
}

interface ApiKeysStatusProps {
  configuredSecrets: string[];
  requiredKeys: ApiKey[];
}

export const ApiKeysStatus: React.FC<ApiKeysStatusProps> = ({ 
  configuredSecrets, 
  requiredKeys 
}) => {
  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Key className="h-5 w-5 mr-2" />
          API Keys Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-slate-400 mb-4">
          Current status of API keys configured in Supabase Edge Function secrets:
        </div>
        {requiredKeys.map((key) => (
          <div key={key.name} className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
            <div>
              <div className="text-white font-medium">{key.name}</div>
              <div className="text-xs text-slate-400">{key.description}</div>
            </div>
            <div className="flex items-center space-x-2">
              {configuredSecrets.includes(key.name) ? (
                <Badge variant="outline" className="text-green-400 border-green-400">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Configured
                </Badge>
              ) : (
                <Badge variant="outline" className={key.required ? "text-red-400 border-red-400" : "text-yellow-400 border-yellow-400"}>
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  {key.required ? 'Missing' : 'Optional'}
                </Badge>
              )}
              <Button size="sm" variant="outline" onClick={() => window.open(key.url, '_blank')}>
                Get Key
              </Button>
            </div>
          </div>
        ))}
        
        {configuredSecrets.length > 0 && (
          <div className="mt-4 p-3 bg-green-900/20 border border-green-700 rounded-lg">
            <div className="text-green-400 text-sm font-medium">✓ Working APIs</div>
            <div className="text-xs text-slate-300 mt-1">
              The following APIs are properly configured and working: {configuredSecrets.join(', ')}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
