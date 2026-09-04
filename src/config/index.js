/**
 * Centralized, validated config loader.
 *
 * Why this exists:
 * - Reading `process.env.X` directly all over the codebase means a missing
 *   env var only blows up when that specific line finally runs (often in prod,
 *   often at 2am). Instead we validate everything ONCE at boot and crash
 *   immediately with a clear message if something required is missing.
 */

const dotenv = require('dotenv');
const path = require('path');

// Load the right .env file based on NODE_ENV.
// NODE_ENV=production -> .env.production, otherwise -> .env
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

const REQUIRED_VARS = ['MONGO_URI', 'JWT_SECRET'];

function validateEnv() {
  const missing = REQUIRED_VARS.filter((key) => !process.env[key] || process.env[key].trim() === '');

  if (missing.length > 0) {
    // Fail fast: crash on boot, not on the first request that needs this var.
    console.error('❌ Missing required environment variables:', missing.join(', '));
    console.error(`   Check your ${envFile} file against .env.example`);
    process.exit(1);
  }
}

validateEnv();

const config = Object.freeze({
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 5000,
  mongoUri: process.env.MONGO_URI,
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  corsOrigin: process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map((s) => s.trim())
    : ['http://localhost:3000'],
  isProduction: process.env.NODE_ENV === 'production',
});

module.exports = config;
