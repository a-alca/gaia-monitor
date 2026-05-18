'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Map, Layers, Navigation, Maximize2, RefreshCw } from 'lucide-react';
import type { LayerGroup, Map as LeafletMap } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getFireData, FIRMSFireData } from '@/services/firmsService';

interface MapWidgetProps {
  className?: string;
}

const FIRMS_MAP_CENTER: [number, number] = [-12.146856950945844, -50.36029987687619];
const FIRMS_LAYER_NAME = 'Fires';
const FIRMS_PIXEL_SIZE = 0.2;

function getBrightnessColor(brightness: number) {
  if (brightness >= 375) return '#facc15'; // Yellow - very high intensity
  if (brightness >= 350) return '#f97316'; // Orange - high intensity
  return '#ef4444'; // Red - moderate intensity
}

export function MapWidget({ className }: MapWidgetProps) {
  const mapRef = useRef<LeafletMap | null>(null);
  const fireLayerRef = useRef<LayerGroup | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [fireData, setFireData] = useState<FIRMSFireData[]>([]);
  const [dataSource, setDataSource] = useState<'mock' | 'api'>('mock');

  const loadFireData = async () => {
    try {
      const hasApiKey = !!process.env.NEXT_PUBLIC_FIRMS_MAP_KEY;
      const data = await getFireData(hasApiKey);
      setFireData(data);
      setDataSource(hasApiKey ? 'api' : 'mock');
    } catch (error) {
      console.error('Error loading fire data:', error);
      // Fallback to mock data on error
      const mockData = await getFireData(false);
      setFireData(mockData);
      setDataSource('mock');
    }
  };

  useEffect(() => {
    // Only load Leaflet on client side
    if (typeof window === 'undefined') return;

    const loadMap = async () => {
      try {
        const L = (await import('leaflet')).default;
        
        // Load fire data from FIRMS API
        loadFireData();
        
        // Fix for default markers in Leaflet with Next.js
        delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });

        if (!mapContainerRef.current || mapRef.current) return;

        // Initialize map
        const map = L.map(mapContainerRef.current, {
          center: FIRMS_MAP_CENTER,
          zoom: 6,
          zoomControl: false,
          attributionControl: false,
        });

        // Add dark-themed tile layer
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          maxZoom: 19,
          subdomains: 'abcd',
        }).addTo(map);

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

  // Render the FIRMS T21 fire layer from the Earth Engine example:
  // ImageCollection('FIRMS') -> select('T21') -> palette red/orange/yellow.
  useEffect(() => {
    const currentMap = mapRef.current;
    if (!currentMap || !isLoaded) return;

    const updateFireLayer = async () => {
      try {
        const L = (await import('leaflet')).default;

        if (fireLayerRef.current) {
          currentMap.removeLayer(fireLayerRef.current);
        }

        const layer = L.layerGroup();

        fireData.forEach(fire => {
          const color = getBrightnessColor(fire.brightness);
          const bounds: [[number, number], [number, number]] = [
            [fire.latitude - FIRMS_PIXEL_SIZE / 2, fire.longitude - FIRMS_PIXEL_SIZE / 2],
            [fire.latitude + FIRMS_PIXEL_SIZE / 2, fire.longitude + FIRMS_PIXEL_SIZE / 2],
          ];

          L.rectangle(bounds, {
            color,
            fillColor: color,
            fillOpacity: 0.72,
            opacity: 0.95,
            weight: 1,
          })
            .addTo(layer)
            .bindPopup(`
              <b>${FIRMS_LAYER_NAME}</b><br>
              Satélite: ${fire.satellite}<br>
              Temperatura: ${fire.brightness.toFixed(1)} K<br>
              Confiança: ${fire.confidence}<br>
              Data: ${fire.acq_date}<br>
              Hora: ${fire.acq_time}<br>
              FRP: ${fire.frp.toFixed(1)} MW
            `);
        });

        layer.addTo(currentMap);
        fireLayerRef.current = layer;
        currentMap.setView(FIRMS_MAP_CENTER, 6);
      } catch (error) {
        console.error('Error updating FIRMS layer:', error);
      }
    };

    updateFireLayer();
  }, [isLoaded, fireData]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadFireData();
    setIsRefreshing(false);
  };

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
            <p className="text-sm text-foreground-muted">Mapa de incêndios em tempo real</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-foreground-muted">Fonte:</span>
              <span className={`text-xs font-medium ${dataSource === 'api' ? 'text-green-400' : 'text-yellow-400'}`}>
                NASA FIRMS {dataSource === 'api' ? '(API)' : '(Dados Mock)'}
              </span>
              <span className="text-xs text-foreground-muted">•</span>
              <span className="text-xs text-foreground-muted">
                {fireData.length} focos detectados
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="p-3 bg-green-500/10 rounded-lg">
              <Map className="w-6 h-6 text-green-500" />
            </div>
            <motion.button
              onClick={handleRefresh}
              disabled={isRefreshing}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 text-foreground-muted ${isRefreshing ? 'animate-spin' : ''}`} />
            </motion.button>
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
              <span className="text-foreground font-medium">{FIRMS_LAYER_NAME}</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="absolute top-4 left-4 z-10 bg-card/90 backdrop-blur-sm rounded-lg p-3 border border-border">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-foreground-muted">Focos de incêndio:</span>
            <span className="text-lg font-bold text-foreground">{fireData.length}</span>
          </div>
          {isRefreshing && (
            <div className="text-xs text-foreground-muted mt-1">Atualizando...</div>
          )}
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 z-10 bg-card/90 backdrop-blur-sm rounded-lg p-3 border border-border">
          <h4 className="text-xs font-semibold text-foreground mb-2">Intensidade (Kelvin)</h4>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-xs text-foreground-muted">325-349 (Moderada)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500" />
              <span className="text-xs text-foreground-muted">350-374 (Alta)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <span className="text-xs text-foreground-muted">375+ (Muito Alta)</span>
            </div>
          </div>
          <div className="mt-2 text-[10px] text-foreground-muted">
            Fonte: NASA FIRMS {dataSource === 'api' ? '(Dados Reais)' : '(Dados Mock)'}
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
