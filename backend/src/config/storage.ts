import { env } from './env';

export const storageConfig = {
  provider: process.env.STORAGE_PROVIDER || 'local', // 'local', 's3', 'cloudinary'
  cloudinary: {
    url: env.CLOUDINARY_URL,
  },
  local: {
    uploadDir: 'uploads/',
  }
};
