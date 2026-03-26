import mongoose from 'mongoose';
import dns from 'dns';

// Setting custom DNS servers to avoid MongoDB Atlas connection issues
dns.setServers(['1.1.1.1', '8.8.8.8']);

// Function to connect to MongoDB
const connectDB = async () => {
  try {
    // Attempt to connect using the URI stored in environment variables
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection failed', error);
    // Exit process with failure code
    process.exit(1);
  }
};

export default connectDB;
