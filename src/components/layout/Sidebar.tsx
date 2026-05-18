'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Cloud, 
  Flame, 
  Wind, 
  CloudRain, 
  AlertTriangle, 
  Calendar, 
  Newspaper, 
  Map, 
  Globe, 
  Settings,
  User,
  ChevronLeft,
  ChevronRight,
  X,
  Thermometer
} from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import { cn } from '@/lib/utils';

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, route: '/' },
  { id: 'clima', label: 'Clima', icon: Cloud, route: '/clima' },
  { id: 'queimadas', label: 'Queimadas', icon: Flame, route: '/queimadas' },
  { id: 'qualidade-ar', label: 'Qualidade do Ar', icon: Wind, route: '/qualidade-ar' },
  { id: 'chuvas', label: 'Chuvas', icon: CloudRain, route: '/chuvas' },
  { id: 'alertas', label: 'Alertas', icon: AlertTriangle, route: '/alertas' },
  { id: 'eventos', label: 'Eventos', icon: Calendar, route: '/eventos' },
  { id: 'noticias', label: 'Notícias', icon: Newspaper, route: '/noticias' },
  { id: 'temperaturas-historicas', label: 'Temperaturas Históricas', icon: Thermometer, route: '/temperaturas-historicas' },
  { id: 'territorios', label: 'Territórios', icon: Globe, route: '/territorios' },
  { id: 'mapa', label: 'Mapa', icon: Map, route: '/mapa' },
  { id: 'configuracoes', label: 'Configurações', icon: Settings, route: '/configuracoes' },
  { id: 'admin', label: 'Admin', icon: User, route: '/admin' },
];

export function Sidebar() {
  const { sidebarOpen, toggleSidebar, currentRoute, setSidebarOpen } = useUIStore();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      // Fecha sidebar em mobile, mas mantém estado atual em desktop
      if (mobile && window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [setSidebarOpen]);

  return (
    <>
      {/* Overlay para mobile */}
      <AnimatePresence>
        {sidebarOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ 
          width: sidebarOpen ? 260 : (isMobile ? 0 : 80),
          x: isMobile ? (sidebarOpen ? 0 : -260) : 0
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={cn(
          "fixed left-0 top-0 h-screen bg-card/80 backdrop-blur-xl border-r border-border z-50 flex flex-col",
          isMobile ? "shadow-2xl" : ""
        )}
      >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border">
        <AnimatePresence mode="wait">
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-muted flex items-center justify-center">
                <Globe className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-semibold text-lg text-foreground">Gaia Monitor</span>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex items-center gap-2">
          {isMobile && sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <X className="w-5 h-5 text-foreground-muted" />
            </button>
          )}
          {!isMobile && (
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              {sidebarOpen ? (
                <ChevronLeft className="w-5 h-5 text-foreground-muted" />
              ) : (
                <ChevronRight className="w-5 h-5 text-foreground-muted" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-3">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentRoute === item.id;
            
            return (
              <li key={item.id}>
                <motion.button
                  onClick={() => useUIStore.getState().setCurrentRoute(item.id)}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 relative overflow-hidden",
                    isActive
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "text-foreground-muted hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  {/* Background gradient on hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredItem === item.id && !isActive ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                  />
                  
                  <Icon className={cn(
                    "w-5 h-5 flex-shrink-0 relative z-10",
                    isActive ? "text-primary" : ""
                  )} />
                  
                  <AnimatePresence mode="wait">
                    {sidebarOpen && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                        className="font-medium text-sm relative z-10"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <AnimatePresence mode="wait">
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="text-xs text-foreground-muted text-center"
            >
              <p>v1.0.0</p>
              <p className="mt-1">© 2026 Gaia Monitor</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      </motion.aside>
    </>
  );
}