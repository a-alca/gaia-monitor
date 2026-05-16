'use client';

import { motion } from 'framer-motion';
import { Flame, MapPin, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { WildfireData } from '@/types';

interface WildfireWidgetProps {
  data?: WildfireData[];
}

export function WildfireWidget({ data }: WildfireWidgetProps) {
  const mockData: WildfireData[] = [
    {
      id: '1',
      location: { lat: -23.5505, lng: -46.6333, name: 'São Paulo' },
      intensity: 'high',
      area: 150,
      status: 'active',
      detectedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      lastUpdated: new Date(),
    },
    {
      id: '2',
      location: { lat: -22.9068, lng: -43.1729, name: 'Rio de Janeiro' },
      intensity: 'medium',
      area: 85,
      status: 'active',
      detectedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      lastUpdated: new Date(),
    },
    {
      id: '3',
      location: { lat: -19.9167, lng: -43.9345, name: 'Belo Horizonte' },
      intensity: 'low',
      area: 45,
      status: 'contained',
      detectedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      lastUpdated: new Date(),
    },
  ];

  const wildfireData = data || mockData;
  const activeFires = wildfireData.filter(f => f.status === 'active').length;
  const totalArea = wildfireData.reduce((acc, f) => acc + f.area, 0);
  const weeklyVariation = -12; // Mock data

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'extreme': return 'text-red-500 bg-red-500/10';
      case 'high': return 'text-orange-500 bg-orange-500/10';
      case 'medium': return 'text-yellow-500 bg-yellow-500/10';
      case 'low': return 'text-green-500 bg-green-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  const getIntensityLabel = (intensity: string) => {
    switch (intensity) {
      case 'extreme': return 'Extrema';
      case 'high': return 'Alta';
      case 'medium': return 'Média';
      case 'low': return 'Baixa';
      default: return 'Desconhecida';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-red-400';
      case 'contained': return 'text-yellow-400';
      case 'controlled': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'contained': return 'Contido';
      case 'controlled': return 'Controlado';
      default: return 'Desconhecido';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 hover:border-primary/30 transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">Queimadas</h3>
          <p className="text-sm text-foreground-muted">Monitoramento em tempo real</p>
        </div>
        <div className="p-3 bg-orange-500/10 rounded-lg">
          <Flame className="w-6 h-6 text-orange-500" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <p className="text-3xl font-bold text-foreground">{activeFires}</p>
          <p className="text-xs text-foreground-muted mt-1">Focos Ativos</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold text-foreground">{totalArea}</p>
          <p className="text-xs text-foreground-muted mt-1">Área (ha)</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1">
            {weeklyVariation >= 0 ? (
              <TrendingUp className="w-4 h-4 text-red-400" />
            ) : (
              <TrendingDown className="w-4 h-4 text-green-400" />
            )}
            <p className={`text-3xl font-bold ${weeklyVariation >= 0 ? 'text-red-400' : 'text-green-400'}`}>
              {Math.abs(weeklyVariation)}%
            </p>
          </div>
          <p className="text-xs text-foreground-muted mt-1">Variação Semanal</p>
        </div>
      </div>

      {/* Active Fires List */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-foreground mb-3">Regiões Críticas</h4>
        {wildfireData.slice(0, 3).map((fire) => (
          <motion.div
            key={fire.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-muted/30 rounded-lg p-3 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">{fire.location.name}</p>
                  <p className="text-xs text-foreground-muted">{fire.area} hectares</p>
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${getIntensityColor(fire.intensity)}`}>
                {getIntensityLabel(fire.intensity)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <AlertTriangle className={`w-3 h-3 ${getStatusColor(fire.status)}`} />
                <span className={`text-xs ${getStatusColor(fire.status)}`}>
                  {getStatusLabel(fire.status)}
                </span>
              </div>
              <span className="text-xs text-foreground-muted">
                {Math.floor((Date.now() - fire.detectedAt.getTime()) / (1000 * 60 * 60))}h atrás
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}