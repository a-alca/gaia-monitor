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

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div 
        className="transition-all duration-300"
        style={{
          marginLeft: (!isMobile && sidebarOpen) ? '20rem' : '0'
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