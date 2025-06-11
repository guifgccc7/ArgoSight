
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Thermometer, Wind, CloudSnow } from "lucide-react";

const WeatherPanel = () => {
  const weatherData = [
    {
      location: "Barents Sea",
      temp: -12,
      wind: 22,
      conditions: "Light Snow",
      visibility: "8 km",
      status: "caution"
    },
    {
      location: "Kara Sea", 
      temp: -18,
      wind: 15,
      conditions: "Clear",
      visibility: "> 10 km",
      status: "good"
    },
    {
      location: "Laptev Sea",
      temp: -25,
      wind: 35,
      conditions: "Heavy Snow",
      visibility: "2 km", 
      status: "poor"
    },
    {
      location: "East Siberian Sea",
      temp: -20,
      wind: 28,
      conditions: "Moderate Snow",
      visibility: "5 km",
      status: "caution"
    }
  ];

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <CloudSnow className="h-5 w-5 mr-2 text-cyan-400" />
          Current Weather Conditions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {weatherData.map((weather, index) => (
            <div key={index} className="bg-slate-900 p-3 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-white font-medium">{weather.location}</h4>
                <Badge 
                  variant="outline" 
                  className={`${
                    weather.status === 'good' ? 'text-green-400 border-green-400' :
                    weather.status === 'caution' ? 'text-yellow-400 border-yellow-400' :
                    'text-red-400 border-red-400'
                  }`}
                >
                  {weather.status.toUpperCase()}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center text-slate-300">
                  <Thermometer className="h-3 w-3 mr-1 text-blue-400" />
                  {weather.temp}°C
                </div>
                <div className="flex items-center text-slate-300">
                  <Wind className="h-3 w-3 mr-1 text-cyan-400" />
                  {weather.wind} kt
                </div>
                <div className="text-slate-300 col-span-2">
                  {weather.conditions} • Visibility: {weather.visibility}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherPanel;
