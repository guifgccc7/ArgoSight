
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  CloudRain, 
  Wind, 
  Waves, 
  Thermometer,
  Eye,
  Compass
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const WeatherForecastPanel = () => {
  const forecast7Days = [
    { day: "Mon", temp: 18, wind: 25, waves: 2.1, rain: 10 },
    { day: "Tue", temp: 16, wind: 30, waves: 2.8, rain: 45 },
    { day: "Wed", temp: 14, wind: 35, waves: 3.2, rain: 80 },
    { day: "Thu", temp: 15, wind: 28, waves: 2.5, rain: 25 },
    { day: "Fri", temp: 17, wind: 22, waves: 1.8, rain: 5 },
    { day: "Sat", temp: 19, wind: 20, waves: 1.5, rain: 0 },
    { day: "Sun", temp: 21, wind: 18, waves: 1.2, rain: 0 }
  ];

  const currentConditions = {
    temperature: "18°C",
    windSpeed: "25 km/h",
    windDirection: "NW",
    waveHeight: "2.1m",
    visibility: "15 km",
    precipitation: "10%"
  };

  const marineAlerts = [
    {
      type: "Small Craft Advisory",
      severity: "moderate",
      validUntil: "18:00 UTC",
      description: "Winds 25-35 km/h expected"
    },
    {
      type: "Gale Warning",
      severity: "high",
      validUntil: "Tomorrow 06:00",
      description: "Storm system approaching from west"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Current Conditions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Thermometer className="h-4 w-4 text-red-400" />
                <div>
                  <p className="text-xs text-slate-400">Temperature</p>
                  <p className="text-sm font-medium text-white">{currentConditions.temperature}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Wind className="h-4 w-4 text-blue-400" />
                <div>
                  <p className="text-xs text-slate-400">Wind</p>
                  <p className="text-sm font-medium text-white">
                    {currentConditions.windSpeed} {currentConditions.windDirection}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Waves className="h-4 w-4 text-cyan-400" />
                <div>
                  <p className="text-xs text-slate-400">Wave Height</p>
                  <p className="text-sm font-medium text-white">{currentConditions.waveHeight}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Eye className="h-4 w-4 text-green-400" />
                <div>
                  <p className="text-xs text-slate-400">Visibility</p>
                  <p className="text-sm font-medium text-white">{currentConditions.visibility}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-white">Marine Weather Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {marineAlerts.map((alert, index) => (
                <div key={index} className="p-3 bg-slate-900 rounded-lg border-l-4 border-yellow-400">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-white">{alert.type}</h4>
                    <Badge variant="outline" className={
                      alert.severity === "high" 
                        ? "text-red-400 border-red-400" 
                        : "text-yellow-400 border-yellow-400"
                    }>
                      {alert.severity.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-400 mb-1">Valid until: {alert.validUntil}</p>
                  <p className="text-sm text-slate-300">{alert.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">7-Day Marine Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="temperature" className="space-y-4">
            <TabsList className="bg-slate-700">
              <TabsTrigger value="temperature">Temperature</TabsTrigger>
              <TabsTrigger value="wind">Wind Speed</TabsTrigger>
              <TabsTrigger value="waves">Wave Height</TabsTrigger>
              <TabsTrigger value="rain">Precipitation</TabsTrigger>
            </TabsList>
            
            <TabsContent value="temperature">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={forecast7Days}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="day" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#F9FAFB'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="temp" 
                      stroke="#EF4444" 
                      strokeWidth={2}
                      dot={{ fill: '#EF4444', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            <TabsContent value="wind">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={forecast7Days}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="day" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#F9FAFB'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="wind" 
                      stroke="#3B82F6" 
                      strokeWidth={2}
                      dot={{ fill: '#3B82F6', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            <TabsContent value="waves">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={forecast7Days}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="day" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#F9FAFB'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="waves" 
                      stroke="#06B6D4" 
                      strokeWidth={2}
                      dot={{ fill: '#06B6D4', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            <TabsContent value="rain">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={forecast7Days}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="day" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#F9FAFB'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="rain" 
                      stroke="#10B981" 
                      strokeWidth={2}
                      dot={{ fill: '#10B981', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default WeatherForecastPanel;
