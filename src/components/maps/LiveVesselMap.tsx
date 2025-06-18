import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from '@/integrations/supabase/client';

interface VesselPosition {
  id: string;
  mmsi: string;
  latitude: number;
  longitude: number;
  speed_knots: number;
  course_degrees: number;
  timestamp_utc: string;
  source_feed: string;
}

const LiveVesselMap: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [vessels, setVessels] = useState<VesselPosition[]>([]);
  const markersRef = useRef<Map<string, mapboxgl.Marker>>(new Map());
  const channelRef = useRef<any>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map with production Mapbox token
    mapboxgl.accessToken = 'pk.eyJ1IjoiZ3VpNzc3NyIsImEiOiJjbWJyenl1aDQwY2t1MmlzN2RlbG9jbnVhIn0.Ioi4GvqrDAPLuj_3qOglcg';
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [0, 30], // Start centered on Europe/Mediterranean
      zoom: 3,
      pitch: 0,
      bearing: 0
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Load initial vessel data
    loadVesselData();

    // Set up real-time subscription for new vessel positions
    const channelName = `vessel_positions_realtime_${Date.now()}`;
    channelRef.current = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'vessel_positions'
        },
        (payload) => {
          console.log('New vessel position:', payload.new);
          updateVesselOnMap(payload.new as VesselPosition);
        }
      )
      .subscribe();

    // Refresh vessel data every 30 seconds
    const interval = setInterval(loadVesselData, 30000);

    return () => {
      if (map.current) map.current.remove();
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
      clearInterval(interval);
    };
  }, []);

  const loadVesselData = async () => {
    try {
      const { data, error } = await supabase
        .from('vessel_positions')
        .select('id, mmsi, latitude, longitude, speed_knots, course_degrees, timestamp_utc, source_feed')
        .gte('timestamp_utc', new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()) // Last 6 hours
        .order('timestamp_utc', { ascending: false });

      if (error) {
        console.error('Error loading vessel data:', error);
        return;
      }

      // Get latest position for each vessel (MMSI)
      const latestPositions = new Map<string, VesselPosition>();
      data?.forEach((position: VesselPosition) => {
        if (!latestPositions.has(position.mmsi) || 
            new Date(position.timestamp_utc) > new Date(latestPositions.get(position.mmsi)!.timestamp_utc)) {
          latestPositions.set(position.mmsi, position);
        }
      });

      const vesselArray = Array.from(latestPositions.values());
      setVessels(vesselArray);
      
      // Update map markers
      vesselArray.forEach(updateVesselOnMap);

      console.log(`Loaded ${vesselArray.length} vessels on map`);
    } catch (error) {
      console.error('Error loading vessel data:', error);
    }
  };

  const updateVesselOnMap = (vessel: VesselPosition) => {
    if (!map.current) return;

    // Validate coordinates
    if (!vessel.latitude || !vessel.longitude || 
        vessel.latitude < -90 || vessel.latitude > 90 ||
        vessel.longitude < -180 || vessel.longitude > 180) {
      console.warn(`Invalid coordinates for vessel ${vessel.mmsi}: ${vessel.latitude}, ${vessel.longitude}`);
      return;
    }

    const existingMarker = markersRef.current.get(vessel.mmsi);
    if (existingMarker) {
      existingMarker.remove();
    }

    // Create vessel marker
    const el = document.createElement('div');
    el.className = 'vessel-marker';
    el.style.width = '12px';
    el.style.height = '12px';
    el.style.borderRadius = '50%';
    el.style.border = '2px solid #ffffff';
    
    // Color based on speed and age
    const age = Date.now() - new Date(vessel.timestamp_utc).getTime();
    const isRecent = age < 30 * 60 * 1000; // Less than 30 minutes
    
    if (vessel.speed_knots > 15) {
      el.style.backgroundColor = isRecent ? '#00ff00' : '#88ff88'; // Green for fast vessels
    } else if (vessel.speed_knots > 5) {
      el.style.backgroundColor = isRecent ? '#ffff00' : '#ffff88'; // Yellow for medium speed
    } else {
      el.style.backgroundColor = isRecent ? '#ff0000' : '#ff8888'; // Red for slow/stationary
    }

    // Create popup with correct coordinate display
    const popup = new mapboxgl.Popup({
      offset: 25,
      closeButton: false,
      closeOnClick: false
    }).setHTML(`
      <div class="bg-slate-800 text-white p-2 rounded text-xs">
        <div><strong>MMSI:</strong> ${vessel.mmsi}</div>
        <div><strong>Speed:</strong> ${vessel.speed_knots?.toFixed(1) || 'N/A'} kts</div>
        <div><strong>Course:</strong> ${vessel.course_degrees?.toFixed(0) || 'N/A'}°</div>
        <div><strong>Position:</strong> ${vessel.latitude.toFixed(4)}°N, ${vessel.longitude.toFixed(4)}°E</div>
        <div><strong>Last Update:</strong> ${new Date(vessel.timestamp_utc).toLocaleTimeString()}</div>
        <div><strong>Source:</strong> ${vessel.source_feed}</div>
      </div>
    `);

    // Ensure correct coordinate order: [longitude, latitude]
    const marker = new mapboxgl.Marker(el)
      .setLngLat([vessel.longitude, vessel.latitude])
      .setPopup(popup)
      .addTo(map.current);

    markersRef.current.set(vessel.mmsi, marker);

    // Log coordinate placement for debugging
    console.log(`Placed vessel ${vessel.mmsi} at [${vessel.longitude}, ${vessel.latitude}]`);
  };

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0" />
      <div className="absolute top-4 left-4 bg-slate-800 text-white p-3 rounded-lg shadow-lg">
        <h3 className="font-semibold mb-2">Live Vessel Tracking</h3>
        <div className="text-sm space-y-1">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-500 border border-white"></div>
            <span>Fast vessels (&gt;15 kts)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500 border border-white"></div>
            <span>Medium speed (5-15 kts)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500 border border-white"></div>
            <span>Slow/Stationary (&lt;5 kts)</span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-600">
            <div className="text-xs text-slate-300">
              {vessels.length} vessels tracked
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveVesselMap;
