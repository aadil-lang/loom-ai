import dotenv from 'dotenv';

dotenv.config();

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/loomai',
  JWT_SECRET: process.env.JWT_SECRET || 'default_super_secret_jwt_key_replace_in_prod',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  CLOUDINARY_URL: process.env.CLOUDINARY_URL || '',
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
};
