import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Heart, Compass, Utensils, ArrowLeft, ShieldAlert, Store } from 'lucide-react';
import { api } from '../services/api';
import { CityDetail } from '../types';
import { useFavorites } from '../hooks/useFavorites';
import { FoodCard } from '../components/FoodCard';
import { CityCard } from '../components/CityCard';

export const DestinationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isCityFavorite, toggleCityFavorite } = useFavorites();
  const [city, setCity] = useState<CityDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState<boolean>(false);

  useEffect(() => {
    async function loadCity() {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const data = await api.getCity(parseInt(id, 10));
        setCity(data);
        setImageError(false);
      } catch (err: any) {
        setError(err.message || 'Failed to load destination details.');
      } finally {
        setLoading(false);
      }
    }
    loadCity();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 animate-pulse space-y-6">
        <div className="h-6 w-32 bg-brand-cream-dark/50 rounded-lg" />
        <div className="h-96 w-full bg-brand-cream-dark/40 rounded-3xl" />
      </div>
    );
  }

  if (error || !city) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 mx-auto flex items-center justify-center">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-brand-brown">Destination Not Found</h2>
        <p className="text-xs text-brand-brown-muted">{error || "The destination requested could not be located."}</p>
        <button
          onClick={() => navigate('/destinations')}
          className="px-5 py-2.5 bg-brand-orange text-white text-xs font-semibold rounded-xl"
        >
          Back to Destinations
        </button>
      </div>
    );
  }

  const isFav = isCityFavorite(city.id);
  const fallbackBanner = "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1400&q=80";

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-brown-muted hover:text-brand-orange transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
      </div>

      {/* Destination Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-card border border-brand-cream-dark aspect-[21/9] min-h-[300px]">
        <img
          src={imageError || !city.banner_image ? fallbackBanner : city.banner_image}
          alt={city.name}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-brown/90 via-brand-brown/40 to-transparent" />

        {/* Favorite Button */}
        <button
          onClick={() => toggleCityFavorite(city)}
          title={isFav ? "Remove city from favorites" : "Save destination to favorites"}
          className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md shadow-md transition-transform active:scale-95 ${
            isFav
              ? 'bg-brand-orange text-white'
              : 'bg-white/90 hover:bg-white text-brand-brown hover:text-brand-orange'
          }`}
        >
          <Heart className={`w-5 h-5 ${isFav ? 'fill-current' : ''}`} />
        </button>

        {/* Content Overlay */}
        <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-brand-green text-white text-xs font-bold px-3 py-1 rounded-full">
              {city.region} India
            </span>
            <span className="bg-brand-brown/70 backdrop-blur-sm text-xs font-medium px-3 py-1 rounded-full text-brand-cream">
              Lat: {city.latitude.toFixed(4)}, Lon: {city.longitude.toFixed(4)}
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl font-extrabold tracking-tight">
            {city.name}
          </h1>
          <p className="text-sm sm:text-base text-brand-cream/90 font-medium">
            {city.state}, India
          </p>
        </div>
      </div>

      {/* Cuisine Overview Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="p-6 bg-white rounded-3xl border border-brand-cream-dark shadow-subtle space-y-3">
            <h2 className="font-serif text-2xl font-bold text-brand-brown flex items-center gap-2">
              <Compass className="w-5 h-5 text-brand-orange" />
              <span>Regional Cuisine Overview</span>
            </h2>
            <p className="text-sm text-brand-brown-muted leading-relaxed">
              {city.description}
            </p>
          </div>
        </div>

        {/* Quick Facts Sidebar */}
        <div className="space-y-4">
          <div className="p-6 bg-brand-cream rounded-3xl border border-brand-cream-dark space-y-3">
            <h3 className="font-serif text-lg font-bold text-brand-brown">
              Destination At a Glance
            </h3>
            <ul className="space-y-2 text-xs text-brand-brown">
              <li className="flex justify-between py-1 border-b border-brand-cream-dark">
                <span className="text-brand-brown-muted">State:</span>
                <span className="font-bold">{city.state}</span>
              </li>
              <li className="flex justify-between py-1 border-b border-brand-cream-dark">
                <span className="text-brand-brown-muted">Geographic Region:</span>
                <span className="font-bold">{city.region} India</span>
              </li>
              <li className="flex justify-between py-1 border-b border-brand-cream-dark">
                <span className="text-brand-brown-muted">Catalogued Signature Dishes:</span>
                <span className="font-bold text-brand-orange">{city.signature_dishes.length}</span>
              </li>
            </ul>
            <Link
              to={`/explore?q=${encodeURIComponent(city.name)}`}
              className="mt-3 block w-full py-2.5 bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-semibold text-center rounded-xl transition-colors"
            >
              View on Interactive Map
            </Link>
          </div>
        </div>
      </div>

      {/* Signature Dishes of this City */}
      <section className="space-y-4 pt-6 border-t border-brand-cream-dark">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-2xl font-bold text-brand-brown flex items-center gap-2">
              <Utensils className="w-5 h-5 text-brand-orange" />
              <span>Signature Dishes of {city.name}</span>
            </h2>
            <p className="text-xs text-brand-brown-muted mt-0.5">
              Iconic culinary creations born or perfected in {city.name}
            </p>
          </div>
        </div>

        {city.signature_dishes && city.signature_dishes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {city.signature_dishes.map((dish) => (
              <FoodCard key={dish.id} dish={dish} />
            ))}
          </div>
        ) : (
          <p className="text-xs text-brand-brown-muted italic">
            No signature dishes catalogued for this city yet.
          </p>
        )}
      </section>

      {/* Sample Eateries in City */}
      {city.places && city.places.length > 0 && (
        <section className="space-y-4 pt-6 border-t border-brand-cream-dark">
          <div>
            <h2 className="font-serif text-2xl font-bold text-brand-brown flex items-center gap-2">
              <Store className="w-5 h-5 text-brand-green" />
              <span>Places to Explore in {city.name}</span>
            </h2>
            <p className="text-xs text-brand-brown-muted mt-0.5">
              Curated locations for experiencing authentic regional flavours
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {city.places.map((place) => (
              <div
                key={place.id}
                className="p-5 bg-white rounded-2xl border border-brand-cream-dark shadow-subtle space-y-2"
              >
                <div className="flex items-start justify-between">
                  <h4 className="font-serif font-bold text-base text-brand-brown">
                    {place.name}
                  </h4>
                  {place.is_sample && (
                    <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                      Sample Data
                    </span>
                  )}
                </div>
                <p className="text-xs text-brand-brown-muted flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-brand-orange shrink-0" />
                  {place.address}
                </p>
                {place.notes && (
                  <p className="text-xs text-brand-brown-muted italic bg-brand-cream/50 p-2.5 rounded-xl">
                    "{place.notes}"
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Related Culinary Destinations */}
      {city.related_cities && city.related_cities.length > 0 && (
        <section className="space-y-4 pt-6 border-t border-brand-cream-dark">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-2xl font-bold text-brand-brown">
                Related Destinations in {city.region} India
              </h2>
              <p className="text-xs text-brand-brown-muted mt-0.5">
                Continue your regional food journey across neighbouring states
              </p>
            </div>
            <Link to="/destinations" className="text-xs font-semibold text-brand-orange hover:underline">
              View all cities &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {city.related_cities.map((relCity) => (
              <CityCard key={relCity.id} city={relCity} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

