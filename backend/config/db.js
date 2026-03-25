import mongoose from 'mongoose';

// Function to connect to MongoDB
const connectDB = async () => {
  try {
    // Attempt to connect using the URI stored in environment variables
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // Exit process with failure code
    process.exit(1);
  }
};

export default connectDB;
