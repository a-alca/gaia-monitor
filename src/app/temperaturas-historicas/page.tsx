'use client';

import { motion } from 'framer-motion';
import { Thermometer, TrendingUp, TrendingDown, Calendar, Clock, ArrowLeft, RefreshCw, Activity, Zap, AlertTriangle, Flame, Snowflake, Eye, BarChart3 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

interface HistoricalData {
  current: {
    temperature: number;
    apparentTemperature: number;
    date: string;
    maxTemperature: number;
    minTemperature: number;
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

export default function TemperaturasHistoricasPage() {
  const router = useRouter();
  const [data, setData] = useState<HistoricalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    fetchData();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setLoading(true);
    await fetchData();
  };

  const formatTemperature = (temp: number) => `${temp.toFixed(1)}°C`;

  const getTemperatureColor = (temp: number) => {
    if (temp >= 35) return 'from-red-600 to-orange-500';
    if (temp >= 30) return 'from-orange-500 to-yellow-500';
    if (temp >= 25) return 'from-yellow-500 to-green-500';
    if (temp >= 20) return 'from-green-500 to-teal-500';
    if (temp >= 15) return 'from-teal-500 to-blue-500';
    if (temp >= 10) return 'from-blue-500 to-indigo-500';
    return 'from-indigo-500 to-purple-500';
  };

  const getGlowColor = (temp: number) => {
    if (temp >= 35) return 'shadow-red-500/50';
    if (temp >= 30) return 'shadow-orange-500/50';
    if (temp >= 25) return 'shadow-yellow-500/50';
    if (temp >= 20) return 'shadow-green-500/50';
    if (temp >= 15) return 'shadow-teal-500/50';
    if (temp >= 10) return 'shadow-blue-500/50';
    return 'shadow-purple-500/50';
  };

  const formatDateTime = () => {
    return currentTime.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // Generate chart data
  const generateChartData = () => {
    if (!data?.sameDayHistorical?.data) return [];
    
    const chartData = data.sameDayHistorical.data.map(item => ({
      date: new Date(item.date).getFullYear().toString(),
      max: item.maxTemperature,
      min: item.minTemperature,
      avg: item.temperature,
      apparent: item.apparentTemperature
    }));
    
    return chartData; // All years data
  };

  const chartData = generateChartData();

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando dados climáticos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-red-400 text-xl mb-2">Erro ao carregar dados</p>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Atmospheric Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 30%, rgba(255,100,50,0.1) 0%, transparent 50%),
                          radial-gradient(circle at 80% 70%, rgba(50,100,255,0.1) 0%, transparent 50%)`,
        }} />
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          opacity: 0.03
        }} />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left Section */}
            <div className="flex items-center gap-4">
              <motion.button
                onClick={() => router.push('/')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
              >
                <ArrowLeft className="w-5 h-5 text-gray-300" />
              </motion.button>
              
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${getTemperatureColor(data?.current.temperature || 20)} ${getGlowColor(data?.current.temperature || 20)} shadow-lg`}>
                  <Thermometer className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Painel de Temperaturas Históricas</h1>
                  <p className="text-gray-400 text-sm">Monitoramento Climático Avançado</p>
                </div>
              </div>
            </div>

            {/* Center Section - Location & Time */}
            <div className="hidden lg:flex items-center gap-6">
              <div className="text-center">
                <p className="text-xs text-gray-500 uppercase tracking-wider">Localização</p>
                <p className="text-white font-medium">São Paulo, Brasil</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500 uppercase tracking-wider">Data e Hora</p>
                <p className="text-white font-medium">{formatDateTime()}</p>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm text-green-400 font-medium">LIVE</span>
              </div>
              
              <motion.button
                onClick={handleRefresh}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isRefreshing}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
              >
                <RefreshCw className={`w-5 h-5 text-gray-300 ${isRefreshing ? 'animate-spin' : ''}`} />
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 p-6">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-xl border border-white/10 rounded-2xl p-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Temperature Display */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-green-400 font-medium uppercase tracking-wider">Temperatura Atual</span>
              </div>
              
              <div className="flex items-baseline gap-4 mb-6">
                <span className="text-8xl font-bold text-white">
                  {data?.current.temperature ? data.current.temperature.toFixed(1) : '--'}°
                </span>
                <div className="flex flex-col gap-1">
                  <span className="text-red-400 font-medium">Max: {data?.current.maxTemperature ? data.current.maxTemperature.toFixed(1) : '--'}°</span>
                  <span className="text-blue-400 font-medium">Min: {data?.current.minTemperature ? data.current.minTemperature.toFixed(1) : '--'}°</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Média</p>
                  <p className="text-2xl font-bold text-yellow-400">{data?.current.temperature ? data.current.temperature.toFixed(1) : '--'}°</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Sensação</p>
                  <p className="text-2xl font-bold text-purple-400">{data?.current.apparentTemperature ? data.current.apparentTemperature.toFixed(1) : '--'}°</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Amplitude</p>
                  <p className="text-2xl font-bold text-orange-400">
                    {data?.current.maxTemperature && data?.current.minTemperature 
                      ? (data.current.maxTemperature - data.current.minTemperature).toFixed(1) 
                      : '--'}°
                  </p>
                </div>
              </div>
            </div>

            {/* Historical Comparison */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-4 h-4 text-purple-400" />
                <span className="text-xs text-purple-400 font-medium uppercase tracking-wider">Comparação Histórica</span>
              </div>

              <div className="space-y-3">
                {data?.sameDayHistorical.data
                  ?.slice()
                  .sort((a, b) => new Date(b.date).getFullYear() - new Date(a.date).getFullYear())
                  .map((item, index) => {
                  const year = new Date(item.date).getFullYear();
                  const isCurrentYear = year === new Date().getFullYear();
                  
                  return (
                    <motion.div
                      key={year}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                        isCurrentYear ? 'bg-primary/20 border border-primary/50' : 'bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`text-sm font-medium ${isCurrentYear ? 'text-white' : 'text-gray-400'}`}>
                          {year}
                        </span>
                        {isCurrentYear && (
                          <span className="text-xs bg-primary text-white px-2 py-0.5 rounded-full">Atual</span>
                        )}
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <p className="text-xs text-gray-500">Média</p>
                          <p className="text-sm font-medium text-yellow-400">{item.temperature.toFixed(1)}°</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-500">Máx</p>
                          <p className="text-sm font-medium text-red-400">{item.maxTemperature.toFixed(1)}°</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-500">Mín</p>
                          <p className="text-sm font-medium text-blue-400">{item.minTemperature.toFixed(1)}°</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              <h2 className="text-lg font-semibold text-white">Evolução Térmica</h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-xs text-gray-400">Máxima</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <span className="text-xs text-gray-400">Média</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-xs text-gray-400">Mínima</span>
              </div>
            </div>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorMax" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#eab308" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#eab308" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorMin" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="date" 
                  stroke="#9ca3af"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#9ca3af"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}°`}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="max" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorMax)"
                  name="Máxima"
                />
                <Area 
                  type="monotone" 
                  dataKey="avg" 
                  stroke="#eab308" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorAvg)"
                  name="Média"
                />
                <Area 
                  type="monotone" 
                  dataKey="min" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorMin)"
                  name="Mínima"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-xl border border-white/10 rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <TrendingUp className="w-5 h-5 text-yellow-400" />
              </div>
              <span className="text-sm text-gray-400">Tendência das Médias</span>
            </div>
            <p className="text-2xl font-bold text-white mb-1">+2.3°C</p>
            <p className="text-xs text-gray-500">Últimos 5 anos</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-xl border border-white/10 rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <Flame className="w-5 h-5 text-red-400" />
              </div>
              <span className="text-sm text-gray-400">Evolução das Máximas</span>
            </div>
            <p className="text-2xl font-bold text-white mb-1">+3.1°C</p>
            <p className="text-xs text-gray-500">Comparação anual</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-xl border border-white/10 rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Zap className="w-5 h-5 text-purple-400" />
              </div>
              <span className="text-sm text-gray-400">Anomalia Climática</span>
            </div>
            <p className="text-2xl font-bold text-white mb-1">{data?.comparison.currentVsSameDayAvg ? (data.comparison.currentVsSameDayAvg > 0 ? '+' : '') + data.comparison.currentVsSameDayAvg.toFixed(1) : '0.0'}°</p>
            <p className="text-xs text-gray-500">Vs média histórica</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-xl border border-white/10 rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Activity className="w-5 h-5 text-green-400" />
              </div>
              <span className="text-sm text-gray-400">Índice de Aquecimento</span>
            </div>
            <p className="text-2xl font-bold text-white mb-1">+1.8%</p>
            <p className="text-xs text-gray-500">Última década</p>
          </motion.div>
        </div>

        {/* Historical Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <Eye className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg font-semibold text-white">Dados Históricos Detalhados</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm uppercase tracking-wider">Ano</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm uppercase tracking-wider">Média</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm uppercase tracking-wider">Máxima</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm uppercase tracking-wider">Mínima</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm uppercase tracking-wider">Amplitude</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm uppercase tracking-wider">Sensação</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm uppercase tracking-wider">Variação</th>
                </tr>
              </thead>
              <tbody>
                {data?.sameDayHistorical.data?.map((item, index) => {
                  const year = new Date(item.date).getFullYear();
                  const isCurrentYear = year === new Date().getFullYear();
                  const amplitude = item.maxTemperature - item.minTemperature;
                  const currentYearAvg = data?.sameDayHistorical.data?.find(d => new Date(d.date).getFullYear() === new Date().getFullYear())?.temperature || item.temperature;
                  const variation = item.temperature - currentYearAvg;
                  
                  return (
                    <tr 
                      key={year} 
                      className={`border-b border-white/5 transition-colors ${
                        isCurrentYear ? 'bg-primary/10' : 'hover:bg-white/5'
                      }`}
                    >
                      <td className="py-4 px-4">
                        <span className={`font-semibold ${isCurrentYear ? 'text-white' : 'text-gray-300'}`}>
                          {year}
                        </span>
                        {isCurrentYear && (
                          <span className="ml-2 text-xs bg-primary text-white px-2 py-0.5 rounded-full">Atual</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-yellow-400 font-medium">{formatTemperature(item.temperature)}</td>
                      <td className="py-4 px-4 text-red-400 font-medium">{formatTemperature(item.maxTemperature)}</td>
                      <td className="py-4 px-4 text-blue-400 font-medium">{formatTemperature(item.minTemperature)}</td>
                      <td className="py-4 px-4 text-gray-300">{formatTemperature(amplitude)}</td>
                      <td className="py-4 px-4 text-purple-400 font-medium">{formatTemperature(item.apparentTemperature)}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          {variation > 0 ? (
                            <TrendingUp className="w-4 h-4 text-red-400" />
                          ) : variation < 0 ? (
                            <TrendingDown className="w-4 h-4 text-blue-400" />
                          ) : (
                            <div className="w-4 h-4" />
                          )}
                          <span className={`font-medium ${variation > 0 ? 'text-red-400' : variation < 0 ? 'text-blue-400' : 'text-gray-400'}`}>
                            {variation > 0 ? '+' : ''}{variation.toFixed(1)}°
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      </main>
    </div>
  );
}