import { useState } from 'react';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { accountants } from '@/data/accountants';
import { Card } from '@/components/ui/card';

export default function SimpleMap() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAccountant, setSelectedAccountant] = useState<typeof accountants[0] | null>(null);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="h-9"
        >
          <MapPin className="h-4 w-4 mr-2" />
          View Locations
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="left" 
        className="w-full sm:max-w-xl p-0 bg-background"
      >
        <SheetHeader className="p-6 border-b">
          <SheetTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Accountant Locations
          </SheetTitle>
        </SheetHeader>
        <div className="h-[calc(100vh-5rem)] overflow-auto p-4 space-y-4">
          {accountants.map((accountant) => (
            <Card 
              key={accountant.id} 
              className="p-4 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedAccountant(accountant)}
            >
              <h3 className="font-semibold">{accountant.name}</h3>
              <p className="text-sm text-muted-foreground">{accountant.company}</p>
              <p className="text-sm mt-2">{accountant.location}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {accountant.services.map((service) => (
                  <span
                    key={service}
                    className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}