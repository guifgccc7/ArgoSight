
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Calendar, 
  Cloud, 
  MapPin, 
  Satellite,
  RefreshCw,
  Download,
  Filter
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import SatelliteImageViewer from './SatelliteImageViewer';

const EnhancedSatelliteControls: React.FC = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [satelliteImages, setSatelliteImages] = useState<any[]>([]);
  const [searchParams, setSearchParams] = useState({
    north: 52.0,
    south: 50.0,
    east: 2.0,
    west: -1.0,
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    cloudCover: 30
  });

  const handleSearch = async () => {
    setIsSearching(true);
    try {
      console.log('🛰️ Searching for satellite images with params:', searchParams);
      
      const bbox = {
        coordinates: [[[
          searchParams.west, 
          searchParams.south
        ], [
          searchParams.east, 
          searchParams.south
        ], [
          searchParams.east, 
          searchParams.north
        ], [
          searchParams.west, 
          searchParams.north
        ], [
          searchParams.west, 
          searchParams.south
        ]]]
      };

      const { data, error } = await supabase.functions.invoke('satellite-data', {
        body: {
          bbox,
          startDate: searchParams.startDate,
          endDate: searchParams.endDate,
          cloudCover: searchParams.cloudCover / 100
        }
      });

      if (error) {
        console.error('Satellite search error:', error);
        toast.error(`Search failed: ${error.message}`);
        return;
      }

      console.log('🛰️ Satellite search results:', data);
      setSatelliteImages(data.images || []);
      
      toast.success(`Found ${data.images?.length || 0} satellite images`);
    } catch (error: any) {
      console.error('Satellite search error:', error);
      toast.error(`Search failed: ${error.message}`);
    } finally {
      setIsSearching(false);
    }
  };

  const handlePresetArea = (preset: string) => {
    switch (preset) {
      case 'english-channel':
        setSearchParams(prev => ({
          ...prev,
          north: 51.5,
          south: 49.5,
          east: 2.0,
          west: -2.0
        }));
        break;
      case 'mediterranean':
        setSearchParams(prev => ({
          ...prev,
          north: 45.0,
          south: 30.0,
          east: 40.0,
          west: -5.0
        }));
        break;
      case 'north-sea':
        setSearchParams(prev => ({
          ...prev,
          north: 62.0,
          south: 51.0,
          east: 10.0,
          west: -4.0
        }));
        break;
      case 'arctic':
        setSearchParams(prev => ({
          ...prev,
          north: 85.0,
          south: 66.0,
          east: 180.0,
          west: -180.0
        }));
        break;
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Controls */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Satellite className="h-5 w-5 text-cyan-400" />
            <span>Satellite Image Search</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Preset Areas */}
          <div>
            <Label className="text-slate-300 mb-2 block">Quick Areas</Label>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'english-channel', label: 'English Channel' },
                { id: 'mediterranean', label: 'Mediterranean' },
                { id: 'north-sea', label: 'North Sea' },
                { id: 'arctic', label: 'Arctic' }
              ].map((preset) => (
                <Button
                  key={preset.id}
                  variant="outline"
                  size="sm"
                  onClick={() => handlePresetArea(preset.id)}
                  className="border-slate-600 hover:border-cyan-500"
                >
                  <MapPin className="h-4 w-4 mr-1" />
                  {preset.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Bounding Box */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="north" className="text-slate-300">North Lat</Label>
              <Input
                id="north"
                type="number"
                step="0.1"
                value={searchParams.north}
                onChange={(e) => setSearchParams(prev => ({ ...prev, north: parseFloat(e.target.value) }))}
                className="bg-slate-900 border-slate-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="south" className="text-slate-300">South Lat</Label>
              <Input
                id="south"
                type="number"
                step="0.1"
                value={searchParams.south}
                onChange={(e) => setSearchParams(prev => ({ ...prev, south: parseFloat(e.target.value) }))}
                className="bg-slate-900 border-slate-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="east" className="text-slate-300">East Lng</Label>
              <Input
                id="east"
                type="number"
                step="0.1"
                value={searchParams.east}
                onChange={(e) => setSearchParams(prev => ({ ...prev, east: parseFloat(e.target.value) }))}
                className="bg-slate-900 border-slate-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="west" className="text-slate-300">West Lng</Label>
              <Input
                id="west"
                type="number"
                step="0.1"
                value={searchParams.west}
                onChange={(e) => setSearchParams(prev => ({ ...prev, west: parseFloat(e.target.value) }))}
                className="bg-slate-900 border-slate-600 text-white"
              />
            </div>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate" className="text-slate-300">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={searchParams.startDate}
                onChange={(e) => setSearchParams(prev => ({ ...prev, startDate: e.target.value }))}
                className="bg-slate-900 border-slate-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="endDate" className="text-slate-300">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={searchParams.endDate}
                onChange={(e) => setSearchParams(prev => ({ ...prev, endDate: e.target.value }))}
                className="bg-slate-900 border-slate-600 text-white"
              />
            </div>
          </div>

          {/* Cloud Cover Filter */}
          <div>
            <Label className="text-slate-300 mb-2 block">
              Max Cloud Cover: {searchParams.cloudCover}%
            </Label>
            <Slider
              value={[searchParams.cloudCover]}
              onValueChange={(value) => setSearchParams(prev => ({ ...prev, cloudCover: value[0] }))}
              min={0}
              max={100}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>Clear (0%)</span>
              <span>Cloudy (100%)</span>
            </div>
          </div>

          {/* Search Button */}
          <Button
            onClick={handleSearch}
            disabled={isSearching}
            className="w-full bg-cyan-600 hover:bg-cyan-700"
          >
            {isSearching ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Search className="h-4 w-4 mr-2" />
            )}
            {isSearching ? 'Searching...' : 'Search Satellite Images'}
          </Button>

          {/* Search Summary */}
          {satelliteImages.length > 0 && (
            <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
              <div className="flex items-center space-x-2">
                <Badge className="bg-cyan-600">
                  {satelliteImages.length} images found
                </Badge>
                <span className="text-sm text-slate-300">
                  Coverage: {searchParams.north}°N to {searchParams.south}°S
                </span>
              </div>
              <Button size="sm" variant="outline">
                <Download className="h-4 w-4 mr-1" />
                Export Results
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Image Results */}
      <SatelliteImageViewer images={satelliteImages} isLoading={isSearching} />
    </div>
  );
};

export default EnhancedSatelliteControls;
