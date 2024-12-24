import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Users, Newspaper, Building2 } from 'lucide-react';

interface NavigationMenuProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  isModerator: boolean;
  isAuthenticated: boolean;
}

export function NavigationMenu({
  currentView,
  setCurrentView,
  isModerator,
  isAuthenticated
}: NavigationMenuProps) {
  return (
    <nav className="hidden md:flex items-center gap-2">
      <Button
        variant="ghost"
        onClick={() => setCurrentView('search')}
        className="h-9 hover:bg-primary hover:text-primary-foreground"
      >
        Find Accountants
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost"
            className="h-9 gap-1 hover:bg-primary hover:text-primary-foreground"
          >
            Resources
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Knowledge Hub</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setCurrentView('community')} className="gap-2">
            <Users className="h-4 w-4" />
            Community
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setCurrentView('media')} className="gap-2">
            <Newspaper className="h-4 w-4" />
            Media
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setCurrentView('mergers')} className="gap-2">
            <Building2 className="h-4 w-4" />
            Firm M&A
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {isModerator && (
        <Button
          variant="ghost"
          onClick={() => setCurrentView('moderator')}
          className="h-9 hover:bg-primary hover:text-primary-foreground"
        >
          Moderator
        </Button>
      )}
      
      {isAuthenticated && (
        <Button
          variant="ghost"
          onClick={() => setCurrentView('profile')}
          className="h-9 hover:bg-primary hover:text-primary-foreground"
        >
          My Profile
        </Button>
      )}
    </nav>
  );
}