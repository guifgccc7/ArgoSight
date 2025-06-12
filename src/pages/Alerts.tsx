
import RealTimeAlertsCenter from "@/components/alerts/RealTimeAlertsCenter";

const Alerts = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Real-Time Alerts Center</h1>
      </div>
      <RealTimeAlertsCenter />
    </div>
  );
};

export default Alerts;
