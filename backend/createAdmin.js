// createAdmin.js (if you want veeniths31@gmail.com as admin)
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    // Use the MONGODB_URI from environment variables
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
};

// User model (same as in your models/User.js)
const User = mongoose.model('User', new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['admin', 'agent'],
    default: 'admin'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}));

// Create admin user
const createAdmin = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'veeniths31@gmail.com' });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      console.log('Email: veeniths31@gmail.com');
      process.exit(0);
    }

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'veeniths31@gmail.com',
      password: 'password123',
      role: 'admin'
    });

    console.log('Admin user created successfully:');
    console.log('Email: veeniths31@gmail.com');
    console.log('Password: password123');
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error.message);
    process.exit(1);
  }
};

// Run the script
const runScript = async () => {
  await connectDB();
  await createAdmin();
};

runScript();