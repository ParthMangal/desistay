import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, MapPin, Filter, Shield, Star } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { api } from '../services/api';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [properties, setProperties] = useState<any[]>([]);
  const [search, setSearch] = useState(initialQuery);
  const [filterType, setFilterType] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties(initialQuery);
  }, [initialQuery]);

  const fetchProperties = (query: string) => {
    setLoading(true);
    api.getProperties(query)
      .then(data => {
        setProperties(data);
        setLoading(false);
      });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProperties(search);
  };

  const filteredProperties = filterType === 'All' 
    ? properties 
    : properties.filter(p => p.property_type === filterType);

  return (
    <div className="bg-brand-light/20 min-h-screen font-sans">
      <Helmet>
        <title>Search Safe Rentals | FemmeGo</title>
      </Helmet>

      {/* Search Header */}
      <div className="bg-white shadow-sm sticky top-0 z-20 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="flex-grow flex items-center px-4 py-2 bg-gray-50 rounded-lg border border-gray-200 focus-within:border-brand-rust focus-within:ring-1 focus-within:ring-brand-rust transition-all">
              <Search className="text-gray-400 mr-2" size={20} />
              <input
                type="text"
                placeholder="Search by locality (e.g. Koramangala)"
                className="bg-transparent w-full focus:outline-none text-gray-900 placeholder-gray-400"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button type="submit" className="bg-brand-green text-white px-6 py-2 rounded-lg font-medium hover:bg-brand-green/90 transition shadow-sm">
              Search
            </button>
          </form>

          {/* Filters */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide">
            {['All', 'PG', 'Flat', 'Hostel'].map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition border ${
                  filterType === type 
                    ? 'bg-brand-green text-white border-brand-green shadow-sm' 
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-xl font-bold text-gray-900 mb-6">
          {filteredProperties.length} Properties Found {search && `in "${search}"`}
        </h1>

        {loading ? (
          <div className="text-center py-20">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((property) => (
              <Link key={property.id} to={`/property/${property.id}`} className="group block">
                <div className="flex flex-col gap-4">
                  {/* Image Container */}
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gray-100">
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300" />
                    
                    {property.verification_status === 'verified' && (
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-brand-green text-xs font-bold px-3 py-1.5 rounded-full flex items-center shadow-sm font-sans">
                        <Shield size={12} className="mr-1 fill-brand-green" /> VERIFIED
                      </div>
                    )}
                    <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1 rounded-lg font-sans border border-white/10">
                      {property.property_type}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-serif font-bold text-gray-900 group-hover:text-brand-rust transition line-clamp-1">
                        {property.title}
                      </h3>
                      <div className="flex items-center gap-1 text-gray-900 font-medium text-sm">
                        <Star size={14} className="fill-brand-yellow text-brand-yellow" />
                        4.8
                      </div>
                    </div>
                    
                    <p className="text-gray-500 font-sans text-sm flex items-center">
                      <MapPin size={14} className="mr-1" />
                      {property.location}
                    </p>

                    {/* Safety Tags */}
                    <div className="flex flex-wrap gap-2 my-1">
                      {property.safety_features && property.safety_features.slice(0, 2).map((feature: string) => (
                        <span key={feature} className="text-xs text-brand-green bg-brand-green/5 px-2 py-1 rounded-md font-medium border border-brand-green/10">
                          {feature}
                        </span>
                      ))}
                    </div>

                    <div className="mt-1 flex items-baseline gap-1">
                      <span className="font-serif text-lg font-bold text-gray-900">₹{property.price.toLocaleString()}</span>
                      <span className="text-gray-500 text-sm font-sans">/{property.rent_cycle === 'Daily' ? 'day' : 'mo'}</span>
                      <span className="ml-auto text-sm font-medium text-brand-rust group-hover:underline">View Details</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
