const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Url = require('./models/Url');
const dotenv = require('dotenv');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/url-shortener', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB Connected. Clearing existing data...');
    await User.deleteMany();
    await Url.deleteMany();

    console.log('Creating sample user...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const user = new User({
      email: 'demo@katomaran.com',
      password: hashedPassword,
    });
    await user.save();

    console.log('Creating sample URLs...');
    
    // Create random visits over the last 7 days for interesting charts
    const createVisits = (count) => {
      const visits = [];
      for (let i = 0; i < count; i++) {
        const date = new Date();
        // Random time in last 7 days
        date.setDate(date.getDate() - Math.floor(Math.random() * 7));
        date.setHours(Math.floor(Math.random() * 24));
        visits.push({ timestamp: date });
      }
      return visits.sort((a, b) => a.timestamp - b.timestamp);
    };

    const url1Visits = createVisits(45);
    const url1 = new Url({
      originalUrl: 'https://react.dev/learn',
      shortCode: 'react-docs',
      userId: user._id,
      clicks: 45,
      visitHistory: url1Visits,
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) // 10 days ago
    });

    const url2Visits = createVisits(12);
    const url2 = new Url({
      originalUrl: 'https://tailwindcss.com/docs/installation',
      shortCode: 'tw-setup',
      userId: user._id,
      clicks: 12,
      visitHistory: url2Visits,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
    });

    const url3Visits = createVisits(120);
    const url3 = new Url({
      originalUrl: 'https://github.com/features/copilot',
      shortCode: 'ai-code',
      userId: user._id,
      clicks: 120,
      visitHistory: url3Visits,
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days ago
    });

    await Url.insertMany([url1, url2, url3]);

    console.log('Sample data seeded successfully!');
    console.log('Login Email: demo@katomaran.com');
    console.log('Login Password: password123');
    
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
