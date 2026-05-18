'use client';

import { motion } from 'framer-motion';
import { Flame, MapPin, AlertTriangle, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { WildfireData } from '@/types';
import { getWildfireData } from '@/services/firmsService';
import { useEffect, useState } from 'react';

interface WildfireWidgetProps {
  data?: WildfireData[];
}

export function WildfireWidget({ data }: WildfireWidgetProps) {
  const [wildfireData, setWildfireData] = useState<WildfireData[]>([]);
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<'mock' | 'api'>('mock');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadWildfireData = async () => {
    setLoading(true);
    try {
      const hasApiKey = !!process.env.NEXT_PUBLIC_FIRMS_MAP_KEY;
      const data = await getWildfireData(hasApiKey);
      setWildfireData(data);
      setDataSource(hasApiKey ? 'api' : 'mock');
    } catch (error) {
      console.error('Error loading wildfire data:', error);
      // Set empty array on error to prevent UI crashes
      setWildfireData([]);
      setDataSource('mock');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWildfireData();
    
    // Auto-refresh every 15 minutes
    const interval = setInterval(() => {
      loadWildfireData();
    }, 15 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadWildfireData();
    setIsRefreshing(false);
  };

  const displayData = data || wildfireData;
  const activeFires = displayData.filter(f => f.status === 'active').length;
  const totalArea = displayData.reduce((acc, f) => acc + f.area, 0);
  const weeklyVariation = 0; // FIRMS doesn't provide historical comparison

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

  const getTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) {
      return `${diffDays}d atrás`;
    } else if (diffHours > 0) {
      return `${diffHours}h atrás`;
    } else {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return `${diffMinutes}min atrás`;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-4 lg:p-5 hover:border-primary/30 transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">Queimadas</h3>
          <p className="text-sm text-foreground-muted">Monitoramento em tempo real</p>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-xs font-medium ${dataSource === 'api' ? 'text-green-400' : 'text-yellow-400'}`}>
              NASA FIRMS {dataSource === 'api' ? '(Dados Reais)' : '(Dados Mock)'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            onClick={handleRefresh}
            disabled={loading || isRefreshing}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 text-foreground-muted ${isRefreshing ? 'animate-spin' : ''}`} />
          </motion.button>
          <div className="p-3 bg-orange-500/10 rounded-lg">
            <Flame className="w-6 h-6 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
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
        <h4 className="text-sm font-medium text-foreground mb-3">
          Regiões Críticas {displayData.length > 0 && `(${displayData.length})`}
        </h4>
        {displayData.length > 0 ? (
          displayData.slice(0, 3).map((fire) => (
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
                  {getTimeAgo(fire.detectedAt)}
                </span>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-4 text-sm text-foreground-muted">
            {loading ? 'Carregando dados...' : 'Nenhum foco detectado nas últimas 24h'}
          </div>
        )}
      </div>
    </motion.div>
  );
}