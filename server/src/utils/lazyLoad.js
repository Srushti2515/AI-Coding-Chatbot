// Lazy loading utility to avoid OneDrive file access issues
// All heavy imports happen at request time, not module load time

let mongooseCache = null;
let bcryptjsCache = null;
let userModelCache = null;
let chatModelCache = null;

export const getMongoose = async () => {
  if (!mongooseCache) {
    const { default: mongoose } = await import('mongoose');
    mongooseCache = mongoose;
  }
  return mongooseCache;
};

export const getBcryptjs = async () => {
  if (!bcryptjsCache) {
    const { default: bcryptjs } = await import('bcryptjs');
    bcryptjsCache = bcryptjs;
  }
  return bcryptjsCache;
};

export const getJwt = async () => {
  const { default: jwt } = await import('jsonwebtoken');
  return jwt;
};

export const getJoiValidator = async () => {
  const { default: joi } = await import('joi');
  return joi;
};

// For models, we'll create them dynamically
export const getUserModel = async () => {
  if (!userModelCache) {
    try {
      const mongoose = await getMongoose();
      const userSchema = new mongoose.Schema(
        {
          name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
          },
          email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
          },
          password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: 6,
          },
        },
        {
          timestamps: true,
        }
      );

      userSchema.methods.toJSON = function () {
        const obj = this.toObject();
        delete obj.password;
        return obj;
      };

      userModelCache = mongoose.model('User', userSchema);
    } catch (error) {
      console.error('[LazyLoad] Error loading User model:', error.message);
      throw error;
    }
  }
  return userModelCache;
};

export const getChatModel = async () => {
  if (!chatModelCache) {
    try {
      const mongoose = await getMongoose();
      const chatSchema = new mongoose.Schema(
        {
          userId: {
            type: String,
            required: true,
          },
          title: {
            type: String,
            default: 'New Chat',
          },
          messages: [
            {
              role: { type: String, enum: ['user', 'assistant'], required: true },
              content: { type: String, required: true },
              timestamp: { type: Date, default: Date.now },
            },
          ],
        },
        {
          timestamps: true,
        }
      );

      chatModelCache = mongoose.model('Chat', chatSchema);
    } catch (error) {
      console.error('[LazyLoad] Error loading Chat model:', error.message);
      throw error;
    }
  }
  return chatModelCache;
};
