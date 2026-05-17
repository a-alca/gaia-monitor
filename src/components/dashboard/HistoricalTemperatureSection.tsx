'use client';

import { motion } from 'framer-motion';
import { Thermometer, TrendingUp, TrendingDown, Calendar, Clock, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';

interface HistoricalData {
  current: {
    temperature: number;
    apparentTemperature: number;
    date: string;
  };
  recentHistorical: {
    data: Array<{
      date: string;
      temperature: number;
      apparentTemperature: number;
      maxTemperature: number;
      minTemperature: number;
    }>;
    statistics: {
      average: number;
      max: number;
      min: number;
    };
  };
  sameDayHistorical: {
    data: Array<{
      date: string;
      temperature: number;
      apparentTemperature: number;
      maxTemperature: number;
      minTemperature: number;
    }>;
    statistics: {
      average: number;
    };
  };
  comparison: {
    currentVsRecentAvg: number;
    currentVsSameDayAvg: number;
  };
}

export function HistoricalTemperatureSection() {
  const [data, setData] = useState<HistoricalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/historical-temperature');
      if (!response.ok) {
        throw new Error('Failed to fetch historical temperature data');
      }
      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching data');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setLoading(true);
    await fetchData();
  };

  const formatTemperature = (temp: number) => `${temp}°C`;

  const getComparisonColor = (value: number) => {
    if (value > 0) return 'text-red-400';
    if (value < 0) return 'text-blue-400';
    return 'text-gray-400';
  };

  const getComparisonIcon = (value: number) => {
    if (value > 0) return TrendingUp;
    if (value < 0) return TrendingDown;
    return Clock;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  };

  if (loading && !data) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden bg-gradient-to-br from-card via-card to-primary/5 border border-border rounded-2xl p-8 mb-8"
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-foreground">Carregando dados históricos...</div>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden bg-gradient-to-br from-card via-card to-primary/5 border border-border rounded-2xl p-8 mb-8"
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-red-400">Erro: {error}</div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden bg-gradient-to-br from-card via-card to-primary/5 border border-border rounded-2xl p-8 mb-8"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }} />
      </div>

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Painel de Temperaturas Históricas
            </h1>
            <p className="text-foreground-muted text-lg">
              Comparação de temperatura atual com dados históricos
            </p>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              onClick={handleRefresh}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <RefreshCw className={`w-5 h-5 text-foreground-muted ${isRefreshing ? 'animate-spin' : ''}`} />
            </motion.button>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm text-foreground-muted">Dados em tempo real</span>
            </div>
          </div>
        </div>

        {/* Current Temperature */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 hover:border-primary/30 transition-all"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Thermometer className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Temperatura Atual</h3>
                <p className="text-sm text-foreground-muted">Hoje</p>
              </div>
            </div>
            <div className="text-center">
              <p className="text-5xl font-bold text-foreground mb-2">
                {data?.current.temperature}°
              </p>
              <p className="text-sm text-foreground-muted">
                Sensação: {data?.current.apparentTemperature}°C
              </p>
            </div>
          </motion.div>

          {/* Comparison with Recent Average */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 hover:border-primary/30 transition-all"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Média dos Últimos 30 Dias</h3>
                <p className="text-sm text-foreground-muted">Comparação recente</p>
              </div>
            </div>
            <div className="text-center">
              <p className="text-5xl font-bold text-foreground mb-2">
                {data?.recentHistorical.statistics.average}°
              </p>
              <div className="flex items-center justify-center gap-2">
                {(() => {
                  const ComparisonIcon = getComparisonIcon(data?.comparison.currentVsRecentAvg || 0);
                  return (
                    <>
                      <ComparisonIcon className={`w-5 h-5 ${getComparisonColor(data?.comparison.currentVsRecentAvg || 0)}`} />
                      <span className={`text-lg font-semibold ${getComparisonColor(data?.comparison.currentVsRecentAvg || 0)}`}>
                        {data?.comparison.currentVsRecentAvg > 0 ? '+' : ''}{data?.comparison.currentVsRecentAvg}°
                      </span>
                    </>
                  );
                })()}
              </div>
            </div>
          </motion.div>

          {/* Comparison with Same Day Historical */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 hover:border-primary/30 transition-all"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-purple-500/10 rounded-lg">
                <Clock className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Média Histórica (5 anos)</h3>
                <p className="text-sm text-foreground-muted">Mesmo dia dos anos anteriores</p>
              </div>
            </div>
            <div className="text-center">
              <p className="text-5xl font-bold text-foreground mb-2">
                {data?.sameDayHistorical.statistics.average}°
              </p>
              <div className="flex items-center justify-center gap-2">
                {(() => {
                  const ComparisonIcon = getComparisonIcon(data?.comparison.currentVsSameDayAvg || 0);
                  return (
                    <>
                      <ComparisonIcon className={`w-5 h-5 ${getComparisonColor(data?.comparison.currentVsSameDayAvg || 0)}`} />
                      <span className={`text-lg font-semibold ${getComparisonColor(data?.comparison.currentVsSameDayAvg || 0)}`}>
                        {data?.comparison.currentVsSameDayAvg > 0 ? '+' : ''}{data?.comparison.currentVsSameDayAvg}°
                      </span>
                    </>
                  );
                })()}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Historical Data Table */}
        <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Dados Históricos do Mesmo Dia</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-foreground-muted font-medium">Ano</th>
                  <th className="text-left py-3 px-4 text-foreground-muted font-medium">Temperatura Média</th>
                  <th className="text-left py-3 px-4 text-foreground-muted font-medium">Máxima</th>
                  <th className="text-left py-3 px-4 text-foreground-muted font-medium">Mínima</th>
                  <th className="text-left py-3 px-4 text-foreground-muted font-medium">Sensação</th>
                </tr>
              </thead>
              <tbody>
                {data?.sameDayHistorical.data.map((item, index) => (
                  <tr key={index} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 text-foreground font-medium">
                      {new Date(item.date).getFullYear()}
                    </td>
                    <td className="py-3 px-4 text-foreground">
                      {formatTemperature(item.temperature)}
                    </td>
                    <td className="py-3 px-4 text-foreground">
                      {formatTemperature(item.maxTemperature)}
                    </td>
                    <td className="py-3 px-4 text-foreground">
                      {formatTemperature(item.minTemperature)}
                    </td>
                    <td className="py-3 px-4 text-foreground">
                      {formatTemperature(item.apparentTemperature)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-muted/30 rounded-lg p-4">
            <p className="text-sm text-foreground-muted mb-2">
              <span className="text-foreground font-medium">Máxima dos últimos 30 dias:</span> {data?.recentHistorical.statistics.max}°C
            </p>
            <p className="text-sm text-foreground-muted">
              <span className="text-foreground font-medium">Mínima dos últimos 30 dias:</span> {data?.recentHistorical.statistics.min}°C
            </p>
          </div>
          <div className="bg-muted/30 rounded-lg p-4">
            <p className="text-sm text-foreground-muted">
              Fonte: Open-Meteo Historical Weather API (ERA5)
            </p>
            <p className="text-sm text-foreground-muted">
              Dados desde 1940 com reanálise meteorológica
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}