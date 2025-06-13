
import { supabase } from '@/integrations/supabase/client';

export interface SatelliteImageData {
  satellite_name: string;
  image_url: string;
  thumbnail_url?: string;
  scene_id: string;
  acquisition_time: string;
  cloud_cover_percentage: number;
  resolution_meters: number;
  bbox_north: number;
  bbox_south: number;
  bbox_east: number;
  bbox_west: number;
  file_size_mb: number;
  processing_level: string;
  provider: string;
  metadata?: any;
}

export interface SatelliteSearchParams {
  bbox: {
    coordinates: number[][][];
  };
  startDate?: string;
  endDate?: string;
  cloudCover?: number;
}

class SatelliteService {
  async searchSatelliteImages(params: SatelliteSearchParams): Promise<{ images: SatelliteImageData[]; total_count: number }> {
    try {
      console.log(`Searching satellite images for area:`, params);
      
      const { data, error } = await supabase.functions.invoke('satellite-data', {
        body: params
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(`Satellite API error: ${error.message}`);
      }

      if (data.error) {
        console.error('Satellite API error:', data.error);
        throw new Error(data.error);
      }

      console.log('Real satellite data received:', data.images?.length || 0, 'images');
      return {
        images: data.images || [],
        total_count: data.total_count || 0
      };
      
    } catch (error) {
      console.error('Error fetching satellite data:', error);
      
      // Fallback to mock data only if there's a network/API issue
      console.warn('Falling back to mock satellite data');
      return this.generateMockSatelliteData(params);
    }
  }

  private generateMockSatelliteData(params: SatelliteSearchParams): { images: SatelliteImageData[]; total_count: number } {
    const bbox = params.bbox.coordinates[0];
    const north = Math.max(...bbox.map(coord => coord[1]));
    const south = Math.min(...bbox.map(coord => coord[1]));
    const east = Math.max(...bbox.map(coord => coord[0]));
    const west = Math.min(...bbox.map(coord => coord[0]));

    const mockImages: SatelliteImageData[] = Array.from({ length: 5 }, (_, i) => ({
      satellite_name: `MockSat-${i + 1}`,
      image_url: `https://example.com/satellite/mock-${i + 1}.tiff`,
      thumbnail_url: `https://example.com/satellite/mock-${i + 1}-thumb.jpg`,
      scene_id: `MOCK_${Date.now()}_${i}`,
      acquisition_time: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      cloud_cover_percentage: Math.random() * 30,
      resolution_meters: 3.0,
      bbox_north: north,
      bbox_south: south,
      bbox_east: east,
      bbox_west: west,
      file_size_mb: 100 + Math.random() * 200,
      processing_level: 'L3B',
      provider: 'Mock Provider',
      metadata: {
        sun_azimuth: Math.random() * 360,
        sun_elevation: 30 + Math.random() * 60,
        view_angle: Math.random() * 45,
        quality_category: 'standard'
      }
    }));

    return {
      images: mockImages,
      total_count: mockImages.length
    };
  }

  async getAvailableSatellites(): Promise<string[]> {
    // Return list of available satellite sources
    return [
      'PlanetScope',
      'RapidEye',
      'Sentinel-2',
      'Landsat-8',
      'WorldView-3',
      'SPOT-7'
    ];
  }
}

export const satelliteService = new SatelliteService();
