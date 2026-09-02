import mongoose from 'mongoose';

let mongoMemoryServer = null;

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/codesphere_ai';

    try {
      const conn = await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000,
      });
      console.log(`[MongoDB] ✅ Connected to MongoDB: ${conn.connection.host}`);
      return;
    } catch (connectionError) {
      console.error(`[MongoDB] ❌ Connection failed: ${connectionError.message}`);
      console.warn(`[MongoDB] Proceeding without database. Features requiring persistence will be unavailable.`);
      
      // Don't throw error - allow app to continue
      // This is especially important for OneDrive environments where file system access is restricted
      return;
    }
  } catch (error) {
    console.error(`[MongoDB Error] ${error.message}`);
  }
};
