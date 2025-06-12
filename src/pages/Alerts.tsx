
import RealTimeAlertsCenter from "@/components/alerts/RealTimeAlertsCenter";
import ReportsManager from "@/components/reports/ReportsManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Alerts = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Real-Time Alerts Center</h1>
      </div>
      
      <Tabs defaultValue="alerts" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="alerts">Live Alerts</TabsTrigger>
          <TabsTrigger value="reports">Reports & Export</TabsTrigger>
        </TabsList>
        <TabsContent value="alerts" className="space-y-4">
          <RealTimeAlertsCenter />
        </TabsContent>
        <TabsContent value="reports" className="space-y-4">
          <ReportsManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Alerts;
