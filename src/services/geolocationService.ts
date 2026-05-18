// Geolocation service using HTML5 Geolocation API

export interface GeolocationPosition {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude: number | null;
  altitudeAccuracy: number | null;
  heading: number | null;
  speed: number | null;
  timestamp: number;
}

export interface GeolocationError {
  code: number;
  message: string;
  PERMISSION_DENIED: number;
  POSITION_UNAVAILABLE: number;
  TIMEOUT: number;
}

export interface ReverseGeocodingResult {
  city: string;
  region: string;
  country: string;
  formattedAddress: string;
}

/**
 * Check current geolocation permission status
 */
export function checkPermissionStatus(): PermissionState | null {
  if (typeof window === 'undefined' || !navigator.permissions) {
    console.log('Permissions API not supported');
    return null;
  }

  try {
    navigator.permissions.query({ name: 'geolocation' }).then(result => {
      console.log('Geolocation permission status:', result.state);
      return result.state;
    }).catch(err => {
      console.error('Error checking permission status:', err);
      return null;
    });
  } catch (error) {
    console.error('Error checking permission status:', error);
    return null;
  }
  
  return null;
}

/**
 * Request geolocation permission explicitly
 */
export function requestGeolocationPermission(): Promise<PermissionState> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !navigator.permissions) {
      reject(new Error('Permissions API not supported'));
      return;
    }

    navigator.permissions.query({ name: 'geolocation' })
      .then(result => {
        console.log('Current permission status:', result.state);
        resolve(result.state);
      })
      .catch(err => {
        reject(new Error('Error checking permission: ' + err.message));
      });
  });
}

/**
 * Get current device position using HTML5 Geolocation API
 */
export function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      console.error('Geolocation not supported');
      reject(new Error('Geolocalização não é suportada por este navegador'));
      return;
    }

    console.log('Requesting geolocation permission...');
    console.log('Browser URL:', window.location.href);
    console.log('Is secure context:', window.isSecureContext);
    console.log('Hostname:', window.location.hostname);
    
    // Check if accessing via local IP and add specific logging
    const hostname = window.location.hostname;
    if (hostname.startsWith('192.168.') || hostname.startsWith('10.') || hostname.startsWith('172.')) {
      console.log('Accessing via local IP - geolocation may have browser restrictions');
      console.log('Some browsers require additional permissions for local network access');
    }
    
    // Check permission status first
    checkPermissionStatus();
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('Geolocation obtained successfully:', position);
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude,
          altitudeAccuracy: position.coords.altitudeAccuracy,
          heading: position.coords.heading,
          speed: position.coords.speed,
          timestamp: position.timestamp,
        });
      },
      (error) => {
        console.error('Geolocation error:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        
        let errorMessage = 'Erro ao obter geolocalização';
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            if (hostname.startsWith('192.168.') || hostname.startsWith('10.') || hostname.startsWith('172.')) {
              errorMessage = 'Permissão de geolocalização negada. Ao acessar via IP local (192.168.x.x), alguns navegadores exigem configurações adicionais. Tente: 1) Acessar via localhost, 2) Usar busca manual, 3) Configurar permissões do navegador para IPs locais.';
            } else {
              errorMessage = 'Permissão de geolocalização negada. O navegador pode ter bloqueado automaticamente. Tente: 1) Limpar permissões do site, 2) Usar HTTPS, 3) Verificar configurações de privacidade do navegador.';
            }
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Informações de localização indisponíveis. Verifique sua conexão GPS ou de rede.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Tempo limite excedido ao obter localização. Tente novamente.';
            break;
          default:
            errorMessage = `Erro desconhecido: ${error.message}`;
        }
        
        reject(new Error(errorMessage));
      },
      {
        enableHighAccuracy: false, // Changed to false for better compatibility
        timeout: 20000, // Increased timeout
        maximumAge: 0,
      }
    );
  });
}

/**
 * Watch position changes
 */
export function watchPosition(
  callback: (position: GeolocationPosition) => void,
  errorCallback?: (error: Error) => void
): number {
  if (typeof window === 'undefined' || !navigator.geolocation) {
    errorCallback?.(new Error('Geolocation is not supported by this browser'));
    return 0;
  }

  return navigator.geolocation.watchPosition(
    (position) => {
      callback({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        altitude: position.coords.altitude,
        altitudeAccuracy: position.coords.altitudeAccuracy,
        heading: position.coords.heading,
        speed: position.coords.speed,
        timestamp: position.timestamp,
      });
    },
    (error) => {
      errorCallback?.(new Error(`Geolocation error: ${error.message}`));
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    }
  );
}

/**
 * Stop watching position changes
 */
export function clearWatch(watchId: number): void {
  if (typeof window !== 'undefined' && navigator.geolocation) {
    navigator.geolocation.clearWatch(watchId);
  }
}

/**
 * Reverse geocoding using OpenStreetMap Nominatim API (free)
 */
export async function reverseGeocode(
  latitude: number,
  longitude: number
): Promise<ReverseGeocodingResult> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&accept-language=pt-BR`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'GaiaMonitor/1.0'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch reverse geocoding data');
    }
    
    const data = await response.json();
    console.log('Reverse geocoding result:', data);
    
    // Try multiple possible city fields from OpenStreetMap
    const city = data.address?.city || 
                 data.address?.town || 
                 data.address?.village || 
                 data.address?.municipality || 
                 data.address?.suburb ||
                 data.address?.county ||
                 data.name ||
                 'Desconhecido';
    
    console.log('Extracted city:', city);
    
    return {
      city: city,
      region: data.address?.state || data.address?.region || 'Desconhecido',
      country: data.address?.country || 'Desconhecido',
      formattedAddress: data.display_name || 'Local desconhecido',
    };
  } catch (error) {
    console.error('Error in reverse geocoding:', error);
    // Return default values on error
    return {
      city: 'Desconhecido',
      region: 'Desconhecido',
      country: 'Desconhecido',
      formattedAddress: 'Local desconhecido',
    };
  }
}

/**
 * Get complete location info (coordinates + address)
 */
export async function getLocationInfo(): Promise<{
  position: GeolocationPosition;
  address: ReverseGeocodingResult;
}> {
  const position = await getCurrentPosition();
  const address = await reverseGeocode(position.latitude, position.longitude);
  
  return {
    position,
    address,
  };
}

/**
 * Check if geolocation should work in current context
 */
export function checkGeolocationContext(): { 
  canWork: boolean; 
  reason?: string; 
  instructions?: string;
} {
  if (typeof window === 'undefined') {
    return {
      canWork: false,
      reason: 'Geolocalização não funciona em server-side rendering',
      instructions: 'A geolocalização só funciona no navegador do cliente'
    };
  }

  if (!navigator.geolocation) {
    return {
      canWork: false,
      reason: 'Navegador não suporta geolocalização',
      instructions: 'Atualize seu navegador para uma versão mais recente'
    };
  }

  const hostname = window.location.hostname;
  const protocol = window.location.protocol;
  const isSecureContext = window.isSecureContext;
  
  console.log('Geolocation context check:', { hostname, protocol, isSecureContext });
  
  // More permissive localhost detection - including all private IP ranges
  const isLocalhost = hostname === 'localhost' || 
                      hostname === '127.0.0.1' ||
                      hostname === '0.0.0.0' ||
                      hostname === '' ||
                      hostname.startsWith('192.168.') ||
                      hostname.startsWith('10.') ||
                      hostname.startsWith('172.') ||
                      hostname.startsWith('localhost:') ||
                      // Check if it's a local IP (basic validation)
                      /^192\.168\./.test(hostname) ||
                      /^10\./.test(hostname) ||
                      /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(hostname);
  
  const isHTTPS = protocol === 'https:';
  
  console.log('Context detection:', { isLocalhost, isHTTPS, isSecureContext });

  // In development, be more permissive
  if (isLocalhost) {
    console.log('Running on localhost/local network, geolocation should work');
    return {
      canWork: true,
      reason: 'Desenvolvimento em rede local - geolocalização permitida'
    };
  }

  if (!isHTTPS) {
    return {
      canWork: false,
      reason: 'Geolocalização requer HTTPS em produção',
      instructions: 'Em produção, use HTTPS. Em desenvolvimento, use localhost ou IP local (192.168.x.x)'
    };
  }

  if (!isSecureContext) {
    return {
      canWork: false,
      reason: 'Contexto não seguro',
      instructions: 'A geolocalização requer um contexto seguro (HTTPS)'
    };
  }

  return {
    canWork: true,
    reason: 'Contexto adequado para geolocalização'
  };
}