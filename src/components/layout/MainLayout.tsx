'use client';

import { useEffect, useState } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { useUIStore } from '@/stores/uiStore';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { sidebarOpen } = useUIStore();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Calculate margin based on sidebar state and screen size
  const getMarginLeft = () => {
    if (isMobile) return '0';
    return sidebarOpen ? '20rem' : '5rem'; // 5rem = 80px (sidebar minimizado)
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div 
        className="transition-all duration-300"
        style={{
          marginLeft: getMarginLeft()
        }}
      >
        <Topbar />
        <main className="pt-16">
          {children}
        </main>
      </div>
    </div>
  );
}