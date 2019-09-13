import path from 'path';

const config = {
  // default path is relative to this file's location in the build directory
  IMAGE_STAGING_DIR: process.env.PICTOCHAT_IMAGE_STAGING_DIR || path.join(__dirname, '../../images'),
  API_ROOT: process.env.PIRCTOCHAT_API_ROOT || 'http://localhost:443/api',
  JWT_SECRET: process.env.JWT_SECRET || 'jwt-secret'
};

// type casting so IDE's know what properties config has
export default config as typeof config;
