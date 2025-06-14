
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Database,
  Ship,
  Satellite,
  Snowflake,
  DollarSign,
  Waves,
  CloudSnow,
  Search,
  Brain,
  AlertTriangle,
  Activity,
  BarChart3,
  Settings,
  Zap
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Real-Time Ops", href: "/real-time-operations", icon: Activity },
  { name: "Enhanced Real-Time", href: "/enhanced-realtime", icon: Zap },
  { name: "Data Fusion", href: "/data-fusion", icon: Database },
  { name: "Ghost Fleet", href: "/ghost-fleet", icon: Ship },
  { name: "Alerts", href: "/alerts", icon: AlertTriangle },
  { name: "Satellite Imagery", href: "/satellite-imagery", icon: Satellite },
  { name: "Arctic Routes", href: "/arctic-routes", icon: Snowflake },
  { name: "Cost Savings", href: "/arctic-cost-savings", icon: DollarSign },
  { name: "Mediterranean", href: "/mediterranean-routes", icon: Waves },
  { name: "Climate Intel", href: "/climate-intel", icon: CloudSnow },
  { name: "Intelligence DB", href: "/intelligence-db", icon: Search },
  { name: "Integrated Intel", href: "/integrated-intel", icon: Brain },
  { name: "Advanced Analytics", href: "/advanced-analytics", icon: BarChart3 },
  { name: "Production Admin", href: "/production-admin", icon: Settings },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-slate-900 border-r border-slate-700 overflow-y-auto">
      <nav className="p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-cyan-600 text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
