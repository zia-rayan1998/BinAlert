import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { WasteReport, UrgencyLevel } from '../types';
import { Crosshair } from 'lucide-react';

interface MapProps {
  reports: WasteReport[];
  center?: [number, number];
  zoom?: number;
  interactive?: boolean;
}

export const MapComponent: React.FC<MapProps> = ({ 
  reports, 
  center = [34.0522, -118.2437], 
  zoom = 13,
  interactive = true 
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const userMarker = useRef<L.CircleMarker | null>(null);
  const [loadingLoc, setLoadingLoc] = useState(false);

  useEffect(() => {
    if (mapContainer.current && !mapInstance.current) {
      mapInstance.current = L.map(mapContainer.current, {
        zoomControl: false, // We'll add custom control or just keep it simple
        dragging: interactive,
        scrollWheelZoom: interactive,
        doubleClickZoom: interactive
      }).setView(center, zoom);

      if (interactive) {
        L.control.zoom({ position: 'bottomright' }).addTo(mapInstance.current);
      }

      // Professional, clean map tiles (CartoDB Voyager)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(mapInstance.current);
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [interactive]);

  useEffect(() => {
    if (!mapInstance.current) return;
    
    // Clear existing report markers (keep user marker if exists)
    mapInstance.current.eachLayer((layer) => {
      if (layer instanceof L.CircleMarker && layer !== userMarker.current) {
        mapInstance.current?.removeLayer(layer);
      }
    });

    reports.forEach(report => {
      const color = report.urgency === UrgencyLevel.CRITICAL ? '#ef4444' : 
                    report.urgency === UrgencyLevel.HIGH ? '#f97316' : 
                    '#10b981'; // red, orange, emerald
      
      const marker = L.circleMarker([report.location.lat, report.location.lng], {
        radius: 8,
        fillColor: color,
        color: '#fff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8
      }).addTo(mapInstance.current!);

      marker.bindPopup(`
        <div style="font-family: 'Inter', sans-serif;">
          <strong style="display:block; margin-bottom: 4px; color: #1e293b;">${report.urgency} Priority</strong>
          <span style="font-size: 12px; color: #64748b;">${report.aiAnalysisText.substring(0, 50)}...</span>
          <div style="margin-top: 4px; font-size: 10px; font-weight: bold; color: ${color}">
            Overflow: ${report.overflowLevel}%
          </div>
        </div>
      `);
    });
    
    // Auto-fit bounds if we have reports and no user interaction yet
    if (reports.length > 0 && !userMarker.current) {
       const group = L.featureGroup(reports.map(r => L.circleMarker([r.location.lat, r.location.lng])));
       mapInstance.current.fitBounds(group.getBounds().pad(0.2));
    }

  }, [reports]);

  const handleLocateMe = () => {
    if (!mapInstance.current) return;
    setLoadingLoc(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        // Remove old marker
        if (userMarker.current) {
            mapInstance.current?.removeLayer(userMarker.current);
        }

        // Add User Marker (Blue Dot)
        userMarker.current = L.circleMarker([latitude, longitude], {
            radius: 10,
            fillColor: '#3b82f6', // blue-500
            color: '#fff',
            weight: 3,
            opacity: 1,
            fillOpacity: 1
        }).addTo(mapInstance.current!);
        
        // Add a pulsing effect ring
        const pulse = L.circle([latitude, longitude], {
            radius: 50,
            fillColor: '#3b82f6',
            fillOpacity: 0.2,
            stroke: false
        }).addTo(mapInstance.current!);
        
        // Zoom to user
        mapInstance.current?.flyTo([latitude, longitude], 15);
        setLoadingLoc(false);
      },
      (error) => {
        console.error("Geolocation error", error);
        alert("Could not access your location. Please enable permissions.");
        setLoadingLoc(false);
      }
    );
  };

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full bg-slate-100" style={{ minHeight: '100%' }} />
      
      {interactive && (
        <button 
          onClick={handleLocateMe}
          className="absolute bottom-6 right-4 z-[400] bg-white p-3 rounded-full shadow-lg hover:bg-slate-50 transition-colors text-slate-700"
          title="My Location"
        >
          <Crosshair size={24} className={loadingLoc ? 'animate-spin text-emerald-500' : ''} />
        </button>
      )}
    </div>
  );
};