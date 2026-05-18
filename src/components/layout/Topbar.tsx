'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Wifi, 
  WifiOff, 
  Clock, 
  Bell, 
  Menu,
  X,
  Navigation
} from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import { useLocationStore } from '@/stores/locationStore';
import { cn } from '@/lib/utils';

export function Topbar() {
  const { notifications, sidebarOpen, setSidebarOpen } = useUIStore();
  const { currentLocation, fetchCurrentLocation, loading: locationLoading, error: locationError, setCurrentLocation } = useLocationStore();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isOnline, setIsOnline] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [showLocationError, setShowLocationError] = useState(false);
  

  useEffect(() => {
    setIsMounted(true);
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    
    // Only try automatic geolocation on localhost to avoid server IP issues
    const hostname = window.location.hostname;
    const isLocalhost = hostname === 'localhost' || 
                        hostname === '127.0.0.1' ||
                        hostname === '0.0.0.0' ||
                        hostname === '';
    
    if (isLocalhost) {
      console.log('Running on localhost, enabling automatic geolocation');
      fetchCurrentLocation();
    } else {
      console.log('Running on server IP, disabling automatic geolocation. Use manual search instead.');
    }
    
    return () => clearInterval(timer);
  }, [fetchCurrentLocation]);

  useEffect(() => {
    if (locationError) {
      setShowLocationError(true);
      console.error('Location error in Topbar:', locationError);
      // Auto-hide error after 5 seconds
      const timer = setTimeout(() => setShowLocationError(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [locationError]);

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

  const handleRefreshLocation = async () => {
    console.log('Manual location refresh requested');
    setShowLocationError(false);
    
    // Try geolocation (let browser handle permission)
    setIsLocating(true);
    try {
      await fetchCurrentLocation();
      console.log('Location refresh completed');
    } catch (error) {
      console.error('Location refresh failed:', error);
      setShowLocationError(true);
    } finally {
      setIsLocating(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { 
      weekday: 'short', 
      day: '2-digit', 
      month: 'short' 
    });
  };

  return (
    <>
    <header className={cn(
      "h-16 bg-card/80 backdrop-blur-xl border-b border-border flex items-center justify-between px-4 lg:px-6 fixed top-0 right-0 z-60 transition-all duration-300",
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

      {/* Right Section */}
      <div className="flex items-center gap-3 lg:gap-6">
        {/* Location - Hidden on mobile */}
        {!isMobile && (
          <div className="relative">
            <motion.div 
              className="flex items-center gap-2 text-sm"
              whileHover={{ scale: 1.05 }}
            >
              <MapPin className={cn(
                "w-4 h-4",
                locationLoading || isLocating ? "text-primary animate-pulse" : "text-primary"
              )} />
              <span className={cn(
                "text-foreground-muted",
                locationLoading || isLocating && "text-primary"
              )}>
                {locationLoading || isLocating ? 'Obtendo localização...' : currentLocation?.name}
              </span>
              <motion.button
                onClick={handleRefreshLocation}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                disabled={locationLoading || isLocating}
                className="p-1 rounded-full hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Atualizar localização"
              >
                <Navigation className={`w-3 h-3 text-foreground-muted ${locationLoading || isLocating ? 'animate-spin' : ''}`} />
              </motion.button>
            </motion.div>
            
            {/* Error message tooltip */}
            <AnimatePresence>
              {showLocationError && locationError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 mt-2 p-3 bg-danger/10 border border-danger/30 rounded-lg shadow-lg max-w-sm z-50"
                >
                  <p className="text-xs text-danger">{locationError}</p>
                  <div className="mt-2">
                    <button
                      onClick={() => setShowLocationError(false)}
                      className="text-xs text-danger hover:text-danger/80 underline"
                    >
                      Fechar
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
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

      </div>
    </header>
    </>
  );
}