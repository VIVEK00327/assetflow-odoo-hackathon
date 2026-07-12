const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Models
const User = require('./models/User');
const Department = require('./models/Department');
const Category = require('./models/Category');
const Asset = require('./models/Asset');
const Booking = require('./models/Booking');
const Transfer = require('./models/Transfer');
const Maintenance = require('./models/Maintenance');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// PORT
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkeyforassetflowproject';

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/assetflow')
  .then(() => {
    console.log('Successfully connected to MongoDB.');
    seedDatabase();
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// JWT authentication middleware
const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({ message: 'User not found in system' });
      }
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Admin-only permission guard
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'Admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied, administrator only' });
  }
};

// --- AUTH ROUTER ---

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: 'Employee' // Self-signup always creates standard employee accounts
    });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '30d' });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '30d' });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/auth/me', protect, (req, res) => {
  res.json(req.user);
});

// --- DEPARTMENTS ROUTER ---

app.get('/api/departments', protect, async (req, res) => {
  try {
    const depts = await Department.find();
    res.json(depts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/departments', protect, adminOnly, async (req, res) => {
  try {
    const { name, head, parentDept, status } = req.body;
    const dept = await Department.create({ name, head, parentDept, status });
    res.status(201).json(dept);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/api/departments/:id', protect, adminOnly, async (req, res) => {
  try {
    await Department.findByIdAndDelete(req.params.id);
    res.json({ message: 'Department deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- CATEGORIES ROUTER ---

app.get('/api/categories', protect, async (req, res) => {
  try {
    const cats = await Category.find();
    res.json(cats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/categories', protect, adminOnly, async (req, res) => {
  try {
    const { name, code, status } = req.body;
    const cat = await Category.create({ name, code, status });
    res.status(201).json(cat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/api/categories/:id', protect, adminOnly, async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- EMPLOYEES ROUTER ---

app.get('/api/employees', protect, async (req, res) => {
  try {
    // Get all users in database (since employees are users)
    const emps = await User.find().select('-password');
    res.json(emps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/employees', protect, adminOnly, async (req, res) => {
  try {
    const { name, email, role, status } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Employee with this email already exists' });
    }

    const emp = await User.create({
      name,
      email,
      password: 'password123', // Default credential for added employee
      role,
      status
    });

    res.status(201).json({
      id: emp._id,
      name: emp.name,
      email: emp.email,
      role: emp.role,
      status: emp.status
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/api/employees/:id', protect, adminOnly, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Employee record removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- ASSETS ROUTER ---

app.get('/api/assets', protect, async (req, res) => {
  try {
    const assets = await Asset.find().sort({ createdAt: -1 });
    res.json(assets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/assets', protect, async (req, res) => {
  try {
    const { name, tag, category, status } = req.body;
    const tagExists = await Asset.findOne({ tag });
    if (tagExists) {
      return res.status(400).json({ message: 'Asset tag is already registered' });
    }

    const asset = await Asset.create({
      name,
      tag,
      category,
      status,
      holder: status === 'Allocated' ? req.user.name : '--'
    });

    // Update categories count
    await Category.findOneAndUpdate({ name: category }, { $inc: { totalCount: 1 } });

    res.status(201).json(asset);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/api/assets/:id', protect, async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);
    if (asset) {
      await Category.findOneAndUpdate({ name: asset.category }, { $inc: { totalCount: -1 } });
      await Asset.findByIdAndDelete(req.params.id);
    }
    res.json({ message: 'Asset deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- BOOKINGS ROUTER ---

app.get('/api/bookings', protect, async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/bookings', protect, async (req, res) => {
  try {
    const { resource, time, date } = req.body;
    const booking = await Booking.create({
      resource,
      time,
      date,
      user: req.user.name
    });
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/api/bookings/:id', protect, async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: 'Booking cancelled' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- TRANSFERS ROUTER ---

app.get('/api/transfers', protect, async (req, res) => {
  try {
    const transfers = await Transfer.find().sort({ createdAt: -1 });
    res.json(transfers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/transfers', protect, async (req, res) => {
  try {
    const { assetTag, to, reason } = req.body;
    const transfer = await Transfer.create({
      assetTag,
      from: req.user.name,
      to,
      reason,
      status: 'Pending Approval',
      date: 'Just Now'
    });
    res.status(201).json(transfer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- MAINTENANCE ROUTER ---

app.get('/api/maintenance', protect, async (req, res) => {
  try {
    const tickets = await Maintenance.find().sort({ createdAt: -1 });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/maintenance', protect, async (req, res) => {
  try {
    const { assetTag, issue, priority } = req.body;
    const ticket = await Maintenance.create({
      assetTag,
      issue,
      priority,
      status: 'Reported'
    });
    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Seeder Function
async function seedDatabase() {
  try {
    console.log('Force-seeding database with exact Excalidraw mockup data...');
    
    // Clear collections to ensure exact wireframe data matches
    await User.deleteMany({});
    await Department.deleteMany({});
    await Category.deleteMany({});
    await Asset.deleteMany({});
    await Booking.deleteMany({});
    await Transfer.deleteMany({});
    await Maintenance.deleteMany({});

    // 1. Seed Users (Screen 3's Employees table)
    await User.create([
      { name: 'Arthur Pendragon', email: 'arthur@company.com', password: 'password123', role: 'Admin', status: 'Active' },
      { name: 'Sarah Connor', email: 'sarah.connor@company.com', password: 'password123', role: 'Asset Manager', status: 'Active' },
      { name: 'Aditi Rao', email: 'head@assetflow.com', password: 'password123', role: 'Department Head', status: 'Active' },
      { name: 'Priya Shah', email: 'employee@assetflow.com', password: 'password123', role: 'Employee', status: 'Active' },
      { name: 'Sana Iqbal', email: 'sana.iqbal@company.com', password: 'password123', role: 'Employee', status: 'Active' }
    ]);

    // 2. Seed Departments (Screen 3's Departments table)
    await Department.create([
      { name: 'Engineering', head: 'Aditi Rao', parentDept: '--', status: 'Active' },
      { name: 'Facilities', head: 'Sarah Connor', parentDept: '--', status: 'Active' },
      { name: 'Field Ops (East)', head: 'Sana Iqbal', parentDept: 'Field Ops', status: 'Inactive' }
    ]);

    // 3. Seed Categories (Screen 3's Categories table)
    await Category.create([
      { name: 'Laptops', code: 'LAP', totalCount: 145, status: 'Active' },
      { name: 'Monitors', code: 'MON', totalCount: 92, status: 'Active' },
      { name: 'Office Furniture', code: 'FUR', totalCount: 310, status: 'Active' },
      { name: 'AV Equipment', code: 'AVQ', totalCount: 40, status: 'Active' }
    ]);

    // 4. Seed Assets (Seeded assets to match screens)
    await Asset.create([
      { name: 'MacBook Pro 16"', tag: 'AF-0114', category: 'Laptops', status: 'Allocated', holder: 'Priya Shah' },
      { name: 'Dell UltraSharp 27"', tag: 'AF-0252', category: 'Monitors', status: 'Available', holder: '--' },
      { name: 'Epson Projector 4K', tag: 'AF-0062', category: 'AV Equipment', status: 'Under Maintenance', holder: '--' },
      { name: 'Ergonomic Desk Chair', tag: 'AF-0581', category: 'Office Furniture', status: 'Available', holder: '--' },
      { name: 'ThinkPad T14 Gen 4', tag: 'AF-0912', category: 'Laptops', status: 'Allocated', holder: 'Aditi Rao' }
    ]);

    // 5. Seed Bookings
    await Booking.create([
      { resource: 'Conference Room B2', user: 'Aditi Rao', time: '2:00 PM - 3:00 PM', date: 'Today' },
      { resource: 'Epson Projector 4K', user: 'Sarah Connor', time: '11:00 AM - 1:00 PM', date: 'Tomorrow' }
    ]);

    // 6. Seed Transfers
    await Transfer.create([
      { assetTag: 'AF-0912', from: 'Sarah Connor', to: 'Aditi Rao', status: 'Approved', date: 'Yesterday', reason: 'Project Assignment' }
    ]);

    // 7. Seed Maintenance
    await Maintenance.create([
      { assetTag: 'AF-0062', issue: 'Bulb flickering', priority: 'Medium', status: 'In Progress' }
    ]);

    console.log('Mock database seeding process completed.');
  } catch (error) {
    console.error('Seeding database error:', error);
  }
}
