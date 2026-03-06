import { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash, DollarSign, Calendar, Users, Shield } from 'lucide-react';
import { api } from '../services/api';

function VendorProperties() {
  const [properties, setProperties] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProperty, setNewProperty] = useState({
    title: '',
    description: '',
    location: '',
    price: '',
    amenities: '',
    images: '',
    safety_features: ''
  });

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = () => {
    api.getProperties().then(data => {
      // Filter for current vendor (mock logic: show all for now or filter in api)
      // In real mock api, we should filter by vendor_id, but for demo we show all
      setProperties(data);
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this property?')) return;
    await api.deleteProperty(id);
    fetchProperties();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amenities = newProperty.amenities.split(',').map(s => s.trim());
    const images = newProperty.images.split(',').map(s => s.trim());
    const safety_features = newProperty.safety_features.split(',').map(s => s.trim());
    
    await api.addProperty({
      ...newProperty,
      price: parseFloat(newProperty.price),
      amenities,
      images,
      safety_features,
      neighborhood_info: {
        police_station_dist: '1km',
        hospital_dist: '2km',
        safe_at_night: 'Yes'
      },
      rent_cycle: 'Monthly',
      property_type: 'PG',
      cancellation_policy: 'Flexible'
    });
    
    setShowAddForm(false);
    fetchProperties();
    setNewProperty({ title: '', description: '', location: '', price: '', amenities: '', images: '', safety_features: '' });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-serif font-bold text-gray-900">My Properties</h2>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-brand-green text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-brand-green/90 font-sans"
        >
          <Plus size={18} /> Add Property
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8 font-sans">
          <h3 className="text-lg font-semibold mb-4 text-brand-green">Add New Property</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                placeholder="Title"
                className="border p-2 rounded"
                value={newProperty.title}
                onChange={e => setNewProperty({...newProperty, title: e.target.value})}
                required
              />
              <input
                placeholder="Location"
                className="border p-2 rounded"
                value={newProperty.location}
                onChange={e => setNewProperty({...newProperty, location: e.target.value})}
                required
              />
              <input
                placeholder="Price per night"
                type="number"
                className="border p-2 rounded"
                value={newProperty.price}
                onChange={e => setNewProperty({...newProperty, price: e.target.value})}
                required
              />
              <input
                placeholder="Amenities (comma separated)"
                className="border p-2 rounded"
                value={newProperty.amenities}
                onChange={e => setNewProperty({...newProperty, amenities: e.target.value})}
              />
            </div>
            <textarea
              placeholder="Description"
              className="border p-2 rounded w-full"
              value={newProperty.description}
              onChange={e => setNewProperty({...newProperty, description: e.target.value})}
              required
            />
            <input
              placeholder="Image URLs (comma separated)"
              className="border p-2 rounded w-full"
              value={newProperty.images}
              onChange={e => setNewProperty({...newProperty, images: e.target.value})}
              required
            />
            <div className="bg-brand-light/30 p-4 rounded-lg border border-brand-green/20">
              <h4 className="font-semibold text-brand-green mb-2">Safety Checklist (Required for Verification)</h4>
              <input
                placeholder="Safety Features (e.g. CCTV, Female Staff, Guard, Secure Locks)"
                className="border p-2 rounded w-full"
                value={newProperty.safety_features}
                onChange={e => setNewProperty({...newProperty, safety_features: e.target.value})}
                required
              />
              <p className="text-xs text-gray-500 mt-1">Include all safety measures available at your property.</p>
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 border rounded hover:bg-gray-50">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-brand-green text-white rounded hover:bg-brand-green/90">Save</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-6">
        {properties.map(p => (
          <div key={p.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex justify-between items-center">
            <div className="flex gap-4">
              <img src={p.images[0]} className="w-24 h-24 object-cover rounded-md" />
              <div>
                <h3 className="font-serif font-semibold text-lg text-gray-900">{p.title}</h3>
                <p className="text-gray-500 font-sans">{p.location}</p>
                <p className="font-medium text-brand-rust font-sans">₹{p.price}/night</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="p-2 text-gray-500 hover:text-brand-green"><Edit size={18} /></button>
              <button onClick={() => handleDelete(p.id)} className="p-2 text-gray-500 hover:text-red-600"><Trash size={18} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function VendorBookings() {
  return (
    <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
      <h2 className="text-xl font-semibold mb-2">Booking Management</h2>
      <p className="text-gray-500">View and manage guest bookings for your properties.</p>
      <p className="text-sm text-gray-400 mt-4">(Feature coming soon)</p>
    </div>
  );
}

function VendorEarnings() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    api.getVendorStats().then(setStats);
  }, []);

  if (!stats) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-gray-500 text-sm font-medium">Total Bookings</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total_bookings}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-gray-500 text-sm font-medium font-sans">Total Revenue</h3>
          <p className="text-3xl font-bold text-brand-green mt-2 font-serif">₹{stats.total_revenue || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-gray-500 text-sm font-medium font-sans">Platform Commission (10%)</h3>
          <p className="text-3xl font-bold text-red-600 mt-2 font-serif">₹{stats.total_commission || 0}</p>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Payout History</h3>
        <p className="text-gray-500">No payouts yet.</p>
      </div>
    </div>
  );
}

function VendorKYC() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    api.submitKYC(['mock_doc']).then(() => setSubmitted(true));
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 max-w-2xl">
      <h2 className="text-xl font-semibold mb-4">Identity Verification (KYC)</h2>
      {submitted ? (
        <div className="bg-green-50 p-4 rounded-lg text-green-800">
          <p className="font-medium">Documents Submitted!</p>
          <p className="text-sm">Our admin team is reviewing your details. This usually takes 24-48 hours.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Govt ID Proof (Aadhaar/PAN)</label>
            <input type="file" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Property Ownership Proof</label>
            <input type="file" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" required />
          </div>
          <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
            Submit for Verification
          </button>
        </form>
      )}
    </div>
  );
}

export default function VendorDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans">
      <h1 className="text-3xl font-serif font-bold text-brand-green mb-8">Vendor Dashboard</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 flex-shrink-0">
          <nav className="space-y-1">
            <Link to="/vendor" className="flex items-center px-4 py-2 text-brand-green bg-brand-light/50 rounded-md font-medium">
              <Calendar className="mr-3 h-5 w-5 text-brand-green" />
              Properties
            </Link>
            <Link to="/vendor/bookings" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-md">
              <Users className="mr-3 h-5 w-5 text-gray-500" />
              Bookings
            </Link>
            <Link to="/vendor/earnings" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-md">
              <DollarSign className="mr-3 h-5 w-5 text-gray-500" />
              Earnings
            </Link>
            <Link to="/vendor/kyc" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-md">
              <Shield className="mr-3 h-5 w-5 text-gray-500" />
              KYC Verification
            </Link>
          </nav>
        </aside>

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<VendorProperties />} />
            <Route path="/bookings" element={<VendorBookings />} />
            <Route path="/earnings" element={<VendorEarnings />} />
            <Route path="/kyc" element={<VendorKYC />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
