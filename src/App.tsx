
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/context/theme-provider";
import Layout from "@/components/Layout";
import Index from "./pages/Index";
import DataFusion from "./pages/DataFusion";
import GhostFleet from "./pages/GhostFleet";
import SatelliteImagery from "./pages/SatelliteImagery";
import ArcticRoutes from "./pages/ArcticRoutes";
import ArcticCostSavings from "./pages/ArcticCostSavings";
import MediterraneanRoutes from "./pages/MediterraneanRoutes";
import ClimateIntel from "./pages/ClimateIntel";
import IntelligenceDB from "./pages/IntelligenceDB";
import IntegratedIntel from "./pages/IntegratedIntel";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="maritime-intel-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Index />} />
              <Route path="/data-fusion" element={<DataFusion />} />
              <Route path="/ghost-fleet" element={<GhostFleet />} />
              <Route path="/satellite-imagery" element={<SatelliteImagery />} />
              <Route path="/arctic-routes" element={<ArcticRoutes />} />
              <Route path="/arctic-cost-savings" element={<ArcticCostSavings />} />
              <Route path="/mediterranean-routes" element={<MediterraneanRoutes />} />
              <Route path="/climate-intel" element={<ClimateIntel />} />
              <Route path="/intelligence-db" element={<IntelligenceDB />} />
              <Route path="/integrated-intel" element={<IntegratedIntel />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
