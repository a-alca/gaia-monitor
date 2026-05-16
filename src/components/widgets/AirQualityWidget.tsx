'use client';

import { motion } from 'framer-motion';
import { Wind, AlertCircle, TrendingUp, Activity } from 'lucide-react';
import { AirQualityData } from '@/types';

interface AirQualityWidgetProps {
  data?: AirQualityData;
}

export function AirQualityWidget({ data }: AirQualityWidgetProps) {
  const mockData: AirQualityData = {
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

  const airQualityData = data || mockData;

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

  const categoryInfo = getCategoryInfo(airQualityData.category);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 hover:border-primary/30 transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">Qualidade do Ar</h3>
          <p className="text-sm text-foreground-muted">Índice AQI em tempo real</p>
        </div>
        <div className="p-3 bg-cyan-500/10 rounded-lg">
          <Wind className="w-6 h-6 text-cyan-500" />
        </div>
      </div>

      {/* AQI Display */}
      <div className="flex items-center gap-6 mb-6">
        <div className="relative">
          <div className={`w-32 h-32 rounded-full ${categoryInfo.bgColor} ${categoryInfo.borderColor} border-4 flex items-center justify-center`}>
            <div className="text-center">
              <p className="text-4xl font-bold text-foreground">{airQualityData.aqi}</p>
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
            <span>Tendência: </span>
            <TrendingUp className="w-4 h-4 text-red-400" />
            <span className="text-red-400">Em alta</span>
          </div>
        </div>
      </div>

      {/* Pollutants Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-muted/30 rounded-lg p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-foreground-muted">PM2.5</span>
            <AlertCircle className={`w-3 h-3 ${airQualityData.pm25 > 25 ? 'text-yellow-400' : 'text-green-400'}`} />
          </div>
          <p className="text-lg font-semibold text-foreground">{airQualityData.pm25}</p>
          <p className="text-xs text-foreground-muted">µg/m³</p>
        </div>

        <div className="bg-muted/30 rounded-lg p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-foreground-muted">PM10</span>
            <AlertCircle className={`w-3 h-3 ${airQualityData.pm10 > 50 ? 'text-yellow-400' : 'text-green-400'}`} />
          </div>
          <p className="text-lg font-semibold text-foreground">{airQualityData.pm10}</p>
          <p className="text-xs text-foreground-muted">µg/m³</p>
        </div>

        <div className="bg-muted/30 rounded-lg p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-foreground-muted">O₃</span>
            <AlertCircle className={`w-3 h-3 ${airQualityData.o3 > 50 ? 'text-yellow-400' : 'text-green-400'}`} />
          </div>
          <p className="text-lg font-semibold text-foreground">{airQualityData.o3}</p>
          <p className="text-xs text-foreground-muted">µg/m³</p>
        </div>

        <div className="bg-muted/30 rounded-lg p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-foreground-muted">NO₂</span>
            <AlertCircle className={`w-3 h-3 ${airQualityData.no2 > 40 ? 'text-yellow-400' : 'text-green-400'}`} />
          </div>
          <p className="text-lg font-semibold text-foreground">{airQualityData.no2}</p>
          <p className="text-xs text-foreground-muted">µg/m³</p>
        </div>
      </div>

      {/* Additional Pollutants */}
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className="bg-muted/30 rounded-lg p-3">
          <span className="text-xs text-foreground-muted">SO₂</span>
          <p className="text-lg font-semibold text-foreground">{airQualityData.so2} µg/m³</p>
        </div>
        <div className="bg-muted/30 rounded-lg p-3">
          <span className="text-xs text-foreground-muted">CO</span>
          <p className="text-lg font-semibold text-foreground">{airQualityData.co} mg/m³</p>
        </div>
      </div>
    </motion.div>
  );
}