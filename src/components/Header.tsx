
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Shield, User, LogOut, Settings, Menu } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const navigation = [
  { name: "Dashboard", href: "/", icon: Shield },
  { name: "Real-Time Ops", href: "/real-time-operations", icon: Settings },
  { name: "Ghost Fleet", href: "/ghost-fleet", icon: Shield },
  { name: "Satellite Imagery", href: "/satellite-imagery", icon: Settings },
  { name: "Arctic Routes", href: "/arctic-routes", icon: Shield },
  { name: "Integrated Intel", href: "/integrated-intel", icon: Settings },
];

const Header = () => {
  const { profile, logout, isAuthenticated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

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
    <header className="bg-slate-900 border-b border-slate-700 p-4 sticky top-0 z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="lg:hidden p-2">
                <Menu className="h-5 w-5 text-white" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 bg-slate-900 border-slate-700">
              <nav className="flex flex-col space-y-2 mt-8">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-cyan-600 text-white'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>
          
          <Shield className="h-8 w-8 text-cyan-400" />
          <div className="hidden sm:block">
            <h1 className="text-xl font-bold text-white">ArgoSight</h1>
            <p className="text-sm text-slate-400">Maritime Intelligence Platform</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="text-right hidden sm:block">
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
