
import React from "react";
import ProductionDashboard from "@/components/admin/ProductionDashboard";
import ApiStatusPanel from "@/components/ApiStatusPanel";
import WeatherImageDisplay from "@/components/WeatherImageDisplay";

const ProductionAdmin = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Production Administration</h1>
        <p className="text-slate-400 mt-2">
          System administration, API monitoring, and production data management
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Dashboard */}
        <div className="xl:col-span-2">
          <ProductionDashboard />
        </div>

        {/* API Status Sidebar */}
        <div>
          <ApiStatusPanel />
        </div>
      </div>

      {/* Weather Data Display */}
      <WeatherImageDisplay />
    </div>
  );
};

export default ProductionAdmin;
