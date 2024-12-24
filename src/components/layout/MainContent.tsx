import { Suspense, lazy } from 'react';
import { Loader2 } from 'lucide-react';
import { AccountantList } from '../accountants/AccountantList';
import ServiceFilter from '../ServiceFilter';
import CountryFilter from '../CountryFilter';
import { services } from '@/data/services';

// Lazy load views
const Profile = lazy(() => import('@/pages/Profile'));
const Media = lazy(() => import('@/pages/Media'));
const Community = lazy(() => import('@/pages/Community'));
const Mergers = lazy(() => import('@/pages/Mergers'));
const ModeratorDashboard = lazy(() => import('@/pages/ModeratorDashboard'));

const LoadingFallback = () => (
  <div className="flex justify-center items-center min-h-[50vh]">
    <Loader2 className="h-8 w-8 animate-spin" />
  </div>
);

interface MainContentProps {
  currentView: string;
  searchQuery: string;
  selectedServices: string[];
  selectedCountry: string | null;
  selectedRegion: string | null;
  onSelectServices: (services: string[]) => void;
  onSelectCountry: (country: string | null) => void;
  onSelectRegion: (region: string | null) => void;
}

export function MainContent({
  currentView,
  searchQuery,
  selectedServices,
  selectedCountry,
  selectedRegion,
  onSelectServices,
  onSelectCountry,
  onSelectRegion
}: MainContentProps) {
  if (currentView === 'search') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-4 md:gap-8">
        <aside className="space-y-4">
          <ServiceFilter
            services={services}
            selectedServices={selectedServices}
            onChange={onSelectServices}
          />
          <CountryFilter
            selectedCountry={selectedCountry}
            selectedRegion={selectedRegion}
            onSelectCountry={onSelectCountry}
            onSelectRegion={onSelectRegion}
          />
        </aside>

        <div className="space-y-4">
          <AccountantList
            searchQuery={searchQuery}
            selectedServices={selectedServices}
            selectedCountry={selectedCountry}
            selectedRegion={selectedRegion}
          />
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      {currentView === 'profile' && <Profile />}
      {currentView === 'media' && <Media />}
      {currentView === 'community' && <Community />}
      {currentView === 'mergers' && <Mergers />}
      {currentView === 'moderator' && <ModeratorDashboard />}
    </Suspense>
  );
}