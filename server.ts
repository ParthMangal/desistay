import express from 'express';
import { createServer as createViteServer } from 'vite';
import cookieParser from 'cookie-parser';
import { initDb } from './src/db';
import db from './src/db';
import bcrypt from 'bcryptjs';
import Razorpay from 'razorpay';

// Initialize DB
initDb();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(cookieParser());

  // API Routes
  const apiRouter = express.Router();

  // Auth
  apiRouter.post('/auth/login', (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
    
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Simple cookie-based session for demo (in prod use JWT or proper session store)
    res.cookie('user_session', JSON.stringify({ id: user.id, role: user.role, name: user.name }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    
    res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  });

  apiRouter.post('/auth/register', (req, res) => {
    const { email, password, name, role } = req.body;
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) return res.status(400).json({ error: 'Email already exists' });

    const hash = bcrypt.hashSync(password, 10);
    try {
      const result = db.prepare('INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)').run(
        email, hash, name, role || 'guest'
      );
      
      const user = { id: result.lastInsertRowid, email, name, role: role || 'guest' };
      res.cookie('user_session', JSON.stringify(user), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      });
      res.json({ user });
    } catch (e) {
      res.status(500).json({ error: 'Registration failed' });
    }
  });

  apiRouter.post('/auth/logout', (req, res) => {
    res.clearCookie('user_session');
    res.json({ success: true });
  });

  apiRouter.get('/auth/me', (req, res) => {
    const session = req.cookies.user_session;
    if (!session) return res.status(401).json({ error: 'Not authenticated' });
    try {
      const user = JSON.parse(session);
      res.json({ user });
    } catch {
      res.status(401).json({ error: 'Invalid session' });
    }
  });

  // Properties
  apiRouter.get('/properties', (req, res) => {
    const { location, checkIn, checkOut, guests } = req.query;
    let query = 'SELECT * FROM properties WHERE 1=1';
    const params = [];

    if (location) {
      query += ' AND (location LIKE ? OR title LIKE ?)';
      params.push(`%${location}%`, `%${location}%`);
    }

    // Only show verified properties to guests (unless admin/vendor viewing own)
    // For simplicity in this demo, we'll show all but prioritize verified in UI
    
    const properties = db.prepare(query).all(...params);
    const parsedProperties = properties.map((p: any) => ({
      ...p,
      amenities: JSON.parse(p.amenities || '[]'),
      images: JSON.parse(p.images || '[]'),
      safety_features: JSON.parse(p.safety_features || '[]'),
      neighborhood_info: JSON.parse(p.neighborhood_info || '{}')
    }));
    res.json(parsedProperties);
  });

  apiRouter.get('/properties/:id', (req, res) => {
    const property = db.prepare('SELECT * FROM properties WHERE id = ?').get(req.params.id) as any;
    if (!property) return res.status(404).json({ error: 'Property not found' });
    
    property.amenities = JSON.parse(property.amenities || '[]');
    property.images = JSON.parse(property.images || '[]');
    property.safety_features = JSON.parse(property.safety_features || '[]');
    property.neighborhood_info = JSON.parse(property.neighborhood_info || '{}');
    
    // Get vendor details
    const vendor = db.prepare('SELECT name, email FROM users WHERE id = ?').get(property.vendor_id);
    
    // Get reviews
    const reviews = db.prepare(`
      SELECT r.*, u.name as user_name 
      FROM reviews r 
      JOIN users u ON r.user_id = u.id 
      WHERE r.property_id = ?
      ORDER BY r.created_at DESC
    `).all(req.params.id);

    res.json({ ...property, vendor, reviews });
  });

  // Bookings
  apiRouter.post('/bookings', (req, res) => {
    const session = req.cookies.user_session;
    if (!session) return res.status(401).json({ error: 'Login required' });
    const user = JSON.parse(session);

    const { propertyId, checkIn, checkOut, totalPrice } = req.body;
    
    // Calculate commission (e.g., 10%) and tax (e.g., 18% GST)
    const commission = totalPrice * 0.10;
    const tax = totalPrice * 0.18;

    try {
      const result = db.prepare(`
        INSERT INTO bookings (property_id, guest_id, check_in, check_out, total_price, commission_amount, tax_amount, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'confirmed')
      `).run(propertyId, user.id, checkIn, checkOut, totalPrice, commission, tax);
      
      res.json({ success: true, bookingId: result.lastInsertRowid });
    } catch (e) {
      res.status(500).json({ error: 'Booking failed' });
    }
  });

  apiRouter.post('/bookings/:id/cancel', (req, res) => {
    const session = req.cookies.user_session;
    if (!session) return res.status(401).json({ error: 'Login required' });
    const user = JSON.parse(session);

    const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(req.params.id) as any;
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    // Allow cancellation if user is the guest or admin
    if (booking.guest_id !== user.id && user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    db.prepare("UPDATE bookings SET status = 'cancelled' WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  apiRouter.get('/my-bookings', (req, res) => {
    const session = req.cookies.user_session;
    if (!session) return res.status(401).json({ error: 'Login required' });
    const user = JSON.parse(session);

    const bookings = db.prepare(`
      SELECT b.*, p.title, p.location, p.images 
      FROM bookings b 
      JOIN properties p ON b.property_id = p.id 
      WHERE b.guest_id = ?
      ORDER BY b.created_at DESC
    `).all(user.id);

    const parsedBookings = bookings.map((b: any) => ({
      ...b,
      images: JSON.parse(b.images)
    }));

    res.json(parsedBookings);
  });

  apiRouter.get('/vendor/properties', (req, res) => {
    const session = req.cookies.user_session;
    if (!session) return res.status(401).json({ error: 'Login required' });
    const user = JSON.parse(session);
    if (user.role !== 'vendor') return res.status(403).json({ error: 'Vendor access only' });

    const properties = db.prepare('SELECT * FROM properties WHERE vendor_id = ?').all(user.id);
    res.json(properties.map((p: any) => ({ 
      ...p, 
      amenities: JSON.parse(p.amenities || '[]'), 
      images: JSON.parse(p.images || '[]'),
      safety_features: JSON.parse(p.safety_features || '[]')
    })));
  });

  apiRouter.post('/vendor/properties', (req, res) => {
    const session = req.cookies.user_session;
    if (!session) return res.status(401).json({ error: 'Login required' });
    const user = JSON.parse(session);
    if (user.role !== 'vendor') return res.status(403).json({ error: 'Vendor access only' });

    const { title, description, location, price, amenities, images, safety_features, neighborhood_info, property_type, rent_cycle } = req.body;
    
    db.prepare(`
      INSERT INTO properties (
        vendor_id, title, description, location, price, 
        amenities, images, safety_features, neighborhood_info, verification_status, property_type, rent_cycle
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?)
    `).run(
      user.id, title, description, location, price, 
      JSON.stringify(amenities), JSON.stringify(images), 
      JSON.stringify(safety_features || []), JSON.stringify(neighborhood_info || {}),
      property_type || 'PG', rent_cycle || 'Monthly'
    );

    res.json({ success: true });
  });

  apiRouter.delete('/vendor/properties/:id', (req, res) => {
    const session = req.cookies.user_session;
    if (!session) return res.status(401).json({ error: 'Login required' });
    const user = JSON.parse(session);
    if (user.role !== 'vendor') return res.status(403).json({ error: 'Vendor access only' });

    const result = db.prepare('DELETE FROM properties WHERE id = ? AND vendor_id = ?').run(req.params.id, user.id);
    if (result.changes === 0) return res.status(404).json({ error: 'Property not found or unauthorized' });
    
    res.json({ success: true });
  });

  // Admin Verification Routes
  apiRouter.get('/admin/pending-vendors', (req, res) => {
    const session = req.cookies.user_session;
    if (!session) return res.status(401).json({ error: 'Login required' });
    const user = JSON.parse(session);
    if (user.role !== 'admin') return res.status(403).json({ error: 'Admin access only' });

    const vendors = db.prepare("SELECT id, name, email, kyc_documents FROM users WHERE kyc_status = 'pending'").all();
    res.json(vendors.map((v: any) => ({ ...v, kyc_documents: JSON.parse(v.kyc_documents || '[]') })));
  });

  apiRouter.post('/admin/verify-vendor/:id', (req, res) => {
    const session = req.cookies.user_session;
    if (!session) return res.status(401).json({ error: 'Login required' });
    const user = JSON.parse(session);
    if (user.role !== 'admin') return res.status(403).json({ error: 'Admin access only' });

    const { status } = req.body; // 'verified' or 'rejected'
    db.prepare('UPDATE users SET kyc_status = ? WHERE id = ?').run(status, req.params.id);
    res.json({ success: true });
  });

  apiRouter.get('/admin/pending-properties', (req, res) => {
    const session = req.cookies.user_session;
    if (!session) return res.status(401).json({ error: 'Login required' });
    const user = JSON.parse(session);
    if (user.role !== 'admin') return res.status(403).json({ error: 'Admin access only' });

    const properties = db.prepare('SELECT * FROM properties WHERE verification_status = ?').all('pending');
    res.json(properties.map((p: any) => ({
      ...p,
      amenities: JSON.parse(p.amenities || '[]'),
      images: JSON.parse(p.images || '[]'),
      safety_features: JSON.parse(p.safety_features || '[]')
    })));
  });

  apiRouter.post('/admin/verify-property/:id', (req, res) => {
    const session = req.cookies.user_session;
    if (!session) return res.status(401).json({ error: 'Login required' });
    const user = JSON.parse(session);
    if (user.role !== 'admin') return res.status(403).json({ error: 'Admin access only' });

    const { status } = req.body; // 'verified' or 'rejected'
    db.prepare('UPDATE properties SET verification_status = ? WHERE id = ?').run(status, req.params.id);
    res.json({ success: true });
  });

  // Razorpay Order
  apiRouter.post('/payment/create-order', async (req, res) => {
    const { amount } = req.body;
    
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      // Mock mode if keys missing
      return res.json({ 
        id: 'order_mock_' + Date.now(), 
        amount: amount * 100, 
        currency: 'INR',
        mock: true 
      });
    }

    try {
      const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET
      });

      const order = await razorpay.orders.create({
        amount: amount * 100, // amount in smallest currency unit
        currency: 'INR',
        receipt: 'receipt_' + Date.now()
      });

      res.json(order);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Payment initialization failed' });
    }
  });

  app.use('/api', apiRouter);

  // Vite middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
