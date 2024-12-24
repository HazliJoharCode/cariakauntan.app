import { Marker, Popup } from 'react-leaflet';
import { divIcon } from 'leaflet';
import type { Accountant } from '@/data/accountants';
import { Card } from '../ui/card';

interface MapMarkerProps {
  accountant: Accountant;
}

export function MapMarker({ accountant }: MapMarkerProps) {
  const icon = divIcon({
    className: 'custom-marker',
    html: `
      <div class="marker-container bg-primary text-primary-foreground">
        <span class="marker-label">${accountant.services[0].slice(0, 2)}</span>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });

  return (
    <Marker 
      position={[parseFloat(accountant.coordinates[0]), parseFloat(accountant.coordinates[1])]}
      icon={icon}
    >
      <Popup>
        <Card className="p-3 min-w-[200px]">
          <h3 className="font-bold text-lg mb-1">{accountant.name}</h3>
          <p className="text-sm text-muted-foreground mb-2">{accountant.company}</p>
          <div className="space-y-2 text-sm">
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
            <p className="text-muted-foreground">
              {accountant.location}
            </p>
            <p>
              <span className="font-medium">Contact:</span> {accountant.phone}
            </p>
          </div>
        </Card>
      </Popup>
    </Marker>
  );
}