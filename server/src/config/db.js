import mongoose from 'mongoose';
import dns from 'dns';

dns.setServers(['8.8.8.8', '1.1.1.1']);

let mongoMemoryServer = null;

export const connectDB = async () => {
  try {
    const mongoUri =
      process.env.MONGODB_URI || 'mongodb://localhost:27017/codesphere_ai';

    try {
      const conn = await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000,
      });

      console.log(
        `[MongoDB] ✅ Connected to MongoDB: ${conn.connection.host}`
      );

      return;

    } catch (connectionError) {

      console.error(
        `[MongoDB] ❌ Connection failed: ${connectionError.message}`
      );

      console.warn(
        `[MongoDB] Proceeding without database. Features requiring persistence will be unavailable.`
      );

      return;
    }

  } catch (error) {

    console.error(`[MongoDB Error] ${error.message}`);

  }
};