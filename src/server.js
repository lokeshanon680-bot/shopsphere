const app = require('./app');
const config = require('./config');
const { connectDB } = require('./db/connection');

async function start() {
  await connectDB();

  const server = app.listen(config.port, () => {
    console.log(`🚀 ShopSphere API running on http://localhost:${config.port} [${config.env}]`);
    console.log(`📖 Swagger docs: http://localhost:${config.port}/api-docs`);
  });

  // Catch programmer errors that slip past the error middleware
  // (e.g. an unhandled rejection from a stray promise) and shut down
  // cleanly instead of continuing in a broken state.
  process.on('unhandledRejection', (err) => {
    console.error('❌ Unhandled Rejection:', err);
    server.close(() => process.exit(1));
  });
}

start();
