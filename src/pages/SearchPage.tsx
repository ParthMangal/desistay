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
    <div className="bg-gray-50 min-h-screen">
      <Helmet>
        <title>Search Safe Rentals | DesiStays</title>
      </Helmet>

      {/* Search Header */}
      <div className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="flex-grow flex items-center px-4 py-2 bg-gray-100 rounded-lg border border-gray-200 focus-within:border-pink-500 focus-within:ring-1 focus-within:ring-pink-500">
              <Search className="text-gray-400 mr-2" size={20} />
              <input
                type="text"
                placeholder="Search by locality (e.g. Koramangala)"
                className="bg-transparent w-full focus:outline-none text-gray-900"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button type="submit" className="bg-pink-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-pink-700 transition">
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
                    ? 'bg-pink-50 text-pink-700 border-pink-200' 
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <Link key={property.id} to={`/property/${property.id}`} className="group block">
                <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition border border-gray-200 overflow-hidden h-full flex flex-col">
                  <div className="relative h-48">
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                    {property.verification_status === 'verified' && (
                      <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center shadow-sm">
                        <Shield size={12} className="mr-1" /> Verified
                      </div>
                    )}
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded">
                      {property.property_type}
                    </div>
                  </div>
                  
                  <div className="p-4 flex-grow flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{property.title}</h3>
                      <div className="flex items-center text-yellow-500 text-sm font-bold">
                        <Star size={14} fill="currentColor" className="mr-1" /> 4.8
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-500 flex items-center mb-3">
                      <MapPin size={14} className="mr-1" />
                      {property.location}
                    </p>

                    {/* Safety Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {property.safety_features && property.safety_features.slice(0, 2).map((feature: string) => (
                        <span key={feature} className="px-2 py-0.5 rounded text-[10px] font-medium bg-rose-50 text-rose-700 border border-rose-100">
                          {feature}
                        </span>
                      ))}
                    </div>

                    <div className="mt-auto pt-3 border-t border-gray-100 flex justify-between items-center">
                      <div>
                        <span className="text-lg font-bold text-gray-900">₹{property.price.toLocaleString()}</span>
                        <span className="text-xs text-gray-500">/{property.rent_cycle === 'Daily' ? 'day' : 'mo'}</span>
                      </div>
                      <span className="text-sm font-medium text-pink-600 group-hover:underline">View Details</span>
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
