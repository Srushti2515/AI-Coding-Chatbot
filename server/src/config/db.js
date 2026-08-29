import mongoose from 'mongoose';

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

    // Keep the API available when the optional local database fallback cannot start.
    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      mongoMemoryServer = await MongoMemoryServer.create();
      const uri = mongoMemoryServer.getUri();
      const conn = await mongoose.connect(uri);
      console.log(`[MongoDB] Connected to In-Memory MongoDB Server: ${conn.connection.host}`);
    } catch (fallbackError) {
      console.warn(`[MongoDB] In-memory fallback unavailable: ${fallbackError.message}`);
      console.warn('[MongoDB] Server will continue without a database connection.');
    }
  } catch (error) {
    console.error(`[MongoDB Error] ${error.message}`);
  }
};
