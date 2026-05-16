'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  MapPin, 
  Wifi, 
  WifiOff, 
  Clock, 
  Bell, 
  User,
  Settings,
  Menu
} from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import { useLocationStore } from '@/stores/locationStore';
import { cn } from '@/lib/utils';

export function Topbar() {
  const { searchQuery, setSearchQuery, notifications, sidebarOpen, setSidebarOpen } = useUIStore();
  const { currentLocation } = useLocationStore();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isOnline, setIsOnline] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { 
      weekday: 'short', 
      day: '2-digit', 
      month: 'short' 
    });
  };

  return (
    <header className={cn(
      "h-16 bg-card/80 backdrop-blur-xl border-b border-border flex items-center justify-between px-4 lg:px-6 fixed top-0 right-0 z-40 transition-all duration-300",
      sidebarOpen && !isMobile ? "left-80" : "left-0"
    )}>
      {/* Mobile Menu Button */}
      {isMobile && (
        <motion.button
          onClick={() => setSidebarOpen(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 rounded-lg hover:bg-muted transition-colors mr-2"
        >
          <Menu className="w-5 h-5 text-foreground-muted" />
        </motion.button>
      )}

      {/* Search Bar - Hidden on mobile */}
      <div className={cn(
        "flex items-center gap-4 flex-1",
        isMobile ? "hidden" : "max-w-xl"
      )}>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
          <input
            type="text"
            placeholder="Buscar dados, locais, alertas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-border rounded-lg text-sm text-foreground placeholder-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3 lg:gap-6">
        {/* Location - Hidden on mobile */}
        {!isMobile && (
          <motion.div 
            className="flex items-center gap-2 text-sm"
            whileHover={{ scale: 1.05 }}
          >
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-foreground-muted">
              {currentLocation?.name}, {currentLocation?.region}
            </span>
          </motion.div>
        )}

        {/* Connection Status - Hidden on mobile */}
        {!isMobile && (
          <motion.div 
            className="flex items-center gap-2 text-sm"
            whileHover={{ scale: 1.05 }}
          >
            {isOnline ? (
              <Wifi className="w-4 h-4 text-success" />
            ) : (
              <WifiOff className="w-4 h-4 text-warning" />
            )}
            <span className={cn(
              "text-xs",
              isOnline ? "text-success" : "text-warning"
            )}>
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </motion.div>
        )}

        {/* Clock - Hidden on mobile */}
        {!isMobile && (
          <motion.div 
            className="flex items-center gap-2 text-sm"
            whileHover={{ scale: 1.05 }}
          >
            <Clock className="w-4 h-4 text-foreground-muted" />
            <div className="flex flex-col">
              <span className="text-foreground font-medium">
                {isMounted ? formatTime(currentTime) : '--:--:--'}
              </span>
              <span className="text-xs text-foreground-muted">
                {isMounted ? formatDate(currentTime) : '--/--/--'}
              </span>
            </div>
          </motion.div>
        )}

        {/* Notifications */}
        <motion.button
          className="relative p-2 rounded-lg hover:bg-muted transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Bell className="w-5 h-5 text-foreground-muted" />
          {notifications > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-5 h-5 bg-danger text-white text-xs rounded-full flex items-center justify-center font-medium"
            >
              {notifications}
            </motion.span>
          )}
        </motion.button>

        {/* Settings - Hidden on mobile */}
        {!isMobile && (
          <motion.button
            className="p-2 rounded-lg hover:bg-muted transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Settings className="w-5 h-5 text-foreground-muted" />
          </motion.button>
        )}

        {/* Profile */}
        <motion.button
          className="flex items-center gap-2 p-1 pr-3 rounded-lg hover:bg-muted transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <User className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-sm text-foreground font-medium hidden md:block">
            Admin
          </span>
        </motion.button>
      </div>
    </header>
  );
}