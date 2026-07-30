import mongoose from 'mongoose';
import { config } from './env.js';

const MAX_RETRIES = 5;
let retryCount = 0;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.MONGO_URI, {
      retryWrites: true,
      w: 'majority',
    });

    console.log(`MongoDB connected: ${conn.connection.host}`);
    retryCount = 0;
    return conn;
  } catch (error) {
    retryCount++;

    if (retryCount < MAX_RETRIES) {
      const delay = Math.pow(2, retryCount) * 1000;
      console.error(`MongoDB connection failed. Retrying in ${delay}ms...`, error.message);
      await new Promise(resolve => setTimeout(resolve, delay));
      return connectDB();
    }

    console.error('MongoDB connection failed after max retries:', error.message);
    process.exit(1);
  }
};

const closeDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  } catch (error) {
    console.error('Error disconnecting from MongoDB:', error.message);
  }
};

export { connectDB, closeDB };
