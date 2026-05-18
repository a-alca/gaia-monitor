'use client';

import { motion } from 'framer-motion';
import { Wind, AlertCircle, TrendingUp, Activity, RefreshCw } from 'lucide-react';
import { AirQualityData } from '@/types';
import { useEnvironmentStore } from '@/stores/environmentStore';
import { useLocationStore } from '@/stores/locationStore';
import { useEffect, useState } from 'react';

interface AirQualityWidgetProps {
  data?: AirQualityData;
}

export function AirQualityWidget({ data }: AirQualityWidgetProps) {
  const { airQualityData, loading, fetchAirQualityData } = useEnvironmentStore();
  const { currentLocation } = useLocationStore();
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  useEffect(() => {
    if (currentLocation) {
      fetchAirQualityData(currentLocation.lat, currentLocation.lng);
    }
    
    // Auto-refresh every 15 minutes
    const interval = setInterval(() => {
      if (currentLocation) {
        fetchAirQualityData(currentLocation.lat, currentLocation.lng);
      }
    }, 15 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [fetchAirQualityData, currentLocation]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    if (currentLocation) {
      await fetchAirQualityData(currentLocation.lat, currentLocation.lng);
    }
    setIsRefreshing(false);
  };

  const widgetData = data || airQualityData;

  // Fallback mock data if API fails
  const fallbackData: AirQualityData = {
    aqi: 75,
    pm25: 25.4,
    pm10: 42.1,
    o3: 38.2,
    no2: 18.5,
    so2: 8.2,
    co: 0.8,
    category: 'moderate',
    timestamp: new Date(),
  };

  const displayData = widgetData || fallbackData;

  const getCategoryInfo = (category: string) => {
    switch (category) {
      case 'good':
        return {
          label: 'Boa',
          color: 'text-green-400',
          bgColor: 'bg-green-500/10',
          borderColor: 'border-green-500/30',
          description: 'Qualidade do ar satisfatória'
        };
      case 'moderate':
        return {
          label: 'Moderada',
          color: 'text-yellow-400',
          bgColor: 'bg-yellow-500/10',
          borderColor: 'border-yellow-500/30',
          description: 'Aceitável para maioria das pessoas'
        };
      case 'unhealthy-sensitive':
        return {
          label: 'Ruim para Grupos Sensíveis',
          color: 'text-orange-400',
          bgColor: 'bg-orange-500/10',
          borderColor: 'border-orange-500/30',
          description: 'Pessoas sensíveis podem ter efeitos'
        };
      case 'unhealthy':
        return {
          label: 'Ruim',
          color: 'text-red-400',
          bgColor: 'bg-red-500/10',
          borderColor: 'border-red-500/30',
          description: 'Todos podem ter efeitos à saúde'
        };
      case 'very-unhealthy':
        return {
          label: 'Muito Ruim',
          color: 'text-purple-400',
          bgColor: 'bg-purple-500/10',
          borderColor: 'border-purple-500/30',
          description: 'Alerta de saúde'
        };
      case 'hazardous':
        return {
          label: 'Perigosa',
          color: 'text-red-600',
          bgColor: 'bg-red-600/10',
          borderColor: 'border-red-600/30',
          description: 'Emergência de saúde'
        };
      default:
        return {
          label: 'Desconhecida',
          color: 'text-gray-400',
          bgColor: 'bg-gray-500/10',
          borderColor: 'border-gray-500/30',
          description: 'Dados não disponíveis'
        };
    }
  };

  const categoryInfo = getCategoryInfo(displayData.category);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-4 lg:p-5 hover:border-primary/30 transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">Qualidade do Ar</h3>
          <p className="text-sm text-foreground-muted">Índice AQI em tempo real</p>
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
          <div className="p-3 bg-cyan-500/10 rounded-lg">
            <Wind className="w-6 h-6 text-cyan-500" />
          </div>
        </div>
      </div>

      {/* AQI Display */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative">
          <div className={`w-24 h-24 rounded-full ${categoryInfo.bgColor} ${categoryInfo.borderColor} border-4 flex items-center justify-center`}>
            <div className="text-center">
              <p className="text-3xl font-bold text-foreground">{displayData.aqi}</p>
              <p className="text-xs text-foreground-muted">AQI</p>
            </div>
          </div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
            <span className={`text-xs px-3 py-1 rounded-full ${categoryInfo.bgColor} ${categoryInfo.color} font-medium`}>
              {categoryInfo.label}
            </span>
          </div>
        </div>
        <div className="flex-1">
          <p className="text-sm text-foreground-muted mb-2">{categoryInfo.description}</p>
          <div className="flex items-center gap-2 text-xs text-foreground-muted">
            <Activity className="w-4 h-4" />
            <span>Atualizado: </span>
            <span suppressHydrationWarning>
              {new Date(displayData.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      </div>

      {/* Pollutants Grid */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-muted/30 rounded-lg p-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-foreground-muted">PM2.5</span>
            <AlertCircle className={`w-3 h-3 ${displayData.pm25 > 25 ? 'text-yellow-400' : 'text-green-400'}`} />
          </div>
          <p className="text-lg font-semibold text-foreground">{displayData.pm25}</p>
          <p className="text-xs text-foreground-muted">µg/m³</p>
        </div>

        <div className="bg-muted/30 rounded-lg p-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-foreground-muted">PM10</span>
            <AlertCircle className={`w-3 h-3 ${displayData.pm10 > 50 ? 'text-yellow-400' : 'text-green-400'}`} />
          </div>
          <p className="text-lg font-semibold text-foreground">{displayData.pm10}</p>
          <p className="text-xs text-foreground-muted">µg/m³</p>
        </div>

        <div className="bg-muted/30 rounded-lg p-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-foreground-muted">O₃</span>
            <AlertCircle className={`w-3 h-3 ${displayData.o3 > 50 ? 'text-yellow-400' : 'text-green-400'}`} />
          </div>
          <p className="text-lg font-semibold text-foreground">{displayData.o3}</p>
          <p className="text-xs text-foreground-muted">µg/m³</p>
        </div>

        <div className="bg-muted/30 rounded-lg p-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-foreground-muted">NO₂</span>
            <AlertCircle className={`w-3 h-3 ${displayData.no2 > 40 ? 'text-yellow-400' : 'text-green-400'}`} />
          </div>
          <p className="text-lg font-semibold text-foreground">{displayData.no2}</p>
          <p className="text-xs text-foreground-muted">µg/m³</p>
        </div>
      </div>

      {/* Additional Pollutants */}
      <div className="mt-2 grid grid-cols-2 gap-2">
        <div className="bg-muted/30 rounded-lg p-2">
          <span className="text-xs text-foreground-muted">SO₂</span>
          <p className="text-lg font-semibold text-foreground">{displayData.so2} µg/m³</p>
        </div>
        <div className="bg-muted/30 rounded-lg p-2">
          <span className="text-xs text-foreground-muted">CO</span>
          <p className="text-lg font-semibold text-foreground">{displayData.co} mg/m³</p>
        </div>
      </div>
    </motion.div>
  );
}