
import EnhancedRealTimeDashboard from "@/components/realtime/EnhancedRealTimeDashboard";
import WeatherDataTest from "@/components/weather/WeatherDataTest";

const EnhancedRealTime = () => {
  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <WeatherDataTest />
      <EnhancedRealTimeDashboard />
    </div>
  );
};

export default EnhancedRealTime;
