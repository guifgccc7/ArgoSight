
-- Create tables for real AIS data integration
CREATE TABLE IF NOT EXISTS public.ais_feeds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_name TEXT NOT NULL,
  api_endpoint TEXT NOT NULL,
  api_key_ref TEXT, -- Reference to secret, not actual key
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'error')),
  last_sync TIMESTAMP WITH TIME ZONE,
  records_processed BIGINT DEFAULT 0,
  error_count INTEGER DEFAULT 0,
  config JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create table for real vessel tracking data
CREATE TABLE IF NOT EXISTS public.vessels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mmsi TEXT UNIQUE NOT NULL,
  imo TEXT,
  vessel_name TEXT NOT NULL,
  call_sign TEXT,
  vessel_type TEXT,
  flag_country TEXT,
  length NUMERIC,
  width NUMERIC,
  gross_tonnage NUMERIC,
  owner_company TEXT,
  organization_id UUID,
  status TEXT DEFAULT 'active',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create table for real-time vessel positions with partitioning support
CREATE TABLE IF NOT EXISTS public.vessel_positions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vessel_id UUID REFERENCES public.vessels(id) ON DELETE CASCADE,
  mmsi TEXT NOT NULL,
  latitude NUMERIC(10,6) NOT NULL,
  longitude NUMERIC(10,6) NOT NULL,
  speed_knots NUMERIC(5,2),
  course_degrees NUMERIC(5,2),
  heading_degrees NUMERIC(5,2),
  navigation_status TEXT,
  timestamp_utc TIMESTAMP WITH TIME ZONE NOT NULL,
  source_feed TEXT NOT NULL,
  data_quality_score NUMERIC(3,2) DEFAULT 1.0,
  raw_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index for efficient queries
CREATE INDEX IF NOT EXISTS idx_vessel_positions_vessel_timestamp 
ON public.vessel_positions(vessel_id, timestamp_utc DESC);

CREATE INDEX IF NOT EXISTS idx_vessel_positions_mmsi_timestamp 
ON public.vessel_positions(mmsi, timestamp_utc DESC);

CREATE INDEX IF NOT EXISTS idx_vessel_positions_location 
ON public.vessel_positions(latitude, longitude);

-- Create table for weather data integration
CREATE TABLE IF NOT EXISTS public.weather_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL,
  latitude NUMERIC(10,6) NOT NULL,
  longitude NUMERIC(10,6) NOT NULL,
  timestamp_utc TIMESTAMP WITH TIME ZONE NOT NULL,
  temperature_celsius NUMERIC(5,2),
  wind_speed_knots NUMERIC(5,2),
  wind_direction_degrees NUMERIC(5,2),
  wave_height_meters NUMERIC(4,2),
  visibility_km NUMERIC(5,2),
  weather_conditions TEXT,
  barometric_pressure NUMERIC(7,2),
  raw_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index for weather queries
CREATE INDEX IF NOT EXISTS idx_weather_data_location_time 
ON public.weather_data(latitude, longitude, timestamp_utc DESC);

-- Create table for satellite imagery metadata
CREATE TABLE IF NOT EXISTS public.satellite_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL,
  satellite_name TEXT,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  scene_id TEXT UNIQUE,
  acquisition_time TIMESTAMP WITH TIME ZONE NOT NULL,
  cloud_cover_percentage NUMERIC(5,2),
  resolution_meters NUMERIC(8,2),
  bbox_north NUMERIC(10,6),
  bbox_south NUMERIC(10,6),
  bbox_east NUMERIC(10,6),
  bbox_west NUMERIC(10,6),
  file_size_mb NUMERIC(10,2),
  processing_level TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create table for API integration logs
CREATE TABLE IF NOT EXISTS public.api_integration_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  integration_type TEXT NOT NULL,
  provider TEXT NOT NULL,
  endpoint TEXT,
  status_code INTEGER,
  response_time_ms INTEGER,
  records_processed INTEGER DEFAULT 0,
  error_message TEXT,
  timestamp_utc TIMESTAMP WITH TIME ZONE DEFAULT now(),
  metadata JSONB DEFAULT '{}'
);

-- Create table for system monitoring
CREATE TABLE IF NOT EXISTS public.system_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  metric_unit TEXT,
  component TEXT NOT NULL,
  timestamp_utc TIMESTAMP WITH TIME ZONE DEFAULT now(),
  metadata JSONB DEFAULT '{}'
);

-- Create table for data archiving configuration
CREATE TABLE IF NOT EXISTS public.data_retention_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name TEXT NOT NULL,
  retention_days INTEGER NOT NULL,
  archive_to_storage BOOLEAN DEFAULT true,
  compression_enabled BOOLEAN DEFAULT true,
  policy_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.ais_feeds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vessels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vessel_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weather_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.satellite_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_integration_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_retention_policies ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for authenticated users
CREATE POLICY "Allow authenticated users to read ais_feeds" ON public.ais_feeds
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to read vessels" ON public.vessels
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to read vessel_positions" ON public.vessel_positions
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to read weather_data" ON public.weather_data
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to read satellite_images" ON public.satellite_images
  FOR SELECT USING (auth.role() = 'authenticated');

-- Create functions for data management
CREATE OR REPLACE FUNCTION public.cleanup_old_positions(days_to_keep INTEGER DEFAULT 30)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM public.vessel_positions 
  WHERE timestamp_utc < NOW() - INTERVAL '1 day' * days_to_keep;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  INSERT INTO public.system_metrics (metric_name, metric_value, component)
  VALUES ('positions_archived', deleted_count, 'data_cleanup');
  
  RETURN deleted_count;
END;
$$;

-- Create function for system health monitoring
CREATE OR REPLACE FUNCTION public.get_system_health()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'vessels_count', (SELECT COUNT(*) FROM public.vessels),
    'positions_last_24h', (SELECT COUNT(*) FROM public.vessel_positions WHERE timestamp_utc > NOW() - INTERVAL '24 hours'),
    'weather_records_last_24h', (SELECT COUNT(*) FROM public.weather_data WHERE timestamp_utc > NOW() - INTERVAL '24 hours'),
    'satellite_images_last_7d', (SELECT COUNT(*) FROM public.satellite_images WHERE acquisition_time > NOW() - INTERVAL '7 days'),
    'api_errors_last_hour', (SELECT COUNT(*) FROM public.api_integration_logs WHERE timestamp_utc > NOW() - INTERVAL '1 hour' AND status_code >= 400),
    'last_check', NOW()
  ) INTO result;
  
  RETURN result;
END;
$$;

-- Enable realtime for critical tables
ALTER TABLE public.vessel_positions REPLICA IDENTITY FULL;
ALTER TABLE public.weather_data REPLICA IDENTITY FULL;
ALTER TABLE public.api_integration_logs REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.vessel_positions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.weather_data;
ALTER PUBLICATION supabase_realtime ADD TABLE public.api_integration_logs;
