import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMemoryServer = null;

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (mongoUri) {
      try {
        const conn = await mongoose.connect(mongoUri, {
          serverSelectionTimeoutMS: 3000,
        });
        console.log(`[MongoDB] Connected to external MongoDB: ${conn.connection.host}`);
        return;
      } catch (err) {
        console.warn(`[MongoDB] Could not connect to external MONGODB_URI (${err.message}). Falling back to In-Memory MongoDB...`);
      }
    }

    // Fallback in-memory MongoDB so the server works out of the box with 0 setup!
    mongoMemoryServer = await MongoMemoryServer.create();
    const uri = mongoMemoryServer.getUri();
    const conn = await mongoose.connect(uri);
    console.log(`[MongoDB] Connected to In-Memory MongoDB Server: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[MongoDB Error] ${error.message}`);
    process.exit(1);
  }
};
