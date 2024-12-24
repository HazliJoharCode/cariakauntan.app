import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronDown, Users, Newspaper, Shield, User, Building2, Home } from 'lucide-react';
import { cn } from "@/lib/utils";
import { SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface MobileMenuProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  isModerator: boolean;
  isAuthenticated: boolean;
  onReturnHome?: () => void;
}

export function MobileMenu({
  currentView,
  setCurrentView,
  isModerator,
  isAuthenticated,
  onReturnHome
}: MobileMenuProps) {
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);

  return (
    <>
      <SheetHeader className="p-6 border-b">
        <SheetTitle>Menu</SheetTitle>
      </SheetHeader>
      <nav className="flex flex-col p-4 space-y-2">
        {onReturnHome && (
          <Button
            variant="ghost"
            onClick={() => {
              onReturnHome();
            }}
            className="justify-start h-12"
          >
            <Home className="mr-2 h-5 w-5" />
            Return Home
          </Button>
        )}

        <Button
          variant={currentView === 'search' ? 'default' : 'ghost'}
          onClick={() => setCurrentView('search')}
          className="justify-start h-12"
        >
          <Users className="mr-2 h-5 w-5" />
          Find Accountants
        </Button>

        <div className="space-y-1">
          <Button
            variant="ghost"
            onClick={() => setIsResourcesOpen(!isResourcesOpen)}
            className="justify-between w-full h-12"
          >
            <span className="flex items-center">
              <Newspaper className="mr-2 h-5 w-5" />
              Resources
            </span>
            <ChevronDown className={cn(
              "h-4 w-4 transition-transform duration-200",
              isResourcesOpen && "rotate-180"
            )} />
          </Button>

          <div className={cn(
            "grid transition-all",
            isResourcesOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          )}>
            <div className="overflow-hidden">
              <div className="pl-4 space-y-1 py-1">
                <Button
                  variant={currentView === 'community' ? 'default' : 'ghost'}
                  onClick={() => setCurrentView('community')}
                  className="justify-start w-full h-10"
                >
                  <Users className="mr-2 h-4 w-4" />
                  Community
                </Button>
                <Button
                  variant={currentView === 'media' ? 'default' : 'ghost'}
                  onClick={() => setCurrentView('media')}
                  className="justify-start w-full h-10"
                >
                  <Newspaper className="mr-2 h-4 w-4" />
                  Media
                </Button>
                <Button
                  variant={currentView === 'mergers' ? 'default' : 'ghost'}
                  onClick={() => setCurrentView('mergers')}
                  className="justify-start w-full h-10"
                >
                  <Building2 className="mr-2 h-4 w-4" />
                  Firm M&A
                </Button>
              </div>
            </div>
          </div>
        </div>

        {isModerator && (
          <Button
            variant={currentView === 'moderator' ? 'default' : 'ghost'}
            onClick={() => setCurrentView('moderator')}
            className="justify-start h-12"
          >
            <Shield className="mr-2 h-5 w-5" />
            Moderator
          </Button>
        )}
        
        {isAuthenticated && (
          <Button
            variant={currentView === 'profile' ? 'default' : 'ghost'}
            onClick={() => setCurrentView('profile')}
            className="justify-start h-12"
          >
            <User className="mr-2 h-5 w-5" />
            My Profile
          </Button>
        )}
      </nav>
    </>
  );
}