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
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { divIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function AccountantMap() {
  const [isOpen, setIsOpen] = useState(false);
  const center: [number, number] = [3.1390, 101.6869];

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="h-9"
        >
          <MapPin className="h-4 w-4 mr-2" />
          AccountantMap
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
        <div className="h-[calc(100vh-5rem)]">
          <MapContainer
            center={center}
            zoom={11}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />
            {accountants.map((accountant) => (
              <Marker
                key={accountant.id}
                position={[
                  parseFloat(accountant.coordinates[0]),
                  parseFloat(accountant.coordinates[1])
                ]}
                icon={createCustomIcon(accountant.services)}
              >
                <Popup className="custom-popup">
                  <div className="p-3">
                    <h3 className="font-bold text-lg mb-1">{accountant.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{accountant.company}</p>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <span className="text-sm font-semibold">Services:</span>
                        <div className="flex flex-wrap gap-1">
                          {accountant.services.map((service) => (
                            <span
                              key={service}
                              className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary"
                            >
                              {service}
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className="text-sm">
                        <span className="font-semibold">Location:</span><br />
                        {accountant.location}
                      </p>
                      <p className="text-sm">
                        <span className="font-semibold">Contact:</span><br />
                        {accountant.phone}
                      </p>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Custom marker icon using CSS and HTML
const createCustomIcon = (services: string[]) => {
  const mainService = services[0];
  const color = getServiceColor(mainService);
  
  return divIcon({
    className: 'custom-marker',
    html: `
      <div class="marker-container" style="background-color: ${color}">
        <span class="marker-label">${mainService.slice(0, 2)}</span>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });
};

const getServiceColor = (service: string): string => {
  switch (service) {
    case 'Tax Planning':
      return 'hsl(var(--primary))';
    case 'Audit Services':
      return '#2563eb';
    case 'Financial Advisory':
      return '#16a34a';
    case 'Business Consulting':
      return '#9333ea';
    default:
      return 'hsl(var(--primary))';
  }
};