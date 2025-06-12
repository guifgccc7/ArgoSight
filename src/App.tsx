import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient } from "react-query";
import { AuthProvider } from "./hooks/useAuth";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import RealTimeOperations from "./pages/RealTimeOperations";
import DataFusion from "./pages/DataFusion";
import GhostFleet from "./pages/GhostFleet";
import Alerts from "./pages/Alerts";
import SatelliteImagery from "./pages/SatelliteImagery";
import ArcticRoutes from "./pages/ArcticRoutes";
import ArcticCostSavings from "./pages/ArcticCostSavings";
import MediterraneanRoutes from "./pages/MediterraneanRoutes";
import ClimateIntel from "./pages/ClimateIntel";
import IntelligenceDB from "./pages/IntelligenceDB";
import IntegratedIntel from "./pages/IntegratedIntel";
import AdvancedAnalytics from "./pages/AdvancedAnalytics";
import ProductionAdmin from "./pages/ProductionAdmin";

function App() {
  return (
    <QueryClient>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route path="/" element={<Index />} />
              <Route path="/real-time-operations" element={<RealTimeOperations />} />
              <Route path="/data-fusion" element={<DataFusion />} />
              <Route path="/ghost-fleet" element={<GhostFleet />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/satellite-imagery" element={<SatelliteImagery />} />
              <Route path="/arctic-routes" element={<ArcticRoutes />} />
              <Route path="/arctic-cost-savings" element={<ArcticCostSavings />} />
              <Route path="/mediterranean-routes" element={<MediterraneanRoutes />} />
              <Route path="/climate-intel" element={<ClimateIntel />} />
              <Route path="/intelligence-db" element={<IntelligenceDB />} />
              <Route path="/integrated-intel" element={<IntegratedIntel />} />
              <Route path="/advanced-analytics" element={<AdvancedAnalytics />} />
              <Route path="/production-admin" element={<ProductionAdmin />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClient>
  );
}

export default App;
