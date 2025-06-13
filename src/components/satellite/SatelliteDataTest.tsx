
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Satellite, Calendar, Eye, Download } from 'lucide-react';
import { satelliteService, SatelliteImageData } from '@/services/satelliteService';

const SatelliteDataTest: React.FC = () => {
  const [satelliteData, setSatelliteData] = useState<SatelliteImageData[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);

  const testRegions = [
    { 
      name: 'Mediterranean Sea', 
      bbox: {
        coordinates: [[[10.0, 30.0], [20.0, 30.0], [20.0, 40.0], [10.0, 40.0], [10.0, 30.0]]]
      }
    },
    { 
      name: 'North Sea', 
      bbox: {
        coordinates: [[[0.0, 55.0], [8.0, 55.0], [8.0, 62.0], [0.0, 62.0], [0.0, 55.0]]]
      }
    },
    { 
      name: 'Gulf of Mexico', 
      bbox: {
        coordinates: [[[-98.0, 18.0], [-80.0, 18.0], [-80.0, 31.0], [-98.0, 31.0], [-98.0, 18.0]]]
      }
    },
    { 
      name: 'Arctic Ocean', 
      bbox: {
        coordinates: [[[-10.0, 70.0], [40.0, 70.0], [40.0, 85.0], [-10.0, 85.0], [-10.0, 70.0]]]
      }
    },
  ];

  const fetchSatelliteData = async (region: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const searchParams = {
        bbox: region.bbox,
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date().toISOString(),
        cloudCover: 0.3
      };

      const result = await satelliteService.searchSatelliteImages(searchParams);
      setSatelliteData(result.images);
      setTotalCount(result.total_count);
      setLastFetch(`${region.name} - ${new Date().toLocaleTimeString()}`);
      console.log('Satellite data received:', result);
    } catch (err: any) {
      setError(err.message);
      console.error('Satellite fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Satellite className="h-5 w-5 mr-2 text-purple-400" />
          Real Satellite Data Test
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {testRegions.map((region) => (
              <Button
                key={region.name}
                onClick={() => fetchSatelliteData(region)}
                disabled={loading}
                variant="outline"
                className="text-white border-slate-600 hover:bg-slate-700"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : region.name}
              </Button>
            ))}
          </div>

          {lastFetch && (
            <div className="text-xs text-slate-400">
              Last search: {lastFetch} | Found: {totalCount} images
            </div>
          )}

          {error && (
            <div className="text-red-400 text-sm bg-red-900/20 p-2 rounded">
              Error: {error}
            </div>
          )}

          {satelliteData && satelliteData.length > 0 && (
            <div className="space-y-3 bg-slate-900 p-4 rounded-lg max-h-96 overflow-y-auto">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-medium">Satellite Images</h3>
                <Badge variant="outline" className="text-green-400 border-green-400">
                  LIVE DATA
                </Badge>
              </div>
              
              {satelliteData.map((image, index) => (
                <div key={image.scene_id} className="border border-slate-700 rounded p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium text-sm">{image.satellite_name}</span>
                    <Badge variant="outline" className="text-xs">
                      {image.provider}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-3 w-3 text-blue-400" />
                      <span className="text-slate-300">Acquired:</span>
                      <span className="text-white">{new Date(image.acquisition_time).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Eye className="h-3 w-3 text-green-400" />
                      <span className="text-slate-300">Cloud:</span>
                      <span className="text-white">{image.cloud_cover_percentage.toFixed(1)}%</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-slate-300">Resolution:</span>
                      <span className="text-white">{image.resolution_meters}m</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Download className="h-3 w-3 text-purple-400" />
                      <span className="text-slate-300">Size:</span>
                      <span className="text-white">{image.file_size_mb.toFixed(0)}MB</span>
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t border-slate-700">
                    <span className="text-slate-300 text-xs">Scene ID: </span>
                    <span className="text-cyan-400 font-mono text-xs">{image.scene_id}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SatelliteDataTest;
