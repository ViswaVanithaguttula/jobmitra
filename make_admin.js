import mongoose from 'mongoose';
import User from './backend/models/User.js';
import dotenv from 'dotenv';
dotenv.config({ path: './backend/.env' });

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  console.log('Connected to DB');
  const user = await User.findOneAndUpdate(
    { email: 'test@test.com' }, // assuming this is a test user
    { isAdmin: true },
    { new: true }
  );
  if (user) {
    console.log(`Successfully made ${user.email} an admin.`);
  } else {
    console.log('User not found. Try registering test@test.com first.');
  }
  process.exit();
}).catch((error) => {
  console.error('Error connecting to DB:', error.message);
  process.exit(1);
});
