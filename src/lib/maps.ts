import { accountants } from '@/data/accountants';

let googleMapsPromise: Promise<void> | null = null;
let scriptAdded = false;

// Load Google Maps script once
export function loadGoogleMaps(): Promise<void> {
  if (window.google?.maps) {
    return Promise.resolve();
  }

  if (googleMapsPromise) {
    return googleMapsPromise;
  }

  googleMapsPromise = new Promise((resolve, reject) => {
    try {
      if (!scriptAdded) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`;
        script.async = true;
        script.defer = true;
        script.id = 'google-maps-script';
        
        script.onload = () => {
          if (window.google?.maps) {
            resolve();
          } else {
            reject(new Error('Google Maps failed to initialize'));
          }
        };
        script.onerror = () => reject(new Error('Failed to load Google Maps'));
        
        document.head.appendChild(script);
        scriptAdded = true;
      } else {
        // If script was added but not loaded yet, wait for it
        const checkGoogle = () => {
          if (window.google?.maps) {
            resolve();
          } else {
            setTimeout(checkGoogle, 100);
          }
        };
        checkGoogle();
      }
    } catch (error) {
      reject(error);
    }
  });

  return googleMapsPromise;
}

// Convert address to coordinates using Google Geocoding API
export async function geocodeAddress(address: string): Promise<google.maps.LatLngLiteral | null> {
  try {
    await loadGoogleMaps();
    const geocoder = new google.maps.Geocoder();
    
    return new Promise((resolve) => {
      geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK' && results?.[0]?.geometry?.location) {
          const { lat, lng } = results[0].geometry.location;
          resolve({ lat: lat(), lng: lng() });
        } else {
          resolve(null);
        }
      });
    });
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}

// Create a custom marker with the accountant's info
export function createAccountantMarker(
  map: google.maps.Map,
  accountant: typeof accountants[0],
  position: google.maps.LatLngLiteral
): google.maps.Marker {
  const marker = new google.maps.Marker({
    position,
    map,
    title: accountant.name,
    animation: google.maps.Animation.DROP,
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 10,
      fillColor: '#000000',
      fillOpacity: 1,
      strokeWeight: 2,
      strokeColor: '#FFFFFF',
    }
  });

  const infoWindow = new google.maps.InfoWindow({
    content: `
      <div style="padding: 1rem; max-width: 300px;">
        <h3 style="font-weight: bold; margin-bottom: 0.5rem;">${accountant.name}</h3>
        <p style="color: #666; margin-bottom: 0.5rem;">${accountant.company}</p>
        <p style="font-size: 0.875rem; margin-bottom: 0.5rem;">${accountant.location}</p>
        <p style="font-size: 0.875rem; color: #666;">
          <strong>Services:</strong> ${accountant.services.join(', ')}
        </p>
        <p style="font-size: 0.875rem; margin-top: 0.5rem;">
          <strong>Contact:</strong> ${accountant.phone}
        </p>
      </div>
    `
  });

  marker.addListener('click', () => {
    infoWindow.open(map, marker);
  });

  return marker;
}

// Initialize the map with custom styling
export function initializeMap(element: HTMLElement): google.maps.Map {
  return new google.maps.Map(element, {
    center: { lat: 3.1390, lng: 101.6869 }, // Kuala Lumpur center
    zoom: 11,
    styles: [
      {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'transit',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{ color: '#e9e9e9' }]
      },
      {
        featureType: 'landscape',
        elementType: 'geometry',
        stylers: [{ color: '#f5f5f5' }]
      }
    ],
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    zoomControl: true,
    zoomControlOptions: {
      position: 4 // RIGHT_CENTER
    }
  });
}