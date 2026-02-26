import Database from 'better-sqlite3';
import path from 'path';
import bcrypt from 'bcryptjs';

const db = new Database('marketplace.db');

export function initDb() {
  // Users table - Added KYC fields
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT CHECK(role IN ('guest', 'vendor', 'admin')) NOT NULL DEFAULT 'guest',
      is_subscribed BOOLEAN DEFAULT 0,
      kyc_status TEXT CHECK(kyc_status IN ('pending', 'verified', 'rejected', 'none')) DEFAULT 'none',
      kyc_documents TEXT, -- JSON array of document URLs
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Properties table - Enhanced for Rental Platform
  db.exec(`
    CREATE TABLE IF NOT EXISTS properties (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vendor_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      location TEXT NOT NULL,
      price REAL NOT NULL, -- Renamed from price_per_night
      rent_cycle TEXT DEFAULT 'Monthly', -- Monthly, Daily
      property_type TEXT DEFAULT 'PG', -- PG, Flat, Hostel, Apartment
      amenities TEXT, -- JSON array
      images TEXT, -- JSON array
      
      -- Safety & Verification Fields
      safety_features TEXT, -- JSON array
      verification_status TEXT CHECK(verification_status IN ('pending', 'verified', 'rejected')) DEFAULT 'pending',
      neighborhood_info TEXT, -- JSON object
      house_rules TEXT, -- JSON array
      cancellation_policy TEXT DEFAULT 'Flexible',
      
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (vendor_id) REFERENCES users(id)
    )
  `);

  // Bookings table
  db.exec(`
    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      property_id INTEGER NOT NULL,
      guest_id INTEGER NOT NULL,
      check_in DATE NOT NULL,
      check_out DATE, -- Optional for long-term
      total_price REAL NOT NULL,
      commission_amount REAL DEFAULT 0,
      tax_amount REAL DEFAULT 0,
      status TEXT CHECK(status IN ('pending', 'confirmed', 'cancelled', 'completed')) DEFAULT 'pending',
      payment_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (property_id) REFERENCES properties(id),
      FOREIGN KEY (guest_id) REFERENCES users(id)
    )
  `);

  // Reviews table
  db.exec(`
    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      property_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      rating INTEGER CHECK(rating >= 1 AND rating <= 5),
      comment TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (property_id) REFERENCES properties(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Seed data if empty
  const userCount = db.prepare('SELECT count(*) as count FROM users').get() as { count: number };
  if (userCount.count === 0) {
    console.log('Seeding database...');
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync('password123', salt);

    // Admin
    db.prepare('INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)').run(
      'admin@desistays.com', hash, 'Super Admin', 'admin'
    );

    // Vendor
    const vendorResult = db.prepare('INSERT INTO users (email, password, name, role, kyc_status) VALUES (?, ?, ?, ?, ?)').run(
      'vendor@bangalorestays.com', hash, 'Anita Reddy', 'vendor', 'verified'
    );
    const vendorId = vendorResult.lastInsertRowid;

    // Guest
    const guestResult = db.prepare('INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)').run(
      'guest@traveler.com', hash, 'Priya Sharma', 'guest'
    );
    const guestId = guestResult.lastInsertRowid;

    // Properties - Bangalore Focused (Rental)
    const stmt = db.prepare(`
      INSERT INTO properties (
        vendor_id, title, description, location, price, rent_cycle, property_type,
        amenities, images, safety_features, verification_status, neighborhood_info, cancellation_policy
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const prop1 = stmt.run(
      vendorId,
      'Safe Haven Ladies PG - Koramangala',
      'Premium PG for working professionals. Twin sharing rooms with attached washroom. 3 meals included.',
      'Koramangala 4th Block, Bangalore',
      12000, 'Monthly', 'PG',
      JSON.stringify(['WiFi', 'AC', 'Washing Machine', '3 Meals', 'Housekeeping']),
      JSON.stringify(['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80']),
      JSON.stringify(['CCTV in Common Areas', 'Female Warden', 'Biometric Entry', '24/7 Security']),
      'verified',
      JSON.stringify({ police_station_dist: '0.5 km', hospital_dist: '1 km', safe_at_night: 'Yes' }),
      'Flexible'
    );

    const prop2 = stmt.run(
      vendorId,
      'Luxury 1BHK Flat - Indiranagar',
      'Fully furnished 1BHK apartment in a gated society. Perfect for single occupancy.',
      'Indiranagar, Bangalore',
      25000, 'Monthly', 'Flat',
      JSON.stringify(['WiFi', 'Gym', 'Power Backup', 'Modular Kitchen', 'Balcony']),
      JSON.stringify(['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1484154218962-a1c002085d2f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80']),
      JSON.stringify(['Video Door Phone', 'Gated Security', 'Well-lit Entrance']),
      'verified',
      JSON.stringify({ police_station_dist: '1.2 km', hospital_dist: '0.8 km', safe_at_night: 'Yes' }),
      'Moderate'
    );
    
    stmt.run(
      vendorId,
      'Sunshine Girls Hostel - Whitefield',
      'Affordable student accommodation near colleges. Bunk beds with individual storage.',
      'Whitefield, Bangalore',
      7500, 'Monthly', 'Hostel',
      JSON.stringify(['WiFi', 'Study Hall', 'Common TV', 'Mess']),
      JSON.stringify(['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80']),
      JSON.stringify(['Female Warden', 'Curfew (10 PM)', 'CCTV']),
      'pending',
      JSON.stringify({ police_station_dist: '2 km', hospital_dist: '1.5 km', safe_at_night: 'Caution' }),
      'Strict'
    );

    stmt.run(
      vendorId,
      'Modern 2BHK Shared Flat - HSR Layout',
      'Spacious room in a 2BHK flat. Shared kitchen and living area.',
      'HSR Layout, Bangalore',
      14000, 'Monthly', 'Flat',
      JSON.stringify(['WiFi', 'Fridge', 'Washing Machine', 'Cook Available']),
      JSON.stringify(['https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80']),
      JSON.stringify(['Gated Society', 'Security Guard']),
      'verified',
      JSON.stringify({ police_station_dist: '1 km', hospital_dist: '0.5 km', safe_at_night: 'Yes' }),
      'Flexible'
    );

    stmt.run(
      vendorId,
      'Elite Women\'s PG - Electronic City',
      'High-end PG near tech parks. Single rooms with AC.',
      'Electronic City, Bangalore',
      18000, 'Monthly', 'PG',
      JSON.stringify(['WiFi', 'AC', 'Gym', 'Transport Facility']),
      JSON.stringify(['https://images.unsplash.com/photo-1598928506311-c55ded91a20c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80']),
      JSON.stringify(['24/7 Security', 'CCTV', 'Access Card']),
      'verified',
      JSON.stringify({ police_station_dist: '1.5 km', hospital_dist: '2 km', safe_at_night: 'Yes' }),
      'Moderate'
    );

    // Seed Reviews
    const reviewStmt = db.prepare('INSERT INTO reviews (property_id, user_id, rating, comment) VALUES (?, ?, ?, ?)');
    reviewStmt.run(prop1.lastInsertRowid, guestId, 5, 'Absolutely loved the safety features! The warden is very helpful.');
    reviewStmt.run(prop1.lastInsertRowid, guestId, 4, 'Great location, but food could be better.');
    reviewStmt.run(prop2.lastInsertRowid, guestId, 5, 'Very premium feel and super safe.');
  }
}

export default db;
