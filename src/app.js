const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');

const config = require('./config');
const swaggerSpec = require('./docs/swagger');
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');

const authRoutes = require('./modules/auth/auth.routes');
const vendorRoutes = require('./modules/vendors/vendor.routes');
const productRoutes = require('./modules/products/product.routes');

const app = express();

// --- Core middleware ---
app.use(helmet());
app.use(cors({ origin: config.corsOrigin, credentials: true }));
app.use(express.json({ limit: '10kb' })); // small limit: this is a JSON API, not a file upload endpoint
app.use(morgan(config.isProduction ? 'combined' : 'dev'));

// --- Health check (useful for uptime checks / Render / Docker healthcheck) ---
app.get('/health', (req, res) => {
  res.status(200).json({ success: true, status: 'ok', env: config.env });
});

// --- API docs ---
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api-docs.json', (req, res) => res.json(swaggerSpec));

// --- Versioned API routes ---
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/vendors', vendorRoutes);
app.use('/api/v1/products', productRoutes);

// --- 404 + centralized error handler (must be last, in this order) ---
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
