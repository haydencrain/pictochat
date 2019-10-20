import path from 'path';

const _PICTOCHAT_PORT = process.env.PICTOCHAT_BACKEND_PORT || 8080;
const _GENERIC_PORT = process.env.PORT;
const PORT = _GENERIC_PORT !== undefined ? _GENERIC_PORT : _PICTOCHAT_PORT;

const config = {
  /* Directory to stage unprocessed images
     Default path is relative to this file's location in the build directory */
  IMAGE_STAGING_DIR: process.env.PICTOCHAT_IMAGE_STAGING_DIR || path.join(__dirname, '../../images'),
  // The public URL used to expose the root of the api (must be accessible by clients)
  API_ROOT: process.env.PICTOCHAT_API_ROOT || 'http://localhost:443/api',
  // User login session JWT secret
  JWT_SECRET: process.env.JWT_SECRET || 'jwt-secret',
  // Username of admin user
  ADMIN_USER: process.env.PICTOCHAT_ADMIN_USER || 'admin',
  // Password of admin user
  ADMIN_PASSWORD: process.env.PICTOCHAT_ADMIN_PASSWORD || 'admin',
  // Whether to create an admin user on start up
  CREATE_ADMIN_USER: process.env.PICTOCHAT_CREATE_ADMIN_USER || true,
  /* Directory containing front-end files to be served
     Default path is relative to the compiled app.js file's location in the build directory */
  WEB_CONTENT_DIR: process.env.PICTOCHAT_FRONTEND_DIR || path.join(__dirname, '../../pictochat-fe'),
  PORT: PORT,
  // Origin to accept requests from (http://host:port)
  FRONTEND_REQUEST_ORIGIN: process.env.PICTOCHAT_FRONTEND_REQUEST_ORIGIN || 'http://localhost:3000',
  BCRYPT_SALT_ROUNDS: process.env.PICTOCHAT_BCRYPT_SALT_ROUNDS || 12,
  /* DATABASE */
  DB_HOST: process.env.PICTOCHAT_DB_HOST || 'localhost',
  DB_PORT: parseInt(process.env.PICTOCHAT_DB_PORT) || 5432,
  DB_USER: process.env.PICTOCHAT_DB_USER || 'postgres',
  DB_PASSWORD: process.env.PICTOCHAT_DB_PASSWORD || 'postgres',
  // Database name or schema name (depending on the dialect)
  DB_NAME: process.env.PICTOCHAT_DB_NAME || 'pictochat',
  // Database dialect (see https://sequelize.org/master/manual/dialects.html)
  DB_DIALECT: process.env.PICTOCHAT_DB_DIALECT || 'postgres',
  DB_URL: process.env.DATABASE_URL !== undefined ? process.env.DATABASE_URL : undefined
};

// type casting so IDE's know what properties config has
export default config as typeof config;
