import React, { useState, useEffect } from 'react';
import { MapPin, Search } from 'lucide-react';
import { api } from '../services/api';
import { City } from '../types';
import { CityCard } from '../components/CityCard';

export const DestinationsPage: React.FC = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    async function loadCities() {
      setLoading(true);
      try {
        const data = await api.getCities({
          region: selectedRegion === 'All' ? undefined : selectedRegion,
          search: search || undefined
        });
        setCities(data);
      } catch (err) {
        console.error('Failed to load cities:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCities();
  }, [selectedRegion, search]);

  const regions = ['All', 'South', 'North', 'East', 'West'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-brand-green text-xs font-bold uppercase tracking-wider mb-1">
          <MapPin className="w-4 h-4" />
          <span>Indian Culinary Capitals</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-brand-brown">
          Explore Food Destinations
        </h1>
        <p className="text-xs sm:text-sm text-brand-brown-muted mt-1 max-w-xl">
          Travel across India's vibrant food landscapes. Every city is a living monument to centuries of spice trade, royal kitchens, and street mastery.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-brand-cream-dark shadow-subtle">
        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-brand-brown-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by city or state..."
            className="w-full pl-9 pr-3 py-2 bg-brand-cream/50 border border-brand-cream-dark rounded-xl text-xs focus:outline-none focus:border-brand-orange text-brand-brown"
          />
        </div>

        {/* Region Pills */}
        <div className="flex flex-wrap gap-1.5 bg-brand-cream p-1 rounded-xl border border-brand-cream-dark w-full sm:w-auto">
          {regions.map((region) => (
            <button
              key={region}
              onClick={() => setSelectedRegion(region)}
              className={`flex-1 sm:flex-none px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                selectedRegion === region
                  ? 'bg-white text-brand-orange shadow-xs'
                  : 'text-brand-brown-muted hover:text-brand-brown'
              }`}
            >
              {region === 'All' ? 'All Regions' : `${region} India`}
            </button>
          ))}
        </div>
      </div>

      {/* Cities Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-xl font-bold text-brand-brown">
            Supported Destinations ({cities.length})
          </h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-80 bg-white rounded-2xl border border-brand-cream-dark animate-pulse" />
            ))}
          </div>
        ) : cities.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cities.map((city) => (
              <CityCard key={city.id} city={city} />
            ))}
          </div>
        ) : (
          <div className="p-12 bg-white rounded-3xl border border-brand-cream-dark text-center space-y-3">
            <p className="font-serif text-lg font-bold text-brand-brown">No destinations found</p>
            <p className="text-xs text-brand-brown-muted">Try clearing your search keyword.</p>
            <button
              onClick={() => { setSearch(''); setSelectedRegion('All'); }}
              className="px-4 py-2 bg-brand-orange text-white text-xs font-semibold rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

