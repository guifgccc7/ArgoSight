
import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface AuthErrorHandlerProps {
  error: string | null;
  onClearError: () => void;
}

const AuthErrorHandler: React.FC<AuthErrorHandlerProps> = ({ error, onClearError }) => {
  if (!error) return null;

  return (
    <Alert className="border-red-500 bg-red-500/10">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription className="text-red-400 flex justify-between items-center">
        <span>{error}</span>
        <button 
          onClick={onClearError}
          className="text-red-400 hover:text-red-300 ml-2"
        >
          ×
        </button>
      </AlertDescription>
    </Alert>
  );
};

export default AuthErrorHandler;
