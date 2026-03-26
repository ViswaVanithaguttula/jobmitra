import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import dns from 'dns';

dns.setServers(['1.1.1.1', '8.8.8.8']);

dotenv.config({ path: './.env' });

const checkAdmins = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('--- DB DIAGNOSTICS ---');
    console.log(`Connected to: ${process.env.MONGO_URI}`);
    
    const admins = await User.find({ isAdmin: true }, { email: 1, name: 1, _id: 0 });
    console.log('Users with isAdmin: true ->', admins);
    
    const allUsers = await User.find({}, { email: 1, isAdmin: 1, _id: 0 });
    console.log('All Users and their isAdmin status ->', allUsers);

    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
};

checkAdmins();
