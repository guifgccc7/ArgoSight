
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Cloud, Thermometer, Eye, Wind } from 'lucide-react';
import { weatherService, WeatherData } from '@/services/weatherService';

const WeatherDataTest: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<string | null>(null);

  const testLocations = [
    { name: 'North Sea', lat: 56.0, lng: 3.0 },
    { name: 'Mediterranean', lat: 36.0, lng: 15.0 },
    { name: 'Arctic Ocean', lat: 75.0, lng: 0.0 },
    { name: 'Atlantic Ocean', lat: 40.0, lng: -30.0 },
  ];

  const fetchWeatherData = async (lat: number, lng: number, locationName: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await weatherService.getCurrentWeather(lat, lng);
      setWeatherData(data);
      setLastFetch(`${locationName} - ${new Date().toLocaleTimeString()}`);
      console.log('Weather data received:', data);
    } catch (err: any) {
      setError(err.message);
      console.error('Weather fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Cloud className="h-5 w-5 mr-2 text-cyan-400" />
          Real Weather Data Test
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {testLocations.map((location) => (
              <Button
                key={location.name}
                onClick={() => fetchWeatherData(location.lat, location.lng, location.name)}
                disabled={loading}
                variant="outline"
                className="text-white border-slate-600 hover:bg-slate-700"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : location.name}
              </Button>
            ))}
          </div>

          {lastFetch && (
            <div className="text-xs text-slate-400">
              Last fetch: {lastFetch}
            </div>
          )}

          {error && (
            <div className="text-red-400 text-sm bg-red-900/20 p-2 rounded">
              Error: {error}
            </div>
          )}

          {weatherData && (
            <div className="space-y-3 bg-slate-900 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-medium">
                  {weatherData.name ? `${weatherData.name}${weatherData.sys?.country ? `, ${weatherData.sys.country}` : ''}` : 'Weather Data'}
                </h3>
                <Badge variant="outline" className="text-green-400 border-green-400">
                  LIVE DATA
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Thermometer className="h-4 w-4 text-orange-400" />
                  <span className="text-slate-300">Temperature:</span>
                  <span className="text-white font-medium">{weatherData.main.temp.toFixed(1)}°C</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Wind className="h-4 w-4 text-blue-400" />
                  <span className="text-slate-300">Wind:</span>
                  <span className="text-white font-medium">{weatherData.wind.speed.toFixed(1)} m/s</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Eye className="h-4 w-4 text-purple-400" />
                  <span className="text-slate-300">Visibility:</span>
                  <span className="text-white font-medium">{(weatherData.visibility / 1000).toFixed(1)} km</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Cloud className="h-4 w-4 text-gray-400" />
                  <span className="text-slate-300">Clouds:</span>
                  <span className="text-white font-medium">{weatherData.clouds.all}%</span>
                </div>
              </div>
              
              <div className="pt-2 border-t border-slate-700">
                <span className="text-slate-300 text-sm">Conditions: </span>
                <span className="text-white font-medium">{weatherData.weather[0].description}</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherDataTest;
