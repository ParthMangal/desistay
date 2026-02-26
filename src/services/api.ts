import { User } from '../types';

// Types
export interface Property {
  id: number;
  vendor_id: number;
  title: string;
  description: string;
  location: string;
  price: number;
  rent_cycle: string;
  property_type: string;
  amenities: string[];
  images: string[];
  safety_features: string[];
  verification_status: 'pending' | 'verified' | 'rejected';
  neighborhood_info: any;
  cancellation_policy: string;
  reviews?: any[];
}

export interface Booking {
  id: number;
  property_id: number;
  guest_id: number;
  check_in: string;
  check_out: string;
  total_price: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  property?: Property;
}

// Seed Data
const SEED_USERS = [
  { id: 1, name: 'Anita Reddy', email: 'vendor@bangalorestays.com', password: 'password123', role: 'vendor', kyc_status: 'verified' },
  { id: 2, name: 'Priya Sharma', email: 'guest@traveler.com', password: 'password123', role: 'guest', kyc_status: 'none' },
  { id: 3, name: 'Admin User', email: 'admin@desistays.com', password: 'password123', role: 'admin', kyc_status: 'verified' }
];

const SEED_PROPERTIES: Property[] = [
  {
    id: 1,
    vendor_id: 1,
    title: 'Safe Haven Ladies PG - Koramangala',
    description: 'Premium PG for working professionals. Twin sharing rooms with attached washroom. 3 meals included.',
    location: 'Koramangala 4th Block, Bangalore',
    price: 12000,
    rent_cycle: 'Monthly',
    property_type: 'PG',
    amenities: ['WiFi', 'AC', 'Washing Machine', '3 Meals', 'Housekeeping'],
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    safety_features: ['CCTV in Common Areas', 'Female Warden', 'Biometric Entry', '24/7 Security'],
    verification_status: 'verified',
    neighborhood_info: { police_station_dist: '0.5 km', hospital_dist: '1 km', safe_at_night: 'Yes' },
    cancellation_policy: 'Flexible',
    reviews: [
      { id: 1, user_name: 'Priya Sharma', rating: 5, comment: 'Absolutely loved the safety features! The warden is very helpful.' }
    ]
  },
  {
    id: 2,
    vendor_id: 1,
    title: 'Luxury 1BHK Flat - Indiranagar',
    description: 'Fully furnished 1BHK apartment in a gated society. Perfect for single occupancy.',
    location: 'Indiranagar, Bangalore',
    price: 25000,
    rent_cycle: 'Monthly',
    property_type: 'Flat',
    amenities: ['WiFi', 'Gym', 'Power Backup', 'Modular Kitchen', 'Balcony'],
    images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1484154218962-a1c002085d2f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    safety_features: ['Video Door Phone', 'Gated Security', 'Well-lit Entrance'],
    verification_status: 'verified',
    neighborhood_info: { police_station_dist: '1.2 km', hospital_dist: '0.8 km', safe_at_night: 'Yes' },
    cancellation_policy: 'Moderate',
    reviews: [
      { id: 2, user_name: 'Priya Sharma', rating: 5, comment: 'Very premium feel and super safe.' }
    ]
  },
  {
    id: 3,
    vendor_id: 1,
    title: 'Sunshine Girls Hostel - Whitefield',
    description: 'Affordable student accommodation near colleges. Bunk beds with individual storage.',
    location: 'Whitefield, Bangalore',
    price: 7500,
    rent_cycle: 'Monthly',
    property_type: 'Hostel',
    amenities: ['WiFi', 'Study Hall', 'Common TV', 'Mess'],
    images: ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    safety_features: ['Female Warden', 'Curfew (10 PM)', 'CCTV'],
    verification_status: 'pending',
    neighborhood_info: { police_station_dist: '2 km', hospital_dist: '1.5 km', safe_at_night: 'Caution' },
    cancellation_policy: 'Strict',
    reviews: []
  }
];

// Helper to simulate delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// API Service
export const api = {
  // Auth
  login: async (email, password) => {
    await delay(500);
    const users = JSON.parse(localStorage.getItem('users') || JSON.stringify(SEED_USERS));
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      return { user };
    }
    throw new Error('Invalid credentials');
  },

  register: async (userData) => {
    await delay(500);
    const users = JSON.parse(localStorage.getItem('users') || JSON.stringify(SEED_USERS));
    const newUser = { ...userData, id: Date.now(), role: 'guest', kyc_status: 'none' };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    return { user: newUser };
  },

  logout: async () => {
    localStorage.removeItem('currentUser');
  },

  getCurrentUser: async () => {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Properties
  getProperties: async (query = '') => {
    await delay(300);
    let props = JSON.parse(localStorage.getItem('properties') || JSON.stringify(SEED_PROPERTIES));
    if (query) {
      props = props.filter(p => 
        p.location.toLowerCase().includes(query.toLowerCase()) || 
        p.title.toLowerCase().includes(query.toLowerCase())
      );
    }
    return props;
  },

  getProperty: async (id: number) => {
    await delay(300);
    const props = JSON.parse(localStorage.getItem('properties') || JSON.stringify(SEED_PROPERTIES));
    const prop = props.find(p => p.id === Number(id));
    
    // Attach vendor info
    const users = JSON.parse(localStorage.getItem('users') || JSON.stringify(SEED_USERS));
    const vendor = users.find(u => u.id === prop.vendor_id);
    
    return { ...prop, vendor: { name: vendor?.name, email: vendor?.email } };
  },

  addProperty: async (propertyData) => {
    await delay(500);
    const props = JSON.parse(localStorage.getItem('properties') || JSON.stringify(SEED_PROPERTIES));
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    const newProp = {
      ...propertyData,
      id: Date.now(),
      vendor_id: currentUser.id,
      verification_status: 'pending',
      reviews: []
    };
    props.push(newProp);
    localStorage.setItem('properties', JSON.stringify(props));
    return newProp;
  },

  deleteProperty: async (id: number) => {
    await delay(300);
    let props = JSON.parse(localStorage.getItem('properties') || JSON.stringify(SEED_PROPERTIES));
    props = props.filter(p => p.id !== id);
    localStorage.setItem('properties', JSON.stringify(props));
  },

  // Bookings
  createBooking: async (bookingData) => {
    await delay(500);
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    const newBooking = {
      ...bookingData,
      id: Date.now(),
      guest_id: currentUser.id,
      status: 'confirmed',
      created_at: new Date().toISOString()
    };
    bookings.push(newBooking);
    localStorage.setItem('bookings', JSON.stringify(bookings));
    return newBooking;
  },

  getMyBookings: async () => {
    await delay(300);
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const props = JSON.parse(localStorage.getItem('properties') || JSON.stringify(SEED_PROPERTIES));

    return bookings
      .filter(b => b.guest_id === currentUser.id)
      .map(b => {
        const prop = props.find(p => p.id === b.property_id);
        return { ...b, ...prop, id: b.id }; // Merge for display
      });
  },

  cancelBooking: async (id: number) => {
    await delay(300);
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const updated = bookings.map(b => b.id === id ? { ...b, status: 'cancelled' } : b);
    localStorage.setItem('bookings', JSON.stringify(updated));
  },

  // Admin & Vendor Stats
  getVendorStats: async () => {
    await delay(300);
    // Mock stats
    return { total_bookings: 12, total_revenue: 150000, total_commission: 15000 };
  },

  getPendingProperties: async () => {
    await delay(300);
    const props = JSON.parse(localStorage.getItem('properties') || JSON.stringify(SEED_PROPERTIES));
    return props.filter(p => p.verification_status === 'pending');
  },

  verifyProperty: async (id: number, status) => {
    await delay(300);
    const props = JSON.parse(localStorage.getItem('properties') || JSON.stringify(SEED_PROPERTIES));
    const updated = props.map(p => p.id === id ? { ...p, verification_status: status } : p);
    localStorage.setItem('properties', JSON.stringify(updated));
  },
  
  // KYC
  submitKYC: async (docs) => {
    await delay(500);
    // Mock
    return true;
  },
  
  getPendingVendors: async () => {
    return [
      { id: 101, name: 'New Vendor', email: 'new@vendor.com', kyc_documents: ['doc1.jpg'], kyc_status: 'pending' }
    ];
  },
  
  verifyVendor: async (id, status) => {
    return true;
  }
};
