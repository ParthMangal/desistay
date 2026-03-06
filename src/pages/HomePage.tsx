import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Calendar, Users, Home, Filter, Shield, Star, CheckCircle } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { api } from '../services/api';

export default function HomePage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.getProperties()
      .then(data => setProperties(data.slice(0, 3))); // Only show top 3 featured
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = `/search?q=${search}`;
  };

  return (
    <div>
      <Helmet>
        <title>FemmeGo - Your Trusted Travel Partner</title>
        <meta name="description" content="FemmeGo is a specialized platform designed for renting properties and homes for both long-term and short-term stays, ensuring safety for women." />
        <meta name="keywords" content="safe stays for women, female travel, secure rentals, femmego" />
      </Helmet>

      {/* Hero Section */}
      <div className="relative bg-brand-green pt-32 pb-40 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="Modern Safe Home"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-brand-green/80 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-green/90 via-brand-green/40 to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-serif font-bold tracking-tight text-white sm:text-6xl md:text-7xl mb-6 drop-shadow-sm">
            FemmeGo
          </h1>
          <p className="text-2xl font-serif italic text-brand-yellow mb-8 drop-shadow-sm">
            Your Trusted Travel Partner
          </p>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-100 mb-10 font-sans drop-shadow-sm">
            To provide safe and secure rental options for everyone, with a special focus on women.
          </p>
          
          <div className="max-w-3xl mx-auto bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-2xl transform hover:scale-105 transition duration-300">
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-2">
              <div className="flex-grow flex items-center px-4 py-3 bg-gray-50 rounded-lg border border-gray-100 focus-within:ring-2 focus-within:ring-brand-green/20 transition-all">
                <MapPin className="text-brand-rust mr-3" />
                <input
                  type="text"
                  placeholder="Search locality (e.g. Koramangala, Indiranagar)"
                  className="bg-transparent w-full focus:outline-none text-gray-900 text-lg placeholder-gray-400 font-sans"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <button type="submit" className="bg-brand-green text-white px-10 py-4 rounded-lg font-bold hover:bg-brand-green/90 transition text-lg shadow-md font-sans whitespace-nowrap">
                Find Safe Stays
              </button>
            </form>
          </div>
          
          <div className="mt-8 flex justify-center gap-6 text-sm font-medium text-white/90 font-sans">
            <span className="flex items-center"><CheckCircle size={16} className="mr-1 text-brand-yellow" /> Safety Verified</span>
            <span className="flex items-center"><CheckCircle size={16} className="mr-1 text-brand-yellow" /> Trusted Hosts</span>
            <span className="flex items-center"><CheckCircle size={16} className="mr-1 text-brand-yellow" /> Inclusive Community</span>
          </div>
        </div>
      </div>

      {/* Trust Markers Section */}
      <div className="bg-brand-light/30 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-bold text-brand-green">Why Choose FemmeGo?</h2>
            <p className="mt-4 text-gray-600 font-sans max-w-2xl mx-auto">We go beyond standard listings to ensure every property meets our strict safety and comfort standards.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 text-brand-green shadow-sm group-hover:scale-110 transition duration-300">
                <Shield size={40} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-serif font-bold text-gray-900 mb-3">Verified Safety</h3>
              <p className="text-gray-600 font-sans leading-relaxed">Every property is physically verified for safety features like locks, lighting, and neighborhood security.</p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 text-brand-rust shadow-sm group-hover:scale-110 transition duration-300">
                <Users size={40} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-serif font-bold text-gray-900 mb-3">Community Vetted</h3>
              <p className="text-gray-600 font-sans leading-relaxed">Read real reviews from other women travelers and connect with verified hosts who care.</p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 text-brand-yellow shadow-sm group-hover:scale-110 transition duration-300">
                <Home size={40} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-serif font-bold text-gray-900 mb-3">Curated Comfort</h3>
              <p className="text-gray-600 font-sans leading-relaxed">From high-speed WiFi to clean linens, we ensure the amenities you need for a stress-free stay.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Properties Preview */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-4xl font-serif font-bold text-brand-green">Featured Stays</h2>
              <p className="mt-3 text-gray-500 font-sans text-lg">Handpicked properties with top safety ratings.</p>
            </div>
            <Link to="/search" className="text-brand-rust font-semibold hover:text-brand-rust/80 flex items-center font-sans transition">
              View All Properties &rarr;
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {properties.map((property) => (
              <Link key={property.id} to={`/property/${property.id}`} className="group block">
                <div className="flex flex-col gap-4">
                  {/* Image Container */}
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gray-100">
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300" />
                    
                    {property.verification_status === 'verified' && (
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-brand-green text-xs font-bold px-3 py-1.5 rounded-full flex items-center shadow-sm font-sans">
                        <Shield size={12} className="mr-1 fill-brand-green" /> VERIFIED
                      </div>
                    )}
                    <button className="absolute top-4 right-4 p-2 rounded-full bg-white/90 backdrop-blur-sm text-gray-400 hover:text-red-500 transition shadow-sm">
                       <Star size={16} />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-serif font-bold text-gray-900 group-hover:text-brand-rust transition line-clamp-1">
                        {property.title}
                      </h3>
                      <div className="flex items-center gap-1 text-gray-900 font-medium text-sm">
                        <Star size={14} className="fill-brand-yellow text-brand-yellow" />
                        4.8
                      </div>
                    </div>
                    
                    <p className="text-gray-500 font-sans text-sm flex items-center">
                      {property.location}
                    </p>

                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="font-serif text-xl font-bold text-gray-900">₹{property.price.toLocaleString()}</span>
                      <span className="text-gray-500 text-sm font-sans">/{property.rent_cycle === 'Daily' ? 'night' : 'month'}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-brand-rust py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-serif font-bold text-white mb-4">Are you a Property Owner?</h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto font-sans">List your property on FemmeGo and connect with verified tenants. We help you manage bookings, rent collection, and safety verification.</p>
          <Link to="/register" className="bg-white text-brand-rust px-8 py-3 rounded-lg font-bold hover:bg-gray-50 transition shadow-lg inline-block font-sans">
            List Your Property
          </Link>
        </div>
      </div>
    </div>
  );
}
