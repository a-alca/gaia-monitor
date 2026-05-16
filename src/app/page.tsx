import { MainLayout } from '@/components/layout/MainLayout';
import { HeroSection } from '@/components/dashboard/HeroSection';
import { ClimateWidget } from '@/components/widgets/ClimateWidget';
import { WildfireWidget } from '@/components/widgets/WildfireWidget';
import { AirQualityWidget } from '@/components/widgets/AirQualityWidget';
import { EventsWidget } from '@/components/widgets/EventsWidget';
import { NewsWidget } from '@/components/widgets/NewsWidget';
import { MapWidget } from '@/components/widgets/MapWidget';

export default function Home() {
  return (
    <MainLayout>
      <div className="p-4 lg:p-6">
        <HeroSection />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mb-6">
          <div className="lg:col-span-2 order-2 lg:order-1">
            <MapWidget />
          </div>
          <div className="order-1 lg:order-2">
            <ClimateWidget />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-6">
          <WildfireWidget />
          <AirQualityWidget />
          <div className="md:col-span-2 lg:col-span-1">
            <EventsWidget />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          <NewsWidget />
        </div>
      </div>
    </MainLayout>
  );
}
