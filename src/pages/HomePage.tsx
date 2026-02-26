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
        <title>DesiStays - Safe & Verified Rentals for Women in Bangalore</title>
        <meta name="description" content="Find verified PGs, hostels, and flats for women in Bangalore. 24/7 security, female staff, and no brokerage. Book your safe stay today." />
        <meta name="keywords" content="ladies pg bangalore, women hostel, female flatmate, safe housing for women, desistays" />
      </Helmet>

      {/* Hero Section */}
      <div className="relative bg-rose-900 text-white pt-32 pb-40 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            alt="Safe Living Space"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl mb-6">
            Safety First. <span className="text-pink-400">Always.</span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-rose-100 mb-10">
            India's first women-centric rental platform. We verify every property for safety features like CCTV, female staff, and secure locks.
          </p>
          
          <div className="max-w-3xl mx-auto bg-white rounded-xl p-3 shadow-2xl transform hover:scale-105 transition duration-300">
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-2">
              <div className="flex-grow flex items-center px-4 py-3 bg-gray-50 rounded-lg border border-gray-100">
                <MapPin className="text-pink-500 mr-3" />
                <input
                  type="text"
                  placeholder="Search locality (e.g. Koramangala, Indiranagar)"
                  className="bg-transparent w-full focus:outline-none text-gray-900 text-lg placeholder-gray-400"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <button type="submit" className="bg-pink-600 text-white px-10 py-4 rounded-lg font-bold hover:bg-pink-700 transition text-lg shadow-md">
                Find Safe Stays
              </button>
            </form>
          </div>
          
          <div className="mt-8 flex justify-center gap-6 text-sm font-medium text-rose-200">
            <span className="flex items-center"><CheckCircle size={16} className="mr-1" /> 100% Verified Listings</span>
            <span className="flex items-center"><CheckCircle size={16} className="mr-1" /> Zero Brokerage</span>
            <span className="flex items-center"><CheckCircle size={16} className="mr-1" /> 24/7 Support</span>
          </div>
        </div>
      </div>

      {/* Trust Markers Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Why Choose DesiStays?</h2>
            <p className="mt-4 text-gray-500">We go beyond just listing properties. We ensure your peace of mind.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-rose-50 rounded-xl border border-rose-100 text-center hover:shadow-lg transition">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4 text-rose-600">
                <Shield size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Safety Verified</h3>
              <p className="text-gray-600">Every property passes a strict 15-point safety checklist including CCTV, secure locks, and neighborhood safety audits.</p>
            </div>
            <div className="p-6 bg-indigo-50 rounded-xl border border-indigo-100 text-center hover:shadow-lg transition">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600">
                <Users size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Female-First Community</h3>
              <p className="text-gray-600">Connect with verified female flatmates and hosts. Our platform is designed exclusively for women's comfort.</p>
            </div>
            <div className="p-6 bg-green-50 rounded-xl border border-green-100 text-center hover:shadow-lg transition">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                <Home size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Zero Brokerage</h3>
              <p className="text-gray-600">Save money with direct owner bookings. No hidden fees or middleman commissions.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Properties Preview */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Featured Safe Stays</h2>
              <p className="mt-2 text-gray-500">Handpicked properties with top safety ratings.</p>
            </div>
            <Link to="/search" className="text-pink-600 font-semibold hover:text-pink-700 flex items-center">
              View All Properties &rarr;
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <Link key={property.id} to={`/property/${property.id}`} className="group">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-xl transition duration-300 border border-gray-100 relative h-full flex flex-col">
                  {property.verification_status === 'verified' && (
                    <div className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center z-10 shadow-sm">
                      <Shield size={12} className="mr-1" /> Verified Safe
                    </div>
                  )}
                  <div className="aspect-w-16 aspect-h-9 relative h-64">
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                      <p className="text-white font-bold text-lg">₹{property.price.toLocaleString()}<span className="text-sm font-normal">/mo</span></p>
                    </div>
                  </div>
                  <div className="p-5 flex-grow flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-pink-600 transition">{property.title}</h3>
                    <p className="text-sm text-gray-500 flex items-center mb-4">
                      <MapPin size={14} className="mr-1" />
                      {property.location}
                    </p>
                    
                    <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center text-sm">
                      <span className="text-gray-600 bg-gray-100 px-2 py-1 rounded">{property.property_type}</span>
                      <div className="flex items-center text-yellow-500 font-medium">
                        <Star size={14} fill="currentColor" className="mr-1" />
                        4.8
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-pink-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Are you a Property Owner?</h2>
          <p className="text-pink-100 mb-8 max-w-2xl mx-auto">List your property on DesiStays and connect with verified tenants. We help you manage bookings, rent collection, and safety verification.</p>
          <Link to="/register" className="bg-white text-pink-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition shadow-lg inline-block">
            List Your Property
          </Link>
        </div>
      </div>
    </div>
  );
}
