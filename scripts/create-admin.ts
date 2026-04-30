import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Error: MONGODB_URI is not defined in .env.local');
  process.exit(1);
}

// User Schema (matching your model)
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  country: { type: String, default: 'Unknown' },
  purchasedContent: [{ type: String }]
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function createAdmin() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI!);
    console.log('Connected!');

    const adminEmail = 'admin@emphasis.com';
    const adminPassword = 'EmphasisAdmin2024!';
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: adminEmail });
    
    if (existingUser) {
      console.log('User already exists. Updating to Admin...');
      existingUser.role = 'admin';
      await existingUser.save();
      console.log('User updated to Admin successfully!');
    } else {
      console.log('Creating new Admin user...');
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      
      const newAdmin = new User({
        name: 'Emphasis Admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        country: 'Canada'
      });

      await newAdmin.save();
      console.log('Admin user created successfully!');
    }

    console.log('\n--- ADMIN CREDENTIALS ---');
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    console.log('-------------------------\n');

    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
}

createAdmin();
