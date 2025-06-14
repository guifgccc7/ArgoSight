
import React from "react";
import { Switch } from "@/components/ui/switch";

interface DemoModeToggleProps {
  isDemoMode: boolean;
  onChange: (isDemo: boolean) => void;
}

const DemoModeToggle: React.FC<DemoModeToggleProps> = ({ isDemoMode, onChange }) => (
  <div className="flex items-center space-x-2">
    <span className="text-xs text-slate-400 font-mono">Simulated Data</span>
    <Switch
      checked={isDemoMode}
      onCheckedChange={onChange}
      aria-label="Toggle between simulated and live data"
      className="bg-slate-800"
    />
    <span className="text-xs text-slate-400 font-mono">Live Data</span>
  </div>
);

export default DemoModeToggle;
