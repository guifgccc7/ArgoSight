
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CloudRain, 
  Wind, 
  Thermometer, 
  Eye, 
  RefreshCw,
  MapPin,
  Calendar
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface WeatherData {
  latitude: number;
  longitude: number;
  timestamp_utc: string;
  temperature_celsius: number | null;
  wind_speed_knots: number | null;
  wind_direction_degrees: number | null;
  visibility_km: number | null;
  weather_conditions: string | null;
  barometric_pressure: number | null;
  api_metadata?: {
    fetched_at: string;
    coordinates: { lat: number; lng: number };
    api_provider: string;
    status: string;
  };
}

const WeatherImageDisplay: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<WeatherData | null>(null);

  const testLocations = [
    { lat: 51.5074, lng: -0.1278, name: 'London, UK' },
    { lat: 40.7128, lng: -74.0060, name: 'New York, USA' },
    { lat: 35.6762, lng: 139.6503, name: 'Tokyo, Japan' },
    { lat: -33.8688, lng: 151.2093, name: 'Sydney, Australia' }
  ];

  const fetchWeatherData = async (lat: number, lng: number) => {
    try {
      const { data, error } = await supabase.functions.invoke('weather-data', {
        body: { lat, lng }
      });

      if (error) {
        console.error('Weather fetch error:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Weather fetch error:', error);
      return null;
    }
  };

  const handleFetchAllWeather = async () => {
    setIsLoading(true);
    const weatherResults = [];

    for (const location of testLocations) {
      console.log(`🌤️ Fetching weather for ${location.name}...`);
      const data = await fetchWeatherData(location.lat, location.lng);
      if (data) {
        weatherResults.push({
          ...data,
          locationName: location.name
        });
      }
      // Small delay to avoid overwhelming the API
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setWeatherData(weatherResults);
    setIsLoading(false);
    toast.success(`Fetched weather data for ${weatherResults.length} locations`);
  };

  const formatTemperature = (temp: number | null) => {
    if (temp === null) return 'N/A';
    return `${temp.toFixed(1)}°C`;
  };

  const formatWindSpeed = (speed: number | null) => {
    if (speed === null) return 'N/A';
    return `${speed.toFixed(1)} knots`;
  };

  const formatPressure = (pressure: number | null) => {
    if (pressure === null) return 'N/A';
    return `${pressure} hPa`;
  };

  const getWindDirection = (degrees: number | null) => {
    if (degrees === null) return 'N/A';
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return `${directions[index]} (${degrees.toFixed(0)}°)`;
  };

  const getTemperatureColor = (temp: number | null) => {
    if (temp === null) return 'text-slate-400';
    if (temp < 0) return 'text-blue-400';
    if (temp < 10) return 'text-cyan-400';
    if (temp < 20) return 'text-green-400';
    if (temp < 30) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CloudRain className="h-5 w-5 text-cyan-400" />
              <span>Live Weather Data</span>
            </div>
            <Button
              onClick={handleFetchAllWeather}
              disabled={isLoading}
              className="bg-cyan-600 hover:bg-cyan-700"
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Fetch Weather Data
            </Button>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Weather Cards Grid */}
      {weatherData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {weatherData.map((weather, index) => (
            <Card key={index} className="bg-slate-800 border-slate-700 hover:border-cyan-500 transition-colors cursor-pointer">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-white flex items-center justify-between">
                  <span>{(weather as any).locationName}</span>
                  <Badge variant="outline" className="text-xs">
                    Live
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Temperature */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Thermometer className="h-4 w-4 text-slate-400" />
                    <span className="text-sm text-slate-300">Temperature</span>
                  </div>
                  <span className={`text-sm font-semibold ${getTemperatureColor(weather.temperature_celsius)}`}>
                    {formatTemperature(weather.temperature_celsius)}
                  </span>
                </div>

                {/* Wind */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Wind className="h-4 w-4 text-slate-400" />
                    <span className="text-sm text-slate-300">Wind</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-cyan-400">
                      {formatWindSpeed(weather.wind_speed_knots)}
                    </div>
                    <div className="text-xs text-slate-400">
                      {getWindDirection(weather.wind_direction_degrees)}
                    </div>
                  </div>
                </div>

                {/* Visibility */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Eye className="h-4 w-4 text-slate-400" />
                    <span className="text-sm text-slate-300">Visibility</span>
                  </div>
                  <span className="text-sm font-semibold text-green-400">
                    {weather.visibility_km ? `${weather.visibility_km} km` : 'N/A'}
                  </span>
                </div>

                {/* Conditions */}
                {weather.weather_conditions && (
                  <div className="pt-2 border-t border-slate-700">
                    <p className="text-xs text-slate-300 capitalize">
                      {weather.weather_conditions}
                    </p>
                  </div>
                )}

                {/* Coordinates */}
                <div className="pt-2 border-t border-slate-700">
                  <div className="flex items-center space-x-1 text-xs text-slate-400">
                    <MapPin className="h-3 w-3" />
                    <span>{weather.latitude.toFixed(3)}, {weather.longitude.toFixed(3)}</span>
                  </div>
                </div>

                {/* Timestamp */}
                {weather.api_metadata?.fetched_at && (
                  <div className="flex items-center space-x-1 text-xs text-slate-400">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(weather.api_metadata.fetched_at).toLocaleTimeString()}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="bg-slate-800 border-slate-700 animate-pulse">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-700 rounded w-1/2"></div>
                  <div className="h-3 bg-slate-700 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {weatherData.length === 0 && !isLoading && (
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-8 text-center">
            <CloudRain className="h-12 w-12 mx-auto mb-4 text-slate-400" />
            <h3 className="text-lg font-semibold text-white mb-2">No Weather Data</h3>
            <p className="text-slate-400 mb-4">Click "Fetch Weather Data" to get live weather information for multiple locations.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WeatherImageDisplay;
