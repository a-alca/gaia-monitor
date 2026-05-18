'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
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
  const { searchQuery, setSearchQuery, notifications, sidebarOpen, setSidebarOpen } = useUIStore();
  const { currentLocation, fetchCurrentLocation, loading: locationLoading, error: locationError, setCurrentLocation } = useLocationStore();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isOnline, setIsOnline] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [showLocationError, setShowLocationError] = useState(false);
  const [showManualLocation, setShowManualLocation] = useState(false);
  const [manualLocationInput, setManualLocationInput] = useState('');
  

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
    
    // Check if running on localhost
    const hostname = window.location.hostname;
    const isLocalhost = hostname === 'localhost' || 
                        hostname === '127.0.0.1' ||
                        hostname === '0.0.0.0' ||
                        hostname === '';
    
    if (!isLocalhost) {
      // Directly open manual search for server IPs
      setShowManualLocation(true);
      return;
    }
    
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

  const handleManualLocationSearch = async () => {
    if (!manualLocationInput.trim()) return;
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(manualLocationInput)}&limit=1&accept-language=pt-BR`,
        {
          headers: {
            'User-Agent': 'GaiaMonitor/1.0'
          }
        }
      );
      
      const data = await response.json();
      console.log('Search results:', data);
      
      if (data && data.length > 0) {
        const result = data[0];
        console.log('Selected result:', result);
        
        // Extract city name from result with better logic
        const address = result.address || {};
        const cityName = address.city || 
                        address.town || 
                        address.village || 
                        address.municipality || 
                        address.suburb ||
                        address.county ||
                        result.name ||
                        result.display_name.split(',')[0];
        
        const location = {
          lat: parseFloat(result.lat),
          lng: parseFloat(result.lon),
          name: cityName,
          country: address.country || 'Brasil',
          region: address.state || 'Desconhecido'
        };
        
        console.log('Manual location set:', location);
        setCurrentLocation(location);
        setShowManualLocation(false);
        setManualLocationInput('');
      } else {
        alert('Localização não encontrada. Tente ser mais específico.');
      }
    } catch (error) {
      console.error('Error searching location:', error);
      alert('Erro ao buscar localização. Tente novamente.');
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

      {/* Search Bar - Hidden on mobile */}
      <div className={cn(
        "flex items-center gap-4 flex-1",
        isMobile ? "hidden" : "max-w-2xl"
      )}>
        <div className={cn(
          "relative flex-1 transition-all duration-300",
          isSearchFocused && "scale-105"
        )}>
          <Search className={cn(
            "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors",
            isSearchFocused ? "text-primary" : "text-foreground-muted"
          )} />
          <input
            type="text"
            placeholder="Buscar dados, locais, alertas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className={cn(
              "w-full pl-10 pr-10 py-2 bg-muted/50 border border-border rounded-lg text-sm text-foreground placeholder-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all",
              isSearchFocused && "bg-muted/70 ring-2 ring-primary/30"
            )}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted transition-colors"
            >
              <X className="w-3 h-3 text-foreground-muted hover:text-foreground" />
            </button>
          )}
        </div>
      </div>

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
              <motion.button
                onClick={() => setShowManualLocation(true)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-1 rounded-full hover:bg-muted transition-colors"
                title="Definir localização manualmente"
              >
                <Search className="w-3 h-3 text-foreground-muted" />
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
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => setShowLocationError(false)}
                      className="text-xs text-danger hover:text-danger/80 underline"
                    >
                      Fechar
                    </button>
                    <button
                      onClick={() => {
                        setShowLocationError(false);
                        setShowManualLocation(true);
                      }}
                      className="text-xs text-primary hover:text-primary/80 underline"
                    >
                      Buscar manualmente
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

      {/* Manual Location Modal */}
      <AnimatePresence>
        {showManualLocation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100]"
            onClick={() => setShowManualLocation(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card border border-border rounded-xl p-6 shadow-2xl max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Buscar localização manualmente
              </h3>
              <p className="text-sm text-foreground-muted mb-4">
                Digite o nome da cidade ou endereço para definir sua localização.
              </p>
              <input
                type="text"
                value={manualLocationInput}
                onChange={(e) => setManualLocationInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleManualLocationSearch()}
                placeholder="Ex: São Paulo, Rio de Janeiro, Brasil"
                className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-foreground placeholder-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary/50 mb-4"
              />
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setShowManualLocation(false);
                    setManualLocationInput('');
                  }}
                  className="px-4 py-2 text-sm text-foreground-muted hover:text-foreground transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleManualLocationSearch}
                  disabled={!manualLocationInput.trim()}
                  className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Buscar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}