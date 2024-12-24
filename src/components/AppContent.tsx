import { useState } from 'react';
import { AccountantList } from './accountants/AccountantList';
import ServiceFilter from './ServiceFilter';
import CountryFilter from './CountryFilter';
import { Header } from './layout/Header';
import { services } from '@/data/services';
import { useAuth } from '@/hooks/useAuth';
import { MainContent } from './layout/MainContent';

export default function AppContent({ onReturnHome }: { onReturnHome?: () => void }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'search' | 'profile' | 'media' | 'community' | 'mergers' | 'moderator'>('search');
  const { user } = useAuth();
  const isModerator = user?.email === 'work@hazlijohar.com';

  return (
    <div className="min-h-screen bg-background">
      <Header 
        currentView={currentView}
        setCurrentView={setCurrentView}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isModerator={isModerator}
        isAuthenticated={!!user}
        onReturnHome={onReturnHome}
      />
      
      <main className="container mx-auto px-4 py-6 md:py-8">
        <MainContent 
          currentView={currentView}
          searchQuery={searchQuery}
          selectedServices={selectedServices}
          selectedCountry={selectedCountry}
          selectedRegion={selectedRegion}
          onSelectServices={setSelectedServices}
          onSelectCountry={setSelectedCountry}
          onSelectRegion={setSelectedRegion}
        />
      </main>
    </div>
  );
}