
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Shield, User, LogOut, Settings } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Header = () => {
  const { profile, logout, isAuthenticated } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'text-red-400';
      case 'analyst': return 'text-cyan-400';
      case 'operator': return 'text-green-400';
      default: return 'text-slate-400';
    }
  };

  const getClearanceColor = (clearance: string) => {
    switch (clearance) {
      case 'top-secret': return 'bg-red-600';
      case 'secret': return 'bg-yellow-600';
      case 'confidential': return 'bg-blue-600';
      default: return 'bg-slate-600';
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <header className="bg-slate-900 border-b border-slate-700 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Shield className="h-8 w-8 text-cyan-400" />
          <div>
            <h1 className="text-xl font-bold text-white">ArgoSight</h1>
            <p className="text-sm text-slate-400">Maritime Intelligence Platform</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-sm text-white font-medium">
              {profile?.full_name || 'User'}
            </div>
            <div className="flex items-center space-x-2">
              <span className={`text-xs ${getRoleColor(profile?.role || 'user')}`}>
                {profile?.role?.toUpperCase() || 'USER'}
              </span>
              <span className={`px-2 py-1 rounded text-xs text-white ${getClearanceColor(profile?.clearance_level || 'standard')}`}>
                {profile?.clearance_level?.toUpperCase() || 'STANDARD'}
              </span>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-slate-700 text-white">
                    {getInitials(profile?.full_name)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-slate-800 border-slate-700" align="end">
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium text-white">{profile?.full_name || 'User'}</p>
                  <p className="text-xs text-slate-400">{profile?.email}</p>
                  {profile?.organization && (
                    <p className="text-xs text-slate-400">{profile.organization}</p>
                  )}
                </div>
              </div>
              <DropdownMenuSeparator className="bg-slate-700" />
              <DropdownMenuItem className="text-slate-300 hover:bg-slate-700">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-slate-300 hover:bg-slate-700">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-700" />
              <DropdownMenuItem 
                className="text-red-400 hover:bg-slate-700"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
