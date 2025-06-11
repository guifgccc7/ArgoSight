import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { liveDataService, VesselData, ThreatAlert } from '@/services/liveDataService';

interface MapboxMapProps {
  className?: string;
  style?: string;
  center?: [number, number];
  zoom?: number;
  showVessels?: boolean;
  showRoutes?: boolean;
  showAlerts?: boolean;
  focusMode?: 'all' | 'ghost' | 'arctic' | 'mediterranean';
}

const MapboxMap: React.FC<MapboxMapProps> = ({
  className = "w-full h-full",
  style = 'mapbox://styles/mapbox/dark-v11',
  center = [0, 30],
  zoom = 2,
  showVessels = true,
  showRoutes = false,
  showAlerts = true,
  focusMode = 'all'
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const vesselMarkers = useRef<{ [key: string]: mapboxgl.Marker }>({});
  const alertMarkers = useRef<{ [key: string]: mapboxgl.Marker }>({});
  const [liveData, setLiveData] = useState<any>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map with token
    mapboxgl.accessToken = 'pk.eyJ1IjoiZ3VpNzc3NyIsImEiOiJjbWJyenl1aDQwY2t1MmlzN2RlbG9jbnVhIn0.Ioi4GvqrDAPLuj_3qOglcg';
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: style,
      center: center,
      zoom: zoom,
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl(),
      'top-right'
    );

    // Wait for map to load before adding data
    map.current.on('load', () => {
      if (showRoutes) {
        addMaritimeRoutes();
      }
    });

    // Subscribe to live data updates
    const unsubscribe = liveDataService.subscribe((data) => {
      setLiveData(data);
      console.log('Map received live data update:', data);
    });

    // Start live data feed
    liveDataService.startLiveDataFeed();

    // Cleanup
    return () => {
      unsubscribe();
      map.current?.remove();
    };
  }, [style, center, zoom, showRoutes]);

  // Update vessels when live data changes
  useEffect(() => {
    if (!map.current || !liveData || !showVessels) return;

    updateVesselMarkers(liveData.vessels || []);
    
    if (showAlerts) {
      updateAlertMarkers(liveData.alerts || []);
    }
  }, [liveData, showVessels, showAlerts, focusMode]);

  const updateVesselMarkers = (vessels: VesselData[]) => {
    // Filter vessels based on focus mode
    const filteredVessels = vessels.filter(vessel => {
      switch (focusMode) {
        case 'ghost':
          return vessel.status === 'dark' || vessel.vesselType === 'unknown';
        case 'arctic':
          return vessel.lat > 60; // Arctic regions
        case 'mediterranean':
          return vessel.lat > 30 && vessel.lat < 45 && vessel.lng > -10 && vessel.lng < 40;
        default:
          return true;
      }
    });

    // Remove old markers that are no longer in the data
    Object.keys(vesselMarkers.current).forEach(vesselId => {
      if (!filteredVessels.find(v => v.id === vesselId)) {
        vesselMarkers.current[vesselId].remove();
        delete vesselMarkers.current[vesselId];
      }
    });

    // Add or update vessel markers
    filteredVessels.forEach(vessel => {
      const existingMarker = vesselMarkers.current[vessel.id];
      
      if (existingMarker) {
        // Update existing marker position
        existingMarker.setLngLat([vessel.lng, vessel.lat]);
        updateVesselPopup(existingMarker, vessel);
      } else {
        // Create new marker
        const el = createVesselMarkerElement(vessel);
        const popup = createVesselPopup(vessel);
        
        const marker = new mapboxgl.Marker(el)
          .setLngLat([vessel.lng, vessel.lat])
          .setPopup(popup)
          .addTo(map.current!);
          
        vesselMarkers.current[vessel.id] = marker;
      }
    });
  };

  const updateAlertMarkers = (alerts: ThreatAlert[]) => {
    // Remove old alert markers
    Object.keys(alertMarkers.current).forEach(alertId => {
      if (!alerts.find(a => a.id === alertId)) {
        alertMarkers.current[alertId].remove();
        delete alertMarkers.current[alertId];
      }
    });

    // Add new alert markers
    alerts.forEach(alert => {
      if (!alertMarkers.current[alert.id]) {
        const el = createAlertMarkerElement(alert);
        const popup = createAlertPopup(alert);
        
        const marker = new mapboxgl.Marker(el)
          .setLngLat(alert.location)
          .setPopup(popup)
          .addTo(map.current!);
          
        alertMarkers.current[alert.id] = marker;
      }
    });
  };

  const createVesselMarkerElement = (vessel: VesselData) => {
    const el = document.createElement('div');
    el.className = 'vessel-marker';
    el.style.width = vessel.status === 'dark' ? '16px' : '12px';
    el.style.height = vessel.status === 'dark' ? '16px' : '12px';
    el.style.borderRadius = '50%';
    el.style.border = '2px solid white';
    el.style.cursor = 'pointer';
    el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
    
    // Add pulsing effect for ghost vessels
    if (vessel.status === 'dark') {
      el.style.animation = 'pulse 2s infinite';
      el.innerHTML = `<style>
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(107, 114, 128, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(107, 114, 128, 0); }
          100% { box-shadow: 0 0 0 0 rgba(107, 114, 128, 0); }
        }
      </style>`;
    }
    
    switch (vessel.status) {
      case 'active':
        el.style.backgroundColor = '#10b981';
        break;
      case 'warning':
        el.style.backgroundColor = '#f59e0b';
        break;
      case 'danger':
        el.style.backgroundColor = '#ef4444';
        break;
      case 'dark':
        el.style.backgroundColor = '#6b7280';
        break;
    }

    return el;
  };

  const createAlertMarkerElement = (alert: ThreatAlert) => {
    const el = document.createElement('div');
    el.className = 'alert-marker';
    el.style.width = '20px';
    el.style.height = '20px';
    el.style.borderRadius = '50%';
    el.style.border = '2px solid white';
    el.style.cursor = 'pointer';
    el.style.display = 'flex';
    el.style.alignItems = 'center';
    el.style.justifyContent = 'center';
    el.style.fontSize = '10px';
    el.style.fontWeight = 'bold';
    el.style.color = 'white';
    el.innerHTML = '!';
    
    switch (alert.severity) {
      case 'critical':
        el.style.backgroundColor = '#dc2626';
        el.style.animation = 'pulse 1s infinite';
        break;
      case 'high':
        el.style.backgroundColor = '#ea580c';
        break;
      case 'medium':
        el.style.backgroundColor = '#d97706';
        break;
      case 'low':
        el.style.backgroundColor = '#059669';
        break;
    }

    return el;
  };

  const createVesselPopupHTML = (vessel: VesselData) => {
    return `
      <div class="p-3 bg-slate-900 rounded">
        <h3 class="font-semibold text-sm text-white mb-2">${vessel.name}</h3>
        <div class="space-y-1 text-xs">
          <div class="flex justify-between">
            <span class="text-slate-300">ID:</span>
            <span class="text-cyan-400 font-mono">${vessel.id}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-300">Status:</span>
            <span class="text-${vessel.status === 'active' ? 'green' : vessel.status === 'warning' ? 'yellow' : vessel.status === 'danger' ? 'red' : 'gray'}-400">${vessel.status.toUpperCase()}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-300">Speed:</span>
            <span class="text-white">${vessel.speed.toFixed(1)} kts</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-300">Heading:</span>
            <span class="text-white">${vessel.heading.toFixed(0)}°</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-300">Type:</span>
            <span class="text-white">${vessel.vesselType}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-300">Last Update:</span>
            <span class="text-slate-400">${new Date(vessel.lastUpdate).toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    `;
  };

  const createVesselPopup = (vessel: VesselData) => {
    return new mapboxgl.Popup({ offset: 25 })
      .setHTML(createVesselPopupHTML(vessel));
  };

  const updateVesselPopup = (marker: mapboxgl.Marker, vessel: VesselData) => {
    const popup = marker.getPopup();
    if (popup) {
      popup.setHTML(createVesselPopupHTML(vessel));
    }
  };

  const createAlertPopup = (alert: ThreatAlert) => {
    return new mapboxgl.Popup({ offset: 25 })
      .setHTML(`
        <div class="p-3 bg-slate-900 rounded border border-red-500/50">
          <h3 class="font-semibold text-sm text-red-400 mb-2">THREAT ALERT</h3>
          <div class="space-y-1 text-xs">
            <div class="flex justify-between">
              <span class="text-slate-300">Type:</span>
              <span class="text-red-400">${alert.type.replace('_', ' ').toUpperCase()}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-300">Severity:</span>
              <span class="text-${alert.severity === 'critical' ? 'red' : alert.severity === 'high' ? 'orange' : alert.severity === 'medium' ? 'yellow' : 'green'}-400">${alert.severity.toUpperCase()}</span>
            </div>
            <div class="mt-2">
              <span class="text-slate-300">Description:</span>
              <p class="text-white mt-1">${alert.description}</p>
            </div>
            <div class="flex justify-between mt-2">
              <span class="text-slate-300">Time:</span>
              <span class="text-slate-400">${new Date(alert.timestamp).toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      `);
  };

  // Add maritime routes
  const addMaritimeRoutes = () => {
    const routes = [
      {
        id: 'suez-route',
        coordinates: [
          [32.3, 29.9], [34.0, 27.5], [43.3, 11.6], [51.25, 25.25], [60.0, 25.0]
        ],
        color: '#06b6d4',
        name: 'Suez Canal Route'
      },
      {
        id: 'panama-route',
        coordinates: [
          [-79.5, 9.0], [-95.0, 18.0], [-118.2, 34.0], [-157.8, 21.3]
        ],
        color: '#10b981',
        name: 'Panama Canal Route'
      },
      {
        id: 'arctic-route',
        coordinates: [
          [-170, 70], [-140, 75], [-100, 80], [-60, 78], [0, 82], [60, 80], [120, 75], [180, 70]
        ],
        color: '#8b5cf6',
        name: 'Arctic Passage'
      }
    ];

    routes.forEach(route => {
      if (focusMode === 'arctic' && route.id !== 'arctic-route') return;
      if (focusMode === 'mediterranean' && route.id === 'arctic-route') return;

      map.current!.addSource(route.id, {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: { name: route.name },
          geometry: {
            type: 'LineString',
            coordinates: route.coordinates
          }
        }
      });

      map.current!.addLayer({
        id: route.id,
        type: 'line',
        source: route.id,
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': route.color,
          'line-width': 3,
          'line-opacity': 0.8
        }
      });
    });
  };

  return (
    <div className={className}>
      <div ref={mapContainer} className="w-full h-full rounded-lg" />
      {liveData && (
        <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-sm rounded-lg p-3 text-white">
          <div className="text-xs space-y-1">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Live Data Active</span>
            </div>
            <div>Vessels: {liveData.vessels?.length || 0}</div>
            <div>Alerts: {liveData.alerts?.length || 0}</div>
            <div>Updated: {new Date(liveData.timestamp).toLocaleTimeString()}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapboxMap;
