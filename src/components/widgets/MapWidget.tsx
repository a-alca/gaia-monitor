'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Map, Layers, Navigation, Maximize2 } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

interface MapWidgetProps {
  className?: string;
}

export function MapWidget({ className }: MapWidgetProps) {
  const mapRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Only load Leaflet on client side
    if (typeof window === 'undefined') return;

    const loadMap = async () => {
      try {
        const L = (await import('leaflet')).default;
        
        // Fix for default markers in Leaflet with Next.js
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });

        if (!mapContainerRef.current || mapRef.current) return;

        // Initialize map
        const map = L.map(mapContainerRef.current, {
          center: [-14.2350, -51.9253], // Center of Brazil
          zoom: 4,
          zoomControl: false,
          attributionControl: false,
        });

        // Add dark-themed tile layer
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          maxZoom: 19,
          subdomains: 'abcd',
        }).addTo(map);

        // Add sample markers for wildfires
        const wildfireLocations = [
          { lat: -23.5505, lng: -46.6333, name: 'São Paulo' },
          { lat: -22.9068, lng: -43.1729, name: 'Rio de Janeiro' },
          { lat: -19.9167, lng: -43.9345, name: 'Belo Horizonte' },
          { lat: -3.1190, lng: -60.0217, name: 'Manaus' },
        ];

        const customIcon = L.divIcon({
          className: 'custom-marker',
          html: `<div style="background-color: #ef4444; width: 12px; height: 12px; border-radius: 50%; border: 2px solid #fff; box-shadow: 0 0 10px rgba(239, 68, 68, 0.5);"></div>`,
          iconSize: [12, 12],
          iconAnchor: [6, 6],
        });

        wildfireLocations.forEach(location => {
          L.marker([location.lat, location.lng], { icon: customIcon })
            .addTo(map)
            .bindPopup(`<b>${location.name}</b><br>Foco de queimada ativo`);
        });

        // Add zoom control to bottom right
        L.control.zoom({
          position: 'bottomright'
        }).addTo(map);

        mapRef.current = map;
        setIsLoaded(true);

        return () => {
          if (mapRef.current) {
            mapRef.current.remove();
            mapRef.current = null;
          }
        };
      } catch (error) {
        console.error('Error loading map:', error);
      }
    };

    loadMap();
  }, []);

  const toggleFullscreen = () => {
    if (!mapContainerRef.current) return;
    
    if (!isFullscreen) {
      mapContainerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5 }}
      className={`bg-card/50 backdrop-blur-sm border border-border rounded-xl overflow-hidden hover:border-primary/30 transition-all duration-300 ${className}`}
    >
      <div className="p-6 border-b border-border">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-1">Mapa Ambiental</h3>
            <p className="text-sm text-foreground-muted">Visão geoespacial territorial</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="p-3 bg-green-500/10 rounded-lg">
              <Map className="w-6 h-6 text-green-500" />
            </div>
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <Maximize2 className="w-5 h-5 text-foreground-muted" />
            </button>
          </div>
        </div>
      </div>

      <div className="relative h-80">
        <div ref={mapContainerRef} className="absolute inset-0 z-0" />
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/20">
            <div className="text-foreground-muted">Carregando mapa...</div>
          </div>
        )}
        
        {/* Map Overlay Controls */}
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
          <div className="bg-card/90 backdrop-blur-sm rounded-lg p-2 border border-border">
            <div className="flex items-center gap-2 text-xs">
              <Layers className="w-4 h-4 text-foreground-muted" />
              <span className="text-foreground font-medium">Camadas</span>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 z-10 bg-card/90 backdrop-blur-sm rounded-lg p-3 border border-border">
          <h4 className="text-xs font-semibold text-foreground mb-2">Legenda</h4>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-xs text-foreground-muted">Focos de Queimada</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <span className="text-xs text-foreground-muted">Alertas</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-xs text-foreground-muted">Áreas Protegidas</span>
            </div>
          </div>
        </div>

        {/* Navigation Hint */}
        <div className="absolute bottom-4 right-4 z-10 bg-card/90 backdrop-blur-sm rounded-lg p-2 border border-border">
          <Navigation className="w-4 h-4 text-foreground-muted" />
        </div>
      </div>
    </motion.div>
  );
}