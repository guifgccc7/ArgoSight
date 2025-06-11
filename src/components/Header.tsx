
import { useState } from "react";
import { Bell, Search, User, Settings, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const Header = () => {
  const [alertCount] = useState(3);

  return (
    <header className="h-16 bg-slate-900 border-b border-slate-700 px-6 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Globe className="h-8 w-8 text-cyan-400" />
          <h1 className="text-xl font-bold text-white">Maritime Intel</h1>
        </div>
        <Badge variant="outline" className="text-cyan-400 border-cyan-400">
          CLASSIFIED
        </Badge>
      </div>

      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input
            placeholder="Search intelligence, vessels, routes..."
            className="pl-10 bg-slate-800 border-slate-600 text-white placeholder-slate-400"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5 text-slate-300" />
          {alertCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs flex items-center justify-center">
              {alertCount}
            </Badge>
          )}
        </Button>
        <Button variant="ghost" size="sm">
          <Settings className="h-5 w-5 text-slate-300" />
        </Button>
        <Button variant="ghost" size="sm">
          <User className="h-5 w-5 text-slate-300" />
        </Button>
      </div>
    </header>
  );
};

export default Header;
