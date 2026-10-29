import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Navigation, Compass, AlertCircle, ExternalLink } from 'lucide-react';
import { City, Dish } from '../types';
import { Link } from 'react-router-dom';

// Create custom SVG Leaflet marker icons with brand styling
const createCustomIcon = (isSelected: boolean, isUserLocation: boolean = false) => {
  const pinColor = isUserLocation ? '#138A72' : isSelected ? '#E85924' : '#FF6B35';
  const size = isSelected ? 42 : 34;

  const svgHtml = isUserLocation
    ? `<div style="background-color: #138A72; width: 22px; height: 22px; border-radius: 50%; border: 3px solid #FFFFFF; box-shadow: 0 0 12px rgba(19, 138, 114, 0.6); position: relative;">
         <div style="width: 8px; height: 8px; background-color: #FFFFFF; border-radius: 50%; position: absolute; top: 4px; left: 4px;"></div>
       </div>`
    : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 44" width="${size}" height="${size}" style="filter: drop-shadow(0 3px 6px rgba(36,26,21,0.3)); cursor: pointer;">
        <path d="M16 0 C7.16 0 0 7.16 0 16 C0 28 16 44 16 44 C16 44 32 28 32 16 C32 7.16 24.84 0 16 0 Z" fill="${pinColor}" />
        <circle cx="16" cy="15" r="7" fill="#FFF8EE" />
        <circle cx="16" cy="15" r="3.5" fill="${pinColor}" />
      </svg>`;

  return L.divIcon({
    html: svgHtml,
    className: 'custom-map-marker',
    iconSize: [size, size],
    iconAnchor: isUserLocation ? [11, 11] : [size / 2, size],
    popupAnchor: [0, -size + 8]
  });
};

// Component to dynamically re-center map view
const MapRecenter: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.2 });
  }, [center, zoom, map]);
  return null;
};

interface InteractiveMapProps {
  cities: City[];
  selectedCity: City | null;
  onSelectCity: (city: City) => void;
  dishes?: Dish[];
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  cities,
  selectedCity,
  onSelectCity,
  dishes = []
}) => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [mapError, setMapError] = useState<boolean>(false);

  // Default center: Geographical center of India
  const defaultCenter: [number, number] = [21.7679, 78.8718];
  const defaultZoom = 5;

  const currentCenter: [number, number] = selectedCity
    ? [selectedCity.latitude, selectedCity.longitude]
    : userLocation
    ? userLocation
    : defaultCenter;

  const currentZoom = selectedCity ? 11 : userLocation ? 9 : defaultZoom;

  const handleRequestLocation = () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserLocation([latitude, longitude]);
        setIsLocating(false);

        // Find nearest city from supported dataset
        let closestCity: City | null = null;
        let shortestDist = Infinity;

        cities.forEach((city) => {
          const dist = Math.hypot(city.latitude - latitude, city.longitude - longitude);
          if (dist < shortestDist) {
            shortestDist = dist;
            closestCity = city;
          }
        });

        if (closestCity) {
          onSelectCity(closestCity);
        }
      },
      (err) => {
        setIsLocating(false);
        if (err.code === err.PERMISSION_DENIED) {
          setGeoError('Location access was denied. You can still explore all Indian cities on the map freely!');
        } else {
          setGeoError('Unable to retrieve your current location. Please choose a city below.');
        }
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  };

  return (
    <div className="relative w-full h-[540px] rounded-3xl overflow-hidden border border-brand-cream-dark shadow-card bg-stone-100 flex flex-col">
      {/* Geolocation status / error alert */}
      {geoError && (
        <div className="absolute top-4 left-4 right-4 z-[1000] bg-white/95 backdrop-blur-md border border-amber-200 text-brand-brown text-xs px-4 py-2.5 rounded-xl shadow-card flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-brand-orange shrink-0" />
            <span>{geoError}</span>
          </div>
          <button
            onClick={() => setGeoError(null)}
            className="text-brand-brown-muted hover:text-brand-brown font-bold ml-2"
          >
            &times;
          </button>
        </div>
      )}

      {/* Map Control Buttons floating on top right */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
        <button
          onClick={handleRequestLocation}
          disabled={isLocating}
          title="Find Indian food near my location"
          className="bg-white hover:bg-brand-cream text-brand-brown text-xs font-semibold px-3 py-2.5 rounded-xl shadow-card border border-stone-200/80 flex items-center gap-2 transition-colors active:scale-95"
        >
          <Navigation className={`w-4 h-4 text-brand-green ${isLocating ? 'animate-spin' : ''}`} />
          <span>{isLocating ? 'Locating...' : 'Near Me'}</span>
        </button>

        <button
          onClick={() => {
            if (cities.length > 0) {
              const random = cities[Math.floor(Math.random() * cities.length)];
              onSelectCity(random);
            }
          }}
          title="Surprise me with an Indian food destination"
          className="bg-white hover:bg-brand-cream text-brand-brown text-xs font-semibold px-3 py-2.5 rounded-xl shadow-card border border-stone-200/80 flex items-center gap-2 transition-colors active:scale-95"
        >
          <Compass className="w-4 h-4 text-brand-orange" />
          <span>Random Place</span>
        </button>
      </div>

      {/* Map Tile Container */}
      {!mapError ? (
        <MapContainer
          center={currentCenter}
          zoom={currentZoom}
          scrollWheelZoom={false}
          className="w-full h-full z-10"
        >
          <MapRecenter center={currentCenter} zoom={currentZoom} />

          {/* OpenStreetMap standard free tiles with proper attribution */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={18}
          />

          {/* User Location Marker if available */}
          {userLocation && (
            <Marker position={userLocation} icon={createCustomIcon(false, true)}>
              <Popup>
                <div className="p-1 text-center font-sans">
                  <strong className="text-xs text-brand-green font-bold block mb-1">Your Location</strong>
                  <span className="text-[11px] text-brand-brown-muted">Exploring nearby regional dishes</span>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Markers for supported Indian cities */}
          {cities.map((city) => {
            const isSelected = selectedCity?.id === city.id;
            const cityDishes = dishes.filter((d) => d.city_id === city.id);

            return (
              <Marker
                key={city.id}
                position={[city.latitude, city.longitude]}
                icon={createCustomIcon(isSelected)}
                eventHandlers={{
                  click: () => onSelectCity(city)
                }}
              >
                <Popup className="food-map-popup">
                  <div className="p-1 max-w-[220px] font-sans">
                    <div className="flex items-center gap-1.5 mb-1">
                      <MapPin className="w-3.5 h-3.5 text-brand-orange" />
                      <h4 className="font-serif font-bold text-sm text-brand-brown">{city.name}</h4>
                    </div>
                    <p className="text-[11px] text-brand-green font-medium mb-1.5">
                      {city.state} &bull; {city.region} India
                    </p>
                    <p className="text-[11px] text-brand-brown-muted line-clamp-2 mb-2 leading-relaxed">
                      {city.description}
                    </p>

                    {cityDishes.length > 0 && (
                      <div className="mb-2 pt-1 border-t border-stone-200">
                        <span className="text-[10px] uppercase font-bold text-brand-brown-muted block mb-0.5">
                          Signature Food:
                        </span>
                        <span className="text-xs font-semibold text-brand-orange">
                          {cityDishes[0].name}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-1">
                      <Link
                        to={`/destinations/${city.id}`}
                        className="text-[11px] font-bold text-brand-green hover:underline flex items-center gap-1"
                      >
                        Destination Info <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      ) : (
        /* Graceful Fallback if map tiles fail to load */
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-brand-cream/60">
          <MapPin className="w-12 h-12 text-brand-orange mb-3" />
          <h3 className="font-serif text-lg font-bold text-brand-brown mb-1">Interactive Map Offline</h3>
          <p className="text-xs text-brand-brown-muted max-w-sm mb-4">
            Map tiles could not be reached right now. You can still discover every city and signature dish in our directory below.
          </p>
          <button
            onClick={() => setMapError(false)}
            className="text-xs font-semibold bg-brand-orange text-white px-4 py-2 rounded-xl"
          >
            Retry Map
          </button>
        </div>
      )}

      {/* Map Footer Bar with attribution */}
      <div className="bg-white/95 backdrop-blur-sm border-t border-brand-cream-dark px-4 py-2 flex items-center justify-between text-[11px] text-brand-brown-muted z-20">
        <span>
          Showing <strong>{cities.length}</strong> Indian culinary hubs &bull; Click any marker to view signature flavours
        </span>
        <span className="hidden sm:inline">
          Map data: &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer" className="underline hover:text-brand-brown">OpenStreetMap</a>
        </span>
      </div>
    </div>
  );
};

