import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, MapPin, Compass, RefreshCw, X } from 'lucide-react';
import { api } from '../services/api';
import { City, Dish } from '../types';
import { InteractiveMap } from '../components/InteractiveMap';
import { FoodCard } from '../components/FoodCard';

export const ExplorePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialCuisine = searchParams.get('cuisine') || '';
  const initialDietary = searchParams.get('dietary') || '';

  const [cities, setCities] = useState<City[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCuisine, setSelectedCuisine] = useState(initialCuisine);
  const [selectedDietary, setSelectedDietary] = useState(initialDietary);
  const [loading, setLoading] = useState<boolean>(true);

  // Load cities & initial dishes
  useEffect(() => {
    async function initData() {
      setLoading(true);
      try {
        const [citiesData, dishesData] = await Promise.all([
          api.getCities(),
          api.getDishes({
            search: initialQuery || undefined,
            cuisine: initialCuisine || undefined,
            dietary: initialDietary || undefined,
          })
        ]);
        setCities(citiesData);
        setDishes(dishesData);

        // If query matches a city name, select it automatically
        if (initialQuery) {
          const match = citiesData.find(
            c => c.name.toLowerCase().includes(initialQuery.toLowerCase()) ||
                 c.state.toLowerCase().includes(initialQuery.toLowerCase())
          );
          if (match) setSelectedCity(match);
        }
      } catch (err) {
        console.error('Failed to load explore data:', err);
      } finally {
        setLoading(false);
      }
    }
    initData();
  }, []);

  // Filter dishes whenever filters change
  const handleApplyFilters = async (q: string, cuisine: string, dietary: string, cityId?: number) => {
    setLoading(true);
    try {
      const filtered = await api.getDishes({
        search: q || undefined,
        cuisine: cuisine || undefined,
        dietary: dietary || undefined,
        city_id: cityId,
      });
      setDishes(filtered);

      // Update URL params
      const params: Record<string, string> = {};
      if (q) params.q = q;
      if (cuisine) params.cuisine = cuisine;
      if (dietary) params.dietary = dietary;
      setSearchParams(params);
    } catch (err) {
      console.error('Failed to filter dishes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCitySelect = (city: City) => {
    setSelectedCity(city);
    handleApplyFilters(searchQuery, selectedCuisine, selectedDietary, city.id);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCuisine('');
    setSelectedDietary('');
    setSelectedCity(null);
    setSearchParams({});
    handleApplyFilters('', '', '', undefined);
  };

  const cuisinesList = [
    'Hyderabadi', 'South Indian', 'Punjabi', 'Bengali', 'Maharashtrian',
    'North Indian', 'Awadhi', 'Rajasthani', 'Gujarati', 'Kerala Coastal', 'Kashmiri'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-brand-orange text-xs font-bold uppercase tracking-wider mb-1">
            <Compass className="w-4 h-4" />
            <span>Interactive Regional Food Map</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-brand-brown">
            Explore India by Flavour
          </h1>
          <p className="text-xs sm:text-sm text-brand-brown-muted mt-1 max-w-xl">
            Select a pin on the map or search by city, cuisine, or dish to discover signature regional specialties.
          </p>
        </div>

        {selectedCity && (
          <div className="flex items-center gap-2 bg-brand-cream border border-brand-orange/30 px-3.5 py-2 rounded-2xl shadow-subtle self-start md:self-auto">
            <MapPin className="w-4 h-4 text-brand-orange" />
            <div className="text-xs">
              <span className="font-bold text-brand-brown">{selectedCity.name}</span>
              <span className="text-brand-brown-muted"> ({selectedCity.state})</span>
            </div>
            <button
              onClick={() => {
                setSelectedCity(null);
                handleApplyFilters(searchQuery, selectedCuisine, selectedDietary, undefined);
              }}
              className="text-brand-brown-muted hover:text-brand-brown ml-2 font-bold"
              title="Clear city focus"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Interactive Map Component */}
      <div className="w-full">
        <InteractiveMap
          cities={cities}
          selectedCity={selectedCity}
          onSelectCity={handleCitySelect}
          dishes={dishes}
        />
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-brand-cream-dark shadow-subtle space-y-4">
        <div className="flex flex-col lg:flex-row gap-3">
          {/* Text Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-brown-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleApplyFilters(searchQuery, selectedCuisine, selectedDietary, selectedCity?.id);
                }
              }}
              placeholder="Search by city (e.g. Hyderabad), dish (e.g. Biryani), or ingredient..."
              className="w-full pl-10 pr-4 py-2.5 bg-brand-cream/40 border border-brand-cream-dark rounded-xl text-sm focus:outline-none focus:border-brand-orange text-brand-brown placeholder-brand-brown-muted/70"
            />
          </div>

          {/* Cuisine Selector */}
          <div className="w-full sm:w-48">
            <select
              value={selectedCuisine}
              onChange={(e) => {
                const c = e.target.value;
                setSelectedCuisine(c);
                handleApplyFilters(searchQuery, c, selectedDietary, selectedCity?.id);
              }}
              className="w-full px-3 py-2.5 bg-brand-cream/40 border border-brand-cream-dark rounded-xl text-sm focus:outline-none focus:border-brand-orange text-brand-brown font-medium"
            >
              <option value="">All Cuisines</option>
              {cuisinesList.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Dietary Selector */}
          <div className="w-full sm:w-44">
            <select
              value={selectedDietary}
              onChange={(e) => {
                const d = e.target.value;
                setSelectedDietary(d);
                handleApplyFilters(searchQuery, selectedCuisine, d, selectedCity?.id);
              }}
              className="w-full px-3 py-2.5 bg-brand-cream/40 border border-brand-cream-dark rounded-xl text-sm focus:outline-none focus:border-brand-orange text-brand-brown font-medium"
            >
              <option value="">All Dietary</option>
              <option value="Vegetarian">Vegetarian Only</option>
              <option value="Non-Vegetarian">Non-Vegetarian Only</option>
            </select>
          </div>

          {/* Search Action & Reset */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleApplyFilters(searchQuery, selectedCuisine, selectedDietary, selectedCity?.id)}
              className="px-5 py-2.5 bg-brand-orange hover:bg-brand-orange-hover text-white text-sm font-semibold rounded-xl shadow-xs transition-colors shrink-0"
            >
              Search
            </button>
            <button
              onClick={handleClearFilters}
              title="Reset all filters"
              className="p-2.5 bg-brand-cream hover:bg-brand-cream-dark/50 text-brand-brown rounded-xl transition-colors shrink-0"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Active Filter Chips */}
        {(searchQuery || selectedCuisine || selectedDietary || selectedCity) && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-brand-cream-dark text-xs">
            <span className="font-semibold text-brand-brown-muted">Active filters:</span>
            {searchQuery && (
              <span className="bg-brand-orange/10 text-brand-orange px-2.5 py-1 rounded-lg flex items-center gap-1 font-medium">
                Keyword: "{searchQuery}"
                <button onClick={() => { setSearchQuery(''); handleApplyFilters('', selectedCuisine, selectedDietary, selectedCity?.id); }}>&times;</button>
              </span>
            )}
            {selectedCuisine && (
              <span className="bg-brand-green/10 text-brand-green px-2.5 py-1 rounded-lg flex items-center gap-1 font-medium">
                Cuisine: {selectedCuisine}
                <button onClick={() => { setSelectedCuisine(''); handleApplyFilters(searchQuery, '', selectedDietary, selectedCity?.id); }}>&times;</button>
              </span>
            )}
            {selectedDietary && (
              <span className="bg-stone-200 text-brand-brown px-2.5 py-1 rounded-lg flex items-center gap-1 font-medium">
                {selectedDietary}
                <button onClick={() => { setSelectedDietary(''); handleApplyFilters(searchQuery, selectedCuisine, '', selectedCity?.id); }}>&times;</button>
              </span>
            )}
            {selectedCity && (
              <span className="bg-brand-orange text-white px-2.5 py-1 rounded-lg flex items-center gap-1 font-medium">
                City: {selectedCity.name}
                <button onClick={() => { setSelectedCity(null); handleApplyFilters(searchQuery, selectedCuisine, selectedDietary, undefined); }}>&times;</button>
              </span>
            )}
            <button
              onClick={handleClearFilters}
              className="text-brand-orange hover:underline text-xs font-semibold ml-2"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Results Header and Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl font-bold text-brand-brown">
            {selectedCity
              ? `Dishes in ${selectedCity.name} (${dishes.length})`
              : `Regional Food Discoveries (${dishes.length})`}
          </h2>
          <span className="text-xs text-brand-brown-muted">
            Showing authentic verified regional dishes
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-80 bg-white rounded-2xl border border-brand-cream-dark animate-pulse" />
            ))}
          </div>
        ) : dishes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {dishes.map((dish) => (
              <FoodCard key={dish.id} dish={dish} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-brand-cream-dark shadow-subtle space-y-4">
            <div className="w-16 h-16 rounded-full bg-brand-cream mx-auto flex items-center justify-center text-brand-orange">
              <Compass className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-xl font-bold text-brand-brown">
              No Dishes Found Matching Your Criteria
            </h3>
            <p className="text-xs text-brand-brown-muted max-w-md mx-auto">
              We couldn't find any regional food matching your filters. Try clearing the search or exploring a different city.
            </p>
            <button
              onClick={handleClearFilters}
              className="px-5 py-2.5 bg-brand-orange text-white text-xs font-semibold rounded-xl hover:bg-brand-orange-hover"
            >
              Reset Filters & Show All
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

