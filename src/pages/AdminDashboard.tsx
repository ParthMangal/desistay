import { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Users, Home, DollarSign, Settings, Shield, Check, X } from 'lucide-react';
import { api } from '../services/api';

function AdminOverview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-gray-500 text-sm font-medium">Pending Verifications</h3>
        <p className="text-3xl font-bold text-orange-600 mt-2">12</p>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-gray-500 text-sm font-medium font-sans">Verified Safe Stays</h3>
        <p className="text-3xl font-bold text-brand-green mt-2 font-serif">156</p>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-gray-500 text-sm font-medium font-sans">Total Revenue</h3>
        <p className="text-3xl font-bold text-brand-rust mt-2 font-serif">₹45,200</p>
      </div>
    </div>
  );
}

function AdminVerification() {
  const [pending, setPending] = useState<any[]>([]);

  useEffect(() => {
    api.getPendingProperties().then(setPending);
  }, []);

  const handleVerify = async (id: number, status: 'verified' | 'rejected') => {
    await api.verifyProperty(id, status);
    setPending(pending.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Verification Queue</h2>
      {pending.length === 0 ? (
        <p className="text-gray-500">No pending verifications.</p>
      ) : (
        pending.map(p => (
          <div key={p.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-serif font-semibold text-gray-900">{p.title}</h3>
                <p className="text-gray-500 font-sans">{p.location}</p>
                <div className="mt-4 bg-brand-light/30 p-3 rounded-lg border border-brand-green/20">
                  <p className="font-medium text-brand-green text-sm mb-2 font-sans">Safety Features Claimed:</p>
                  <div className="flex flex-wrap gap-2">
                    {p.safety_features.map((f: string) => (
                      <span key={f} className="text-xs bg-white border border-brand-green/20 px-2 py-1 rounded text-brand-green font-sans">{f}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleVerify(p.id, 'verified')}
                  className="bg-brand-green text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-brand-green/90 font-sans"
                >
                  <Check size={16} /> Approve
                </button>
                <button 
                  onClick={() => handleVerify(p.id, 'rejected')}
                  className="bg-red-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-red-700 font-sans"
                >
                  <X size={16} /> Reject
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function AdminVendorKYC() {
  const [vendors, setVendors] = useState<any[]>([]);

  useEffect(() => {
    api.getPendingVendors().then(setVendors);
  }, []);

  const handleVerify = async (id: number, status: 'verified' | 'rejected') => {
    await api.verifyVendor(id, status);
    setVendors(vendors.filter(v => v.id !== id));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Vendor KYC Requests</h2>
      {vendors.length === 0 ? (
        <p className="text-gray-500">No pending KYC requests.</p>
      ) : (
        vendors.map(v => (
          <div key={v.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">{v.name}</h3>
                <p className="text-gray-500">{v.email}</p>
                <p className="text-sm text-indigo-600 mt-1">Documents Submitted: {v.kyc_documents.length}</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleVerify(v.id, 'verified')}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                >
                  Approve
                </button>
                <button 
                  onClick={() => handleVerify(v.id, 'rejected')}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function AdminCommission() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    // Mock fetching global commission stats
    // In a real app, this would be an API call
    setStats({
      globalRate: 10,
      totalCommission: 15400,
      pendingPayouts: 4500
    });
  }, []);

  if (!stats) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Commission Management</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-gray-500 text-sm font-medium">Global Commission Rate</h3>
          <div className="flex items-end gap-2 mt-2">
            <p className="text-3xl font-bold text-indigo-600">{stats.globalRate}%</p>
            <span className="text-sm text-gray-500 mb-1">per booking</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-gray-500 text-sm font-medium">Total Commission Earned</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">₹{stats.totalCommission}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-gray-500 text-sm font-medium">Pending Vendor Payouts</h3>
          <p className="text-3xl font-bold text-orange-600 mt-2">₹{stats.pendingPayouts}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Commission Settings</h3>
        <div className="max-w-xs">
          <label className="block text-sm font-medium text-gray-700">Default Commission Rate (%)</label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <input
              type="number"
              className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border border-gray-300 sm:text-sm"
              defaultValue={10}
            />
            <button className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans">
      <h1 className="text-3xl font-serif font-bold text-gray-900 mb-8">Platform Admin</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 flex-shrink-0">
          <nav className="space-y-1">
            <Link to="/admin" className="flex items-center px-4 py-2 text-brand-green bg-brand-light/50 rounded-md font-medium">
              <Settings className="mr-3 h-5 w-5 text-brand-green" />
              Overview
            </Link>
            <Link to="/admin/verification" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-md">
              <Shield className="mr-3 h-5 w-5 text-gray-500" />
              Property Verifications
            </Link>
            <Link to="/admin/kyc" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-md">
              <Users className="mr-3 h-5 w-5 text-gray-500" />
              Vendor KYC
            </Link>
            <Link to="/admin/commission" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-md">
              <DollarSign className="mr-3 h-5 w-5 text-gray-500" />
              Commissions
            </Link>
          </nav>
        </aside>

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<AdminOverview />} />
            <Route path="/verification" element={<AdminVerification />} />
            <Route path="/kyc" element={<AdminVendorKYC />} />
            <Route path="/commission" element={<AdminCommission />} />
            <Route path="*" element={<div>Page not found</div>} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
