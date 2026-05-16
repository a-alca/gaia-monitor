'use client';

import { motion } from 'framer-motion';
import { Activity, AlertTriangle, TrendingUp, ShieldCheck, Droplets, Wind } from 'lucide-react';

export function HeroSection() {
  const stats = [
    {
      label: 'Status Ambiental',
      value: 'Estável',
      icon: Activity,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
    },
    {
      label: 'Alertas Ativos',
      value: '3',
      icon: AlertTriangle,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
    },
    {
      label: 'Risco Ambiental',
      value: 'Moderado',
      icon: TrendingUp,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
    },
    {
      label: 'Áreas Monitoradas',
      value: '12',
      icon: ShieldCheck,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
    },
  ];

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
              Painel de Monitoramento Ambiental
            </h1>
            <p className="text-foreground-muted text-lg">
              Visão geral em tempo real do território e condições ambientais
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm text-foreground-muted">Sistema Online</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-4 hover:border-primary/30 transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <span className="text-sm text-foreground-muted">{stat.label}</span>
                </div>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Metrics */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="bg-muted/30 rounded-lg p-4 flex items-center gap-4"
          >
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <Droplets className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-foreground-muted">Umidade Média</p>
              <p className="text-xl font-bold text-foreground">65%</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="bg-muted/30 rounded-lg p-4 flex items-center gap-4"
          >
            <div className="p-3 bg-cyan-500/10 rounded-lg">
              <Wind className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <p className="text-sm text-foreground-muted">Velocidade do Vento</p>
              <p className="text-xl font-bold text-foreground">12 km/h</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.7 }}
            className="bg-muted/30 rounded-lg p-4 flex items-center gap-4"
          >
            <div className="p-3 bg-amber-500/10 rounded-lg">
              <Activity className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-foreground-muted">Índice de Qualidade</p>
              <p className="text-xl font-bold text-foreground">AQI 75</p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}