
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { satelliteService } from '@/services/satelliteService';

interface SatelliteControlsProps {
  onSourceChange?: (source: string) => void;
  onDateChange?: (date: Date) => void;
  onResolutionChange?: (resolution: string) => void;
}

const SatelliteControls: React.FC<SatelliteControlsProps> = ({
  onSourceChange,
  onDateChange,
  onResolutionChange
}) => {
  const [selectedSource, setSelectedSource] = useState("planetscope");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedResolution, setSelectedResolution] = useState("3m");
  const [availableSatellites, setAvailableSatellites] = useState<string[]>([]);
  const [imageInfo, setImageInfo] = useState({
    captureTime: "14:32 UTC",
    cloudCover: "8%",
    qualityScore: "9.2/10",
    status: "COMPLETE"
  });

  useEffect(() => {
    // Load available satellites from the service
    satelliteService.getAvailableSatellites().then(satellites => {
      setAvailableSatellites(satellites);
    });

    // Simulate real-time image info updates
    const interval = setInterval(() => {
      setImageInfo({
        captureTime: new Date().toLocaleTimeString() + " UTC",
        cloudCover: (Math.random() * 20).toFixed(1) + "%",
        qualityScore: (8 + Math.random() * 2).toFixed(1) + "/10",
        status: Math.random() > 0.1 ? "COMPLETE" : "PROCESSING"
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleSourceChange = (value: string) => {
    setSelectedSource(value);
    onSourceChange?.(value);
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      onDateChange?.(date);
    }
  };

  const handleResolutionChange = (value: string) => {
    setSelectedResolution(value);
    onResolutionChange?.(value);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Image Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-slate-300 mb-2 block">Satellite Source</label>
              <Select value={selectedSource} onValueChange={handleSourceChange}>
                <SelectTrigger className="bg-slate-900 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-600">
                  <SelectItem value="planetscope">PlanetScope</SelectItem>
                  <SelectItem value="rapideye">RapidEye</SelectItem>
                  <SelectItem value="sentinel-2">Sentinel-2</SelectItem>
                  <SelectItem value="landsat-8">Landsat-8</SelectItem>
                  <SelectItem value="worldview-3">WorldView-3</SelectItem>
                  <SelectItem value="spot-7">SPOT-7</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm text-slate-300 mb-2 block">Image Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal bg-slate-900 border-slate-600 text-white hover:bg-slate-800"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(selectedDate, "PPP")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div>
              <label className="text-sm text-slate-300 mb-2 block">Resolution</label>
              <Select value={selectedResolution} onValueChange={handleResolutionChange}>
                <SelectTrigger className="bg-slate-900 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-600">
                  <SelectItem value="0.3m">0.3m (Ultra High)</SelectItem>
                  <SelectItem value="1m">1m (Very High)</SelectItem>
                  <SelectItem value="3m">3m (High)</SelectItem>
                  <SelectItem value="10m">10m (Medium)</SelectItem>
                  <SelectItem value="30m">30m (Standard)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Live Image Info</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-300">Capture Time:</span>
              <span className="text-white">{imageInfo.captureTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Cloud Cover:</span>
              <span className="text-green-400">{imageInfo.cloudCover}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Quality Score:</span>
              <span className="text-green-400">{imageInfo.qualityScore}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Processing:</span>
              <Badge 
                variant="outline" 
                className={`${imageInfo.status === 'COMPLETE' ? 'text-green-400 border-green-400' : 'text-yellow-400 border-yellow-400'}`}
              >
                {imageInfo.status}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SatelliteControls;
