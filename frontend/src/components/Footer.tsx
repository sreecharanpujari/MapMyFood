import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShieldCheck, MapPin, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-brown text-brand-cream border-t border-brand-brown-light/40 pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-brand-brown-light/30">
          {/* Brand Vision */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-brand-orange flex items-center justify-center text-white">
                <img src="/logo.svg" alt="Map My Food" className="w-6 h-6 brightness-200" />
              </div>
              <span className="font-serif text-2xl font-bold text-white tracking-tight">
                Map My Food
              </span>
            </div>
            <p className="text-sm text-brand-cream/80 max-w-md leading-relaxed">
              India's Flavours, One Place at a Time. An interactive food discovery platform mapping authentic regional culinary traditions, iconic dishes, and cultural food heritage across India.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-brand-green bg-brand-green-dark/20 border border-brand-green/30 px-3.5 py-2 rounded-xl max-w-fit">
              <ShieldCheck className="w-4 h-4 shrink-0 text-brand-green" />
              <span>Dedicated to cultural culinary documentation and authentic origin discovery.</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif font-bold text-white text-base mb-4 tracking-wide">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm text-brand-cream/80">
              <li>
                <Link to="/explore" className="hover:text-brand-orange transition-colors">
                  Interactive Food Map
                </Link>
              </li>
              <li>
                <Link to="/dishes" className="hover:text-brand-orange transition-colors">
                  All Regional Dishes
                </Link>
              </li>
              <li>
                <Link to="/destinations" className="hover:text-brand-orange transition-colors">
                  Indian Culinary Cities
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="hover:text-brand-orange transition-colors">
                  Saved Favorites
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-brand-orange transition-colors">
                  About Our Mission
                </Link>
              </li>
            </ul>
          </div>

          {/* Data Transparency & Attribution */}
          <div>
            <h4 className="font-serif font-bold text-white text-base mb-4 tracking-wide">
              Transparency
            </h4>
            <p className="text-xs text-brand-cream/70 leading-relaxed mb-3">
              We separate culinary origin documentation from restaurant recommendations. Sample eatery records are explicitly flagged. No fake ratings, sponsored rankings, or invented partnerships.
            </p>
            <div className="text-xs text-brand-cream/60 space-y-1">
              <p>
                Map tiles: &copy;{' '}
                <a
                  href="https://www.openstreetmap.org/copyright"
                  target="_blank"
                  rel="noreferrer"
                  className="text-brand-orange hover:underline inline-flex items-center gap-0.5"
                >
                  OpenStreetMap contributors <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </p>
              <p>Built with React, TypeScript, Leaflet & FastAPI.</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-brand-cream/60 gap-4">
          <p>&copy; {new Date().getFullYear()} Map My Food. Celebrating India's culinary heritage.</p>
          <div className="flex items-center gap-1 text-xs">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-brand-orange fill-current" />
            <span>for lovers of Indian cuisine</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

