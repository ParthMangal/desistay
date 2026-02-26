import { useState, useEffect } from 'react';
import { Download, XCircle } from 'lucide-react';
import { api } from '../services/api';

export default function UserDashboard() {
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = () => {
    api.getMyBookings().then(setBookings);
  };

  const handleCancel = async (id: number) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    
    await api.cancelBooking(id);
    fetchBookings();
  };

  const handleDownloadInvoice = (booking: any) => {
    alert(`Downloading Invoice #${booking.id}...\nTotal: ₹${booking.total_price}\n(Mock PDF Download)`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Trips</h1>
      
      {bookings.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-500">No bookings yet.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0">
                <img src={booking.images[0]} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{booking.title}</h3>
                    <p className="text-gray-500">{booking.location}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                    booking.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {booking.status.toUpperCase()}
                  </span>
                </div>
                
                <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <p className="font-medium">Check-in</p>
                    <p>{new Date(booking.check_in).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="font-medium">Check-out</p>
                    <p>{new Date(booking.check_out).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                  <span className="font-medium">Total Paid: ₹{booking.total_price}</span>
                  <div className="flex gap-2">
                    {booking.status === 'confirmed' && (
                      <>
                        <button 
                          onClick={() => handleDownloadInvoice(booking)}
                          className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center gap-1"
                        >
                          <Download size={16} /> Invoice
                        </button>
                        <button 
                          onClick={() => handleCancel(booking.id)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center gap-1"
                        >
                          <XCircle size={16} /> Cancel
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
