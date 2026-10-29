import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home, MapPin } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-12 border border-brand-cream-dark shadow-subtle space-y-6">
        <div className="w-20 h-20 rounded-full bg-brand-orange-light text-brand-orange mx-auto flex items-center justify-center font-serif text-3xl font-extrabold">
          404
        </div>
        <div className="space-y-2">
          <h1 className="font-serif text-3xl font-bold text-brand-brown">
            Tastebuds Off the Map!
          </h1>
          <p className="text-xs sm:text-sm text-brand-brown-muted leading-relaxed">
            We couldn't find the dish or destination you were looking for. Perhaps it's a hidden recipe waiting to be discovered!
          </p>
        </div>
        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-semibold rounded-xl transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </Link>
          <Link
            to="/explore"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-brand-cream hover:bg-brand-cream-dark text-brand-brown text-xs font-semibold rounded-xl transition-all"
          >
            <Compass className="w-4 h-4 text-brand-orange" />
            <span>Open Map</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

