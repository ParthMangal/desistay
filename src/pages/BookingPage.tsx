import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function BookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState<any>(null);
  const [dates, setDates] = useState({ checkIn: '', checkOut: '' });
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (id) {
      api.getProperty(Number(id)).then(setProperty);
    }
    
    api.getCurrentUser().then(setUser);
  }, [id]);

  const calculateTotal = () => {
    // For rental, we charge 1 month rent as total commit, or just a token
    // Let's charge full first month rent for simplicity in this demo
    return property.price;
  };

  const handleBooking = async () => {
    const total = calculateTotal();
    setLoading(true);

    try {
      // Mock payment flow
      if (confirm(`Pay First Month Rent: ₹${total} (Mock). Proceed?`)) {
        await api.createBooking({
          property_id: property.id,
          check_in: dates.checkIn,
          check_out: dates.checkOut,
          total_price: total
        });
        navigate('/dashboard');
      }
    } catch (err) {
      console.error(err);
      alert('Payment initialization failed');
    } finally {
      setLoading(false);
    }
  };

  if (!property) return <div>Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-6">Confirm Booking</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col md:flex-row mb-8">
        <div className="md:w-1/3 h-48 md:h-auto">
          <img src={property.images[0]} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="p-6 md:w-2/3">
          <h3 className="text-xl font-semibold">{property.title}</h3>
          <p className="text-gray-500">{property.location}</p>
          <div className="mt-4 flex justify-between items-center">
             <span className="font-medium">₹{property.price.toLocaleString()} / {property.rent_cycle === 'Daily' ? 'day' : 'month'}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Move-in Details</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700">Move-in Date</label>
            <input 
              type="date" 
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
              value={dates.checkIn}
              onChange={e => setDates({...dates, checkIn: e.target.value})}
            />
          </div>
          {/* Optional Move-out for Rental */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Move-out Date (Optional)</label>
            <input 
              type="date" 
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
              value={dates.checkOut}
              onChange={e => setDates({...dates, checkOut: e.target.value})}
            />
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-xl">
          <h3 className="text-lg font-medium mb-4">Payment Details</h3>
          <div className="flex justify-between mb-2">
            <span>First Month Rent</span>
            <span>₹{property.price.toLocaleString()}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Service Fee</span>
            <span>₹0</span>
          </div>
          <div className="border-t border-gray-200 pt-4 mt-4 flex justify-between font-bold text-lg">
            <span>Total to Pay</span>
            <span>₹{calculateTotal().toLocaleString()}</span>
          </div>
          
          <button
            onClick={handleBooking}
            disabled={loading || !dates.checkIn}
            className="w-full mt-6 bg-pink-600 text-white py-3 rounded-lg font-semibold hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Pay & Book'}
          </button>
        </div>
      </div>
    </div>
  );
}
