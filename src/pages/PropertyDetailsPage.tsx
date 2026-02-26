import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, User, Check, Star, Shield, AlertCircle } from 'lucide-react';

export default function PropertyDetailsPage() {
  const { id } = useParams();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/properties/${id}`)
      .then(res => res.json())
      .then(data => {
        setProperty(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!property) return <div className="p-8 text-center">Property not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Verification Banner */}
      {property.verification_status === 'verified' ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center text-green-800">
          <Shield className="mr-2" size={20} />
          <span className="font-semibold">DesiStays Verified Safe:</span>
          <span className="ml-2 text-sm">This property has passed our 15-point safety checklist including police verification and physical inspection.</span>
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-center text-yellow-800">
          <AlertCircle className="mr-2" size={20} />
          <span className="font-semibold">Verification Pending:</span>
          <span className="ml-2 text-sm">This property is currently under review by our safety team.</span>
        </div>
      )}

      {/* Image Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="h-96 rounded-xl overflow-hidden">
          <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover" />
        </div>
        <div className="grid grid-cols-2 gap-4 h-96">
          {property.images.slice(1, 5).map((img: string, i: number) => (
            <div key={i} className="rounded-xl overflow-hidden">
              <img src={img} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
          {/* Fallback if less than 5 images */}
          {[...Array(Math.max(0, 4 - (property.images.length - 1)))].map((_, i) => (
             <div key={`placeholder-${i}`} className="bg-gray-200 rounded-xl"></div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
          <div className="flex items-center text-gray-500 mb-6">
            <MapPin size={18} className="mr-1" />
            {property.location}
          </div>

          <div className="border-t border-b border-gray-200 py-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Hosted by {property.vendor?.name || 'Partner'}</h2>
            <p className="text-gray-600">{property.description}</p>
          </div>

          {/* Safety Checklist Section */}
          <div className="mb-8 bg-rose-50 p-6 rounded-xl border border-rose-100">
            <h2 className="text-xl font-semibold mb-4 text-rose-900 flex items-center">
              <Shield className="mr-2" /> Safety Checklist
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {property.safety_features?.map((feature: string) => (
                <div key={feature} className="flex items-center text-gray-700">
                  <Check size={18} className="mr-2 text-rose-600" />
                  {feature}
                </div>
              ))}
              {!property.safety_features?.length && <p className="text-gray-500">No specific safety features listed.</p>}
            </div>
          </div>

          {/* Neighborhood Info */}
          {property.neighborhood_info && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Neighborhood Safety</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase">Police Station</p>
                  <p className="font-medium">{property.neighborhood_info.police_station_dist || 'N/A'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase">Hospital</p>
                  <p className="font-medium">{property.neighborhood_info.hospital_dist || 'N/A'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase">Safe at Night?</p>
                  <p className={`font-medium ${property.neighborhood_info.safe_at_night === 'Yes' ? 'text-green-600' : 'text-orange-600'}`}>
                    {property.neighborhood_info.safe_at_night || 'Unknown'}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {property.amenities.map((amenity: string) => (
                <div key={amenity} className="flex items-center text-gray-600">
                  <Check size={18} className="mr-2 text-green-500" />
                  {amenity}
                </div>
              ))}
            </div>
          </div>

          <div className="mb-8 border-t border-gray-200 pt-6">
            <h2 className="text-xl font-semibold mb-4">Cancellation Policy</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-medium text-gray-900">{property.cancellation_policy} Policy</p>
              <p className="text-sm text-gray-600 mt-1">
                {property.cancellation_policy === 'Flexible' && 'Full refund 1 day prior to arrival.'}
                {property.cancellation_policy === 'Moderate' && 'Full refund 5 days prior to arrival.'}
                {property.cancellation_policy === 'Strict' && '50% refund up to 1 week prior to arrival.'}
              </p>
            </div>
          </div>

          <div className="mb-8 border-t border-gray-200 pt-6">
            <h2 className="text-xl font-semibold mb-4">Guest Reviews</h2>
            {property.reviews && property.reviews.length > 0 ? (
              <div className="space-y-4">
                {property.reviews.map((review: any) => (
                  <div key={review.id} className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div className="bg-gray-200 rounded-full p-2 mr-3">
                          <User size={16} className="text-gray-600" />
                        </div>
                        <span className="font-medium text-gray-900">{review.user_name}</span>
                      </div>
                      <div className="flex items-center text-yellow-500">
                        <Star size={14} fill="currentColor" />
                        <span className="ml-1 text-sm font-medium">{review.rating}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No reviews yet.</p>
            )}
          </div>
        </div>

        {/* Booking Card */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 sticky top-24">
            <div className="flex justify-between items-center mb-6">
              <div>
                <span className="text-2xl font-bold text-gray-900">₹{property.price.toLocaleString()}</span>
                <span className="text-gray-500"> / {property.rent_cycle === 'Daily' ? 'day' : 'month'}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Star size={16} className="text-yellow-400 mr-1" />
                <span>4.8 (12 reviews)</span>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Security Deposit</span>
                <span>₹{property.price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Brokerage</span>
                <span className="text-green-600 font-medium">₹0 (Zero)</span>
              </div>
            </div>

            <Link 
              to={`/booking/${property.id}`}
              className="block w-full bg-pink-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-pink-700 transition"
            >
              Book Now
            </Link>
            
            <p className="text-center text-xs text-gray-500 mt-4">
              Pay token amount to reserve
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
