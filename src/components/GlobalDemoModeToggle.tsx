
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useDemoMode } from "./DemoModeProvider";

const GlobalDemoModeToggle: React.FC = () => {
  const { isDemoMode, toggleDemoMode } = useDemoMode();

  return (
    <div className="flex items-center space-x-3">
      <div className="flex items-center space-x-2">
        <span className="text-xs text-slate-400 font-mono">Live Data</span>
        <Switch
          checked={isDemoMode}
          onCheckedChange={toggleDemoMode}
          aria-label="Toggle between live and simulated data"
          className="bg-slate-800"
        />
        <span className="text-xs text-slate-400 font-mono">Simulated</span>
      </div>
      <div className={`w-2 h-2 rounded-full ${isDemoMode ? "bg-yellow-400 animate-pulse" : "bg-green-400 animate-pulse"}`} />
      <Badge variant="outline" className={isDemoMode ? "text-yellow-400 border-yellow-400" : "text-green-400 border-green-400"}>
        {isDemoMode ? "SIMULATION MODE" : "LIVE DATA"}
      </Badge>
    </div>
  );
};

export default GlobalDemoModeToggle;
