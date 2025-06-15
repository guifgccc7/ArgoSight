
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const planetApiKey = Deno.env.get('PLANET_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { bbox, startDate, endDate, cloudCover = 0.1 } = await req.json();
    
    if (!bbox || !bbox.coordinates) {
      console.error('Missing required bbox coordinates');
      return new Response(JSON.stringify({ 
        error: 'Bounding box coordinates are required',
        required_format: {
          bbox: {
            coordinates: [[[west, south], [east, south], [east, north], [west, north], [west, south]]]
          }
        }
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!planetApiKey) {
      console.error('Planet Labs API key not configured');
      
      // Return mock data when API key is not configured
      const mockImages = Array.from({ length: 3 }, (_, i) => ({
        satellite_name: `MockSat-${i + 1}`,
        image_url: `https://example.com/satellite/mock-${i + 1}.tiff`,
        thumbnail_url: `https://example.com/satellite/mock-${i + 1}-thumb.jpg`,
        scene_id: `MOCK_${Date.now()}_${i}`,
        acquisition_time: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        cloud_cover_percentage: Math.random() * 30,
        resolution_meters: 3.0,
        bbox_north: bbox.coordinates[0][2][1],
        bbox_south: bbox.coordinates[0][0][1],
        bbox_east: bbox.coordinates[0][1][0],
        bbox_west: bbox.coordinates[0][0][0],
        file_size_mb: 100 + Math.random() * 200,
        processing_level: 'L3B',
        provider: 'Mock Provider (API Key Required)',
        metadata: {
          sun_azimuth: Math.random() * 360,
          sun_elevation: 30 + Math.random() * 60,
          view_angle: Math.random() * 45,
          quality_category: 'demo'
        }
      }));

      return new Response(JSON.stringify({
        images: mockImages,
        total_count: mockImages.length,
        api_status: 'mock_data',
        message: 'Planet Labs API key not configured. Returning mock data. Please add PLANET_API_KEY to your Supabase secrets.',
        search_parameters: {
          bbox,
          date_range: {
            start: startDate || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            end: endDate || new Date().toISOString()
          },
          max_cloud_cover: cloudCover
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Searching satellite images for bbox: ${JSON.stringify(bbox)}`);

    // Search for satellite images using Planet Labs API
    const searchRequest = {
      item_types: ["PSScene"],
      filter: {
        type: "AndFilter",
        config: [
          {
            type: "GeometryFilter",
            field_name: "geometry",
            config: {
              type: "Polygon",
              coordinates: bbox.coordinates
            }
          },
          {
            type: "DateRangeFilter",
            field_name: "acquired",
            config: {
              gte: startDate || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
              lte: endDate || new Date().toISOString()
            }
          },
          {
            type: "RangeFilter",
            field_name: "cloud_cover",
            config: {
              gte: 0,
              lte: cloudCover
            }
          }
        ]
      }
    };

    const searchResponse = await fetch('https://api.planet.com/data/v1/quick-search', {
      method: 'POST',
      headers: {
        'Authorization': `api-key ${planetApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(searchRequest)
    });
    
    if (!searchResponse.ok) {
      const errorText = await searchResponse.text();
      console.error(`Planet Labs API error: ${searchResponse.status} ${searchResponse.statusText} - ${errorText}`);
      return new Response(JSON.stringify({ 
        error: `Satellite API error: ${searchResponse.status}`,
        details: searchResponse.statusText,
        api_response: errorText
      }), {
        status: searchResponse.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    const searchData = await searchResponse.json();
    console.log(`Found ${searchData.features?.length || 0} satellite images`);

    // Transform Planet Labs data to our format
    const satelliteImages = searchData.features?.slice(0, 10).map((feature: any) => ({
      satellite_name: `PlanetScope-${feature.id.substring(0, 8)}`,
      image_url: `https://api.planet.com/data/v1/assets/${feature.id}`,
      thumbnail_url: feature._links?.thumbnail || null,
      scene_id: feature.id,
      acquisition_time: feature.properties.acquired,
      cloud_cover_percentage: feature.properties.cloud_cover * 100,
      resolution_meters: 3.0, // PlanetScope typical resolution
      bbox_north: feature.bbox[3],
      bbox_south: feature.bbox[1],
      bbox_east: feature.bbox[2],
      bbox_west: feature.bbox[0],
      file_size_mb: feature.properties.item_type === 'PSScene' ? 250 : 100,
      processing_level: 'L3B',
      provider: 'Planet Labs',
      metadata: {
        sun_azimuth: feature.properties.sun_azimuth,
        sun_elevation: feature.properties.sun_elevation,
        view_angle: feature.properties.view_angle,
        quality_category: feature.properties.quality_category
      }
    })) || [];

    return new Response(JSON.stringify({
      images: satelliteImages,
      total_count: searchData.features?.length || 0,
      api_status: 'success',
      search_parameters: {
        bbox,
        date_range: {
          start: startDate || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          end: endDate || new Date().toISOString()
        },
        max_cloud_cover: cloudCover
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in satellite-data function:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
