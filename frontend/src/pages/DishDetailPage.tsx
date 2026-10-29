import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, MapPin, Flame, Utensils, Sparkles, Store, ShieldAlert, ArrowLeft, Share2, Check } from 'lucide-react';
import { api } from '../services/api';
import { DishDetail } from '../types';
import { useFavorites } from '../hooks/useFavorites';
import { FoodCard } from '../components/FoodCard';

export const DishDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isDishFavorite, toggleDishFavorite } = useFavorites();
  const [dish, setDish] = useState<DishDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    async function loadDish() {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const data = await api.getDish(parseInt(id, 10));
        setDish(data);
        setImageError(false);
      } catch (err: any) {
        setError(err.message || 'Failed to load dish details.');
      } finally {
        setLoading(false);
      }
    }
    loadDish();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 animate-pulse space-y-6">
        <div className="h-6 w-32 bg-brand-cream-dark/50 rounded-lg" />
        <div className="h-96 w-full bg-brand-cream-dark/40 rounded-3xl" />
        <div className="h-10 w-2/3 bg-brand-cream-dark/50 rounded-xl" />
      </div>
    );
  }

  if (error || !dish) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 mx-auto flex items-center justify-center">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-brand-brown">Dish Not Found</h2>
        <p className="text-xs text-brand-brown-muted">{error || "The dish you requested could not be located."}</p>
        <button
          onClick={() => navigate('/dishes')}
          className="px-5 py-2.5 bg-brand-orange text-white text-xs font-semibold rounded-xl"
        >
          Back to Dishes
        </button>
      </div>
    );
  }

  const isFav = isDishFavorite(dish.id);
  const fallbackImage = "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1200&q=80";

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const ingredientsList = dish.key_ingredients
    ? dish.key_ingredients.split(',').map((s) => s.trim())
    : [];

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

      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Large Food Photography */}
        <div className="relative rounded-3xl overflow-hidden bg-brand-cream shadow-card border border-brand-cream-dark aspect-[4/3]">
          <img
            src={imageError || !dish.image_url ? fallbackImage : dish.image_url}
            alt={dish.name}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover"
          />

          {/* Dietary Badge */}
          <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-sm flex items-center gap-2">
            <div
              className={`w-3.5 h-3.5 border-2 rounded-xs flex items-center justify-center ${
                dish.dietary === 'Vegetarian' ? 'border-green-600' : 'border-red-700'
              }`}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full ${
                  dish.dietary === 'Vegetarian' ? 'bg-green-600' : 'bg-red-700'
                }`}
              />
            </div>
            <span className="text-xs font-semibold text-brand-brown">{dish.dietary}</span>
          </div>

          {/* Action buttons (Favorite & Share) */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              onClick={handleShare}
              title="Share dish link"
              className="p-3 bg-white/90 hover:bg-white text-brand-brown rounded-full shadow-md backdrop-blur-md transition-transform active:scale-95"
            >
              {copied ? <Check className="w-4 h-4 text-green-600" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              onClick={() => toggleDishFavorite(dish)}
              title={isFav ? "Remove from favorites" : "Save to favorites"}
              className={`p-3 rounded-full shadow-md backdrop-blur-md transition-transform active:scale-95 ${
                isFav
                  ? 'bg-brand-orange text-white'
                  : 'bg-white/90 hover:bg-white text-brand-brown hover:text-brand-orange'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Dish Metadata and Editorial Content */}
        <div className="space-y-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Link
                to={`/destinations/${dish.city_id}`}
                className="inline-flex items-center gap-1 bg-brand-orange-light text-brand-orange text-xs font-semibold px-3 py-1 rounded-full border border-brand-orange/20 hover:bg-brand-orange hover:text-white transition-colors"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>{dish.city_name}, {dish.state}</span>
              </Link>
              <span className="bg-brand-green-light text-brand-green text-xs font-semibold px-3 py-1 rounded-full">
                {dish.cuisine_type}
              </span>
              <span className="bg-brand-cream text-brand-brown text-xs font-semibold px-3 py-1 rounded-full border border-brand-cream-dark">
                {dish.category}
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-brand-brown">
              {dish.name}
            </h1>
          </div>

          {/* Quick Info Badges */}
          <div className="grid grid-cols-3 gap-3 p-4 bg-brand-cream/60 rounded-2xl border border-brand-cream-dark text-center">
            <div>
              <span className="text-[10px] uppercase font-bold text-brand-brown-muted block mb-0.5">
                Spice Intensity
              </span>
              <span className="text-xs font-semibold text-brand-brown flex items-center justify-center gap-1">
                <Flame className="w-3.5 h-3.5 text-brand-orange" />
                {dish.spice_level}
              </span>
            </div>
            <div className="border-x border-brand-cream-dark">
              <span className="text-[10px] uppercase font-bold text-brand-brown-muted block mb-0.5">
                Cuisine Style
              </span>
              <span className="text-xs font-semibold text-brand-brown">
                {dish.cuisine_type}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-brand-brown-muted block mb-0.5">
                Indian Region
              </span>
              <span className="text-xs font-semibold text-brand-brown">
                {dish.city_region || 'India'}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="font-serif font-bold text-brand-brown text-base">Description</h3>
            <p className="text-sm text-brand-brown-muted leading-relaxed">
              {dish.description}
            </p>
          </div>

          {/* Cultural Heritage Context */}
          {dish.cultural_context && (
            <div className="p-4 bg-white rounded-2xl border border-brand-cream-dark shadow-subtle space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-brand-green uppercase tracking-wide">
                <Sparkles className="w-4 h-4" />
                <span>Culinary Heritage & Story</span>
              </div>
              <p className="text-xs text-brand-brown leading-relaxed">
                {dish.cultural_context}
              </p>
            </div>
          )}

          {/* Key Ingredients */}
          {ingredientsList.length > 0 && (
            <div className="space-y-2.5">
              <h3 className="font-serif font-bold text-brand-brown text-base flex items-center gap-1.5">
                <Utensils className="w-4 h-4 text-brand-orange" />
                <span>Key Ingredients</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {ingredientsList.map((ing, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-medium text-brand-brown bg-white border border-brand-cream-dark px-3 py-1.5 rounded-xl shadow-xs"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Places to Try this Dish Section */}
      <section className="space-y-4 pt-6 border-t border-brand-cream-dark">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-2xl font-bold text-brand-brown flex items-center gap-2">
              <Store className="w-5 h-5 text-brand-orange" />
              <span>Where to Experience {dish.name}</span>
            </h2>
            <p className="text-xs text-brand-brown-muted mt-0.5">
              Curated eateries & locations known for this specialty
            </p>
          </div>
        </div>

        {dish.places_to_try && dish.places_to_try.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dish.places_to_try.map((place) => (
              <div
                key={place.id}
                className="p-5 bg-white rounded-2xl border border-brand-cream-dark shadow-subtle space-y-2"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-serif font-bold text-base text-brand-brown">
                      {place.name}
                    </h4>
                    <p className="text-xs text-brand-brown-muted flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-brand-orange shrink-0" />
                      {place.address}
                    </p>
                  </div>
                  {place.is_sample && (
                    <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                      Sample Data
                    </span>
                  )}
                </div>

                {place.notes && (
                  <p className="text-xs text-brand-brown-muted italic bg-brand-cream/50 p-2.5 rounded-xl">
                    "{place.notes}"
                  </p>
                )}

                <div className="pt-2 flex items-center justify-between text-xs text-brand-brown-muted">
                  <span>Price Range: <strong>{place.price_range}</strong></span>
                  <Link
                    to={`/destinations/${dish.city_id}`}
                    className="text-xs font-semibold text-brand-green hover:underline"
                  >
                    View in {dish.city_name} &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 bg-white rounded-2xl border border-brand-cream-dark text-center text-xs text-brand-brown-muted">
            Specific restaurant listings for this dish are currently undergoing verification.
          </div>
        )}
      </section>

      {/* Related Regional Dishes */}
      {dish.related_dishes && dish.related_dishes.length > 0 && (
        <section className="space-y-4 pt-6 border-t border-brand-cream-dark">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-2xl font-bold text-brand-brown">
                Related Regional Specialties
              </h2>
              <p className="text-xs text-brand-brown-muted mt-0.5">
                Explore similar flavours from {dish.city_name} and {dish.cuisine_type} cuisine
              </p>
            </div>
            <Link to="/dishes" className="text-xs font-semibold text-brand-orange hover:underline">
              Browse all dishes &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {dish.related_dishes.map((relDish) => (
              <FoodCard key={relDish.id} dish={relDish} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

