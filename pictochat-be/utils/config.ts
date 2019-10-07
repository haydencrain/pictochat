import path from 'path';

const config = {
  // default path is relative to this file's location in the build directory
  IMAGE_STAGING_DIR: process.env.PICTOCHAT_IMAGE_STAGING_DIR || path.join(__dirname, '../../images'),
  API_ROOT: process.env.PICTOCHAT_API_ROOT || 'http://localhost:443/api',
  JWT_SECRET: process.env.JWT_SECRET || 'jwt-secret',
  ADMIN_USER: process.env.PICTOCHAT_ADMIN_USER || 'admin',
  ADMIN_PASSWORD: process.env.PICTOCHAT_ADMIN_PASSWORD || 'admin',
  CREATE_ADMIN_USER: process.env.PICTOCHAT_CREATE_ADMIN_USER || true
};

// type casting so IDE's know what properties config has
export default config as typeof config;
