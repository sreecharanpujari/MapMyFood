import React from 'react';
import { ShieldCheck, MapPin, Compass, Info, Heart, Database, Code2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Title */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-orange-light text-brand-orange text-xs font-semibold">
          <Info className="w-4 h-4" />
          <span>Our Vision & Philosophy</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-black text-brand-brown">
          About Map My Food
        </h1>
        <p className="text-base text-brand-brown-muted max-w-2xl mx-auto leading-relaxed">
          Preserving and mapping India's regional culinary heritage, one authentic dish at a time.
        </p>
      </div>

      {/* Product Vision Card */}
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-brand-cream-dark shadow-subtle space-y-6">
        <h2 className="font-serif text-2xl font-bold text-brand-brown">
          The Core Idea
        </h2>
        <div className="p-6 bg-brand-cream rounded-2xl border border-brand-cream-dark text-center font-serif text-xl sm:text-2xl font-bold text-brand-orange italic">
          "Explore a place. Discover its signature food. Find where to eat it."
        </div>
        <p className="text-sm text-brand-brown-muted leading-relaxed">
          India's culinary diversity is breathtaking. Crossing a state border—or sometimes just a district—reveals vastly different spice blends, grains, fermentation techniques, and cultural dining customs. 
        </p>
        <p className="text-sm text-brand-brown-muted leading-relaxed">
          Map My Food was designed from the ground up as a geographic culinary discovery tool. Rather than treating dishes as isolated recipes, we connect food to geography, history, and community roots: from Hyderabadi Dum Biryani and Chennai's crisp Masala Dosa to Amritsar's coal-baked Kulcha and Kolkata's Nizam-era Kathi Rolls.
        </p>
      </div>

      {/* Data Integrity & Sample Data Transparency */}
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-brand-cream-dark shadow-subtle space-y-6">
        <div className="flex items-center gap-2 text-brand-green font-bold text-lg font-serif">
          <ShieldCheck className="w-6 h-6 text-brand-green" />
          <span>Our Transparency & Data Policy</span>
        </div>

        <div className="space-y-4 text-sm text-brand-brown-muted leading-relaxed">
          <p>
            Unlike conventional restaurant aggregators, <strong>Map My Food never invents fake reviews, artificial star ratings, opening hours, or commercial affiliations</strong>.
          </p>

          <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl text-xs text-amber-900 space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-800">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Sample Data vs. Verified Content</span>
            </div>
            <p>
              Where verified restaurant partnerships or field data are not yet established, records are explicitly labeled with a <span className="bg-amber-100 font-semibold px-2 py-0.5 rounded text-amber-800">Sample Data</span> badge. We do not present illustrative eateries as factual endorsements.
            </p>
          </div>

          <p>
            Culinary descriptions, historical background, and ingredient profiles represent genuine culinary heritage gathered from verified Indian regional traditions.
          </p>
        </div>
      </div>

      {/* Free Tier Friendly Architecture & Tech Stack */}
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-brand-cream-dark shadow-subtle space-y-6">
        <h2 className="font-serif text-2xl font-bold text-brand-brown flex items-center gap-2">
          <Code2 className="w-6 h-6 text-brand-orange" />
          <span>Technology Architecture</span>
        </h2>
        
        <p className="text-sm text-brand-brown-muted leading-relaxed">
          Map My Food was built with modern, maintainable, free-tier friendly open-source software:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-brand-cream rounded-2xl border border-brand-cream-dark">
            <span className="font-bold text-brand-brown block text-sm mb-1">Frontend</span>
            <p className="text-brand-brown-muted">
              React 18, TypeScript, Vite, Tailwind CSS, React Router, Lucide Icons.
            </p>
          </div>
          <div className="p-4 bg-brand-cream rounded-2xl border border-brand-cream-dark">
            <span className="font-bold text-brand-brown block text-sm mb-1">Mapping</span>
            <p className="text-brand-brown-muted">
              Leaflet & OpenStreetMap tiles. Completely free and open-source with no paid API keys required.
            </p>
          </div>
          <div className="p-4 bg-brand-cream rounded-2xl border border-brand-cream-dark">
            <span className="font-bold text-brand-brown block text-sm mb-1">Backend</span>
            <p className="text-brand-brown-muted">
              Python, FastAPI, Pydantic, SQLAlchemy, PyJWT, PBKDF2 password cryptography.
            </p>
          </div>
          <div className="p-4 bg-brand-cream rounded-2xl border border-brand-cream-dark">
            <span className="font-bold text-brand-brown block text-sm mb-1">Database & Testing</span>
            <p className="text-brand-brown-muted">
              SQLite (local) / PostgreSQL (production), Pytest test suite, Vitest frontend tests.
            </p>
          </div>
        </div>
      </div>

      {/* Call to action */}
      <div className="text-center pt-4">
        <Link
          to="/explore"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-orange hover:bg-brand-orange-hover text-white font-semibold text-sm rounded-xl shadow-md transition-all active:scale-95"
        >
          <Compass className="w-4 h-4" />
          <span>Start Exploring Indian Food</span>
        </Link>
      </div>
    </div>
  );
};

