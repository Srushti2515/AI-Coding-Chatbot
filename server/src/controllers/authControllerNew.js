import { getMongoose, getBcryptjs, getJwt, getUserModel } from '../utils/lazyLoad.js';

const generateToken = async (id) => {
  const jwt = await getJwt();
  return jwt.sign({ id }, process.env.JWT_SECRET || 'codesphere_secret_key_2026', {
    expiresIn: '30d',
  });
};

// Demo users for testing
const DEMO_USERS = {
  'demo@codesphere.ai': {
    _id: 'demo_user_001',
    name: 'Demo User',
    email: 'demo@codesphere.ai',
    password: '$2a$10$xHvmwN1cQa6kN4fP2fJKbOKpUY0lQzqQ8LZqF6uVQF7xK6mZ2hXy6', // "demo123"
  },
};

// @desc    Register a new user
// @route   POST /api/auth/register
export const registerUser = async (req, res, next) => {
  try {
    const mongoose = await getMongoose();
    const bcryptjs = await getBcryptjs();
    const User = await getUserModel();
    
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields (name, email, password)' });
    }

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        message: 'Database service is currently unavailable. Please use demo login: demo@codesphere.ai / demo123',
        type: 'DATABASE_UNAVAILABLE'
      });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email address' });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    if (newUser) {
      const token = await generateToken(newUser._id);
      res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        token: token,
      });
    } else {
      res.status(400).json({ message: 'Invalid user data received' });
    }
  } catch (error) {
    console.error('[Auth Register Error]:', error.message);
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
export const loginUser = async (req, res, next) => {
  try {
    const mongoose = await getMongoose();
    const bcryptjs = await getBcryptjs();
    const User = await getUserModel();
    
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide both email and password' });
    }

    // Check demo user first (works offline)
    const demoUser = DEMO_USERS[email.toLowerCase()];
    if (demoUser) {
      const isMatch = await bcryptjs.compare(password, demoUser.password);
      if (isMatch) {
        const token = await generateToken(demoUser._id);
        return res.json({
          _id: demoUser._id,
          name: demoUser.name,
          email: demoUser.email,
          token: token,
          isDemo: true,
        });
      } else {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
    }

    // Try database login if connected
    if (mongoose.connection.readyState === 1) {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const isMatch = await bcryptjs.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const token = await generateToken(user._id);
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: token,
      });
    } else {
      // Database unavailable and not a demo user
      return res.status(503).json({ 
        message: 'Database service is currently unavailable. Please use demo login: demo@codesphere.ai / demo123',
        type: 'DATABASE_UNAVAILABLE',
        suggestion: 'Try the demo account: demo@codesphere.ai with password: demo123'
      });
    }
  } catch (error) {
    console.error('[Auth Login Error]:', error.message);
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
export const getCurrentUser = async (req, res, next) => {
  try {
    const mongoose = await getMongoose();
    const User = await getUserModel();
    
    // Check if this is demo user
    if (req.user._id === DEMO_USERS['demo@codesphere.ai']._id) {
      return res.json(DEMO_USERS['demo@codesphere.ai']);
    }

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        message: 'Database service is currently unavailable'
      });
    }

    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    console.error('[Auth GetUser Error]:', error.message);
    next(error);
  }
};
