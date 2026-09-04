const mongoose = require('mongoose');
const config = require('../config');

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 3000;

mongoose.set('strictQuery', true);

/**
 * Connect to MongoDB with retry-on-failure.
 * Local MongoDB (or a cold Atlas cluster) sometimes isn't ready the instant
 * the app boots, so we retry a few times with a fixed backoff instead of
 * crashing on the first failed attempt.
 */
async function connectDB(retries = MAX_RETRIES) {
  try {
    await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB connected -> ${mongoose.connection.name} (${config.env})`);
  } catch (err) {
    console.error(`❌ MongoDB connection failed: ${err.message}`);

    if (retries > 0) {
      console.log(`   Retrying in ${RETRY_DELAY_MS / 1000}s... (${retries} attempt(s) left)`);
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
      return connectDB(retries - 1);
    }

    console.error('❌ Exhausted retries. Is MongoDB running locally? (mongod)');
    process.exit(1);
  }
}

// Connection event listeners for visibility during dev
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
  console.log('🔄 MongoDB reconnected');
});

/**
 * Clean shutdown: close the mongoose connection before the process exits
 * so we don't leave hanging sockets (matters more once you're running this
 * behind a process manager / in Docker).
 */
async function shutdownDB(signal) {
  console.log(`\n${signal} received. Closing MongoDB connection...`);
  try {
    await mongoose.connection.close();
    console.log('✅ MongoDB connection closed cleanly. Bye 👋');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error while closing MongoDB connection:', err.message);
    process.exit(1);
  }
}

['SIGINT', 'SIGTERM'].forEach((signal) => {
  process.on(signal, () => shutdownDB(signal));
});

module.exports = { connectDB };
