'use client';

import { motion } from 'framer-motion';
import { Cloud, Droplets, Wind, Eye, Thermometer, Gauge, RefreshCw } from 'lucide-react';
import { ClimateData } from '@/types';
import { useEnvironmentStore } from '@/stores/environmentStore';
import { useEffect, useState } from 'react';

interface ClimateWidgetProps {
  data?: ClimateData;
}

export function ClimateWidget({ data }: ClimateWidgetProps) {
  const { climateData, loading, fetchClimateData } = useEnvironmentStore();
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  useEffect(() => {
    fetchClimateData();
    
    // Auto-refresh every 10 minutes
    const interval = setInterval(() => {
      fetchClimateData();
    }, 10 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [fetchClimateData]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchClimateData();
    setIsRefreshing(false);
  };

  const widgetData = data || climateData;

  // Fallback mock data if API fails
  const fallbackData: ClimateData = {
    temperature: 28,
    humidity: 65,
    windSpeed: 12,
    windDirection: 'NE',
    pressure: 1013,
    visibility: 10,
    uvIndex: 6,
    condition: 'Parcialmente Nublado',
    apparentTemperature: 30,
    timestamp: new Date(),
  };

  const displayData = widgetData || fallbackData;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 hover:border-primary/30 transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">Clima</h3>
          <p className="text-sm text-foreground-muted">{displayData.condition}</p>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            onClick={handleRefresh}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <RefreshCw className={`w-5 h-5 text-foreground-muted ${isRefreshing || loading ? 'animate-spin' : ''}`} />
          </motion.button>
          <div className="p-3 bg-primary/10 rounded-lg">
            <Cloud className="w-6 h-6 text-primary" />
          </div>
        </div>
      </div>

      {/* Temperature */}
      <div className="mb-6">
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-bold text-foreground">
            {displayData.temperature}°
          </span>
          <span className="text-xl text-foreground-muted">C</span>
        </div>
        <p className="text-sm text-foreground-muted mt-1">
          Sensação térmica: {displayData.apparentTemperature}°C
        </p>
      </div>

      {/* Grid of metrics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-muted/30 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Droplets className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-foreground-muted">Umidade</span>
          </div>
          <p className="text-lg font-semibold text-foreground">{displayData.humidity}%</p>
        </div>

        <div className="bg-muted/30 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Wind className="w-4 h-4 text-cyan-400" />
            <span className="text-xs text-foreground-muted">Vento</span>
          </div>
          <p className="text-lg font-semibold text-foreground">
            {displayData.windSpeed} km/h
          </p>
          <p className="text-xs text-foreground-muted">{displayData.windDirection}</p>
        </div>

        <div className="bg-muted/30 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Gauge className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-foreground-muted">Pressão</span>
          </div>
          <p className="text-lg font-semibold text-foreground">
            {displayData.pressure} hPa
          </p>
        </div>

        <div className="bg-muted/30 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Eye className="w-4 h-4 text-green-400" />
            <span className="text-xs text-foreground-muted">Visibilidade</span>
          </div>
          <p className="text-lg font-semibold text-foreground">
            {displayData.visibility} km
          </p>
        </div>
      </div>

      {/* UV Index */}
      <div className="mt-4 bg-muted/30 rounded-lg p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-foreground-muted">Índice UV</span>
          </div>
          <span className="text-sm font-semibold text-amber-400">
            {displayData.uvIndex}
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(displayData.uvIndex / 11) * 100}%` }}
          />
        </div>
      </div>
    </motion.div>
  );
}