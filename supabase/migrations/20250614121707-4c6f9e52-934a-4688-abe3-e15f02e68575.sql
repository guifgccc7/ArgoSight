
-- Enable RLS policies for real-time data insertion
-- Allow service role to insert vessel data for real-time feeds
CREATE POLICY "Allow service operations on vessels" ON public.vessels
FOR ALL USING (true);

-- Allow service role to insert vessel positions for real-time feeds  
CREATE POLICY "Allow service operations on vessel_positions" ON public.vessel_positions
FOR ALL USING (true);

-- Allow service role to insert weather data for real-time feeds
CREATE POLICY "Allow service operations on weather_data" ON public.weather_data
FOR ALL USING (true);

-- Allow service role to insert satellite images for real-time feeds
CREATE POLICY "Allow service operations on satellite_images" ON public.satellite_images
FOR ALL USING (true);

-- Allow service role to insert AIS feed logs
CREATE POLICY "Allow service operations on ais_feeds" ON public.ais_feeds
FOR ALL USING (true);

-- Allow service role to insert API integration logs
CREATE POLICY "Allow service operations on api_integration_logs" ON public.api_integration_logs
FOR ALL USING (true);

-- Allow service role to insert system metrics
CREATE POLICY "Allow service operations on system_metrics" ON public.system_metrics
FOR ALL USING (true);
