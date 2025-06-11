
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapboxMapProps {
  className?: string;
  style?: string;
  center?: [number, number];
  zoom?: number;
  showVessels?: boolean;
  showRoutes?: boolean;
}

const MapboxMap: React.FC<MapboxMapProps> = ({
  className = "w-full h-full",
  style = 'mapbox://styles/mapbox/dark-v11',
  center = [0, 30],
  zoom = 2,
  showVessels = true,
  showRoutes = false
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map with your token
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

    // Add vessels markers when map loads
    map.current.on('load', () => {
      if (showVessels) {
        addVesselMarkers();
      }
      if (showRoutes) {
        addMaritimeRoutes();
      }
    });

    // Mock vessel data
    const addVesselMarkers = () => {
      const vessels = [
        { id: 1, lat: 35.6762, lng: 139.6503, name: "Cargo Ship Alpha", status: "active" },
        { id: 2, lat: 40.7128, lng: -74.0060, name: "Tanker Beta", status: "warning" },
        { id: 3, lat: 51.5074, lng: -0.1278, name: "Container Gamma", status: "danger" },
        { id: 4, lat: 37.7749, lng: -122.4194, name: "Fishing Delta", status: "active" },
        { id: 5, lat: 55.7558, lng: 37.6176, name: "Unknown Vessel", status: "dark" },
      ];

      vessels.forEach(vessel => {
        const el = document.createElement('div');
        el.className = 'vessel-marker';
        el.style.width = '12px';
        el.style.height = '12px';
        el.style.borderRadius = '50%';
        el.style.border = '2px solid white';
        el.style.cursor = 'pointer';
        
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

        const popup = new mapboxgl.Popup({ offset: 25 })
          .setHTML(`
            <div class="p-2">
              <h3 class="font-semibold text-sm">${vessel.name}</h3>
              <p class="text-xs text-gray-600">Status: ${vessel.status}</p>
              <p class="text-xs text-gray-600">ID: ${vessel.id}</p>
            </div>
          `);

        new mapboxgl.Marker(el)
          .setLngLat([vessel.lng, vessel.lat])
          .setPopup(popup)
          .addTo(map.current!);
      });
    };

    // Add maritime routes
    const addMaritimeRoutes = () => {
      const routes = [
        {
          id: 'suez-route',
          coordinates: [
            [32.3, 29.9], [34.0, 27.5], [43.3, 11.6], [51.25, 25.25], [60.0, 25.0]
          ],
          color: '#06b6d4'
        },
        {
          id: 'panama-route',
          coordinates: [
            [-79.5, 9.0], [-95.0, 18.0], [-118.2, 34.0], [-157.8, 21.3]
          ],
          color: '#10b981'
        }
      ];

      routes.forEach(route => {
        map.current!.addSource(route.id, {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
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

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, [style, center, zoom, showVessels, showRoutes]);

  return (
    <div className={className}>
      <div ref={mapContainer} className="w-full h-full rounded-lg" />
    </div>
  );
};

export default MapboxMap;
