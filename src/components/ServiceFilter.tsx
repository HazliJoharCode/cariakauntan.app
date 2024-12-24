import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ServiceFilterProps {
  services: string[];
  selectedServices: string[];
  onChange: (services: string[]) => void;
}

export default function ServiceFilter({ services, selectedServices, onChange }: ServiceFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleService = (service: string) => {
    if (selectedServices.includes(service)) {
      onChange(selectedServices.filter(s => s !== service));
    } else {
      onChange([...selectedServices, service]);
    }
    setIsOpen(false);
  };

  const FilterContent = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-2">
        {services.map((service) => (
          <Button
            key={service}
            variant={selectedServices.includes(service) ? "default" : "outline"}
            className={cn(
              "justify-start h-auto py-3 px-4",
              "hover:bg-accent hover:text-accent-foreground",
              "transition-colors duration-200",
              selectedServices.includes(service) && "bg-primary text-primary-foreground"
            )}
            onClick={() => toggleService(service)}
          >
            <div className="flex flex-col items-start">
              <span className="font-medium">{service}</span>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );

  // Mobile view
  const MobileFilter = () => (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="md:hidden">
          <Filter className="h-4 w-4 mr-2" />
          Filter Services
          {selectedServices.length > 0 && (
            <span className="ml-2 rounded-full bg-primary text-primary-foreground w-5 h-5 text-xs flex items-center justify-center">
              {selectedServices.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Filter Services</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-8rem)] mt-4 pr-4">
          <FilterContent />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );

  // Desktop view
  const DesktopFilter = () => (
    <div className="hidden md:block space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Services</h2>
        {selectedServices.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onChange([])}
            className="text-muted-foreground hover:text-foreground"
          >
            Clear all
          </Button>
        )}
      </div>
      <ScrollArea className="h-[calc(100vh-15rem)]">
        <FilterContent />
      </ScrollArea>
    </div>
  );

  return (
    <>
      <MobileFilter />
      <DesktopFilter />
    </>
  );
}