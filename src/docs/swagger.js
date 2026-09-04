const swaggerJsdoc = require('swagger-jsdoc');
const config = require('../config');

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'ShopSphere API',
      version: '1.0.0',
      description:
        'Multi-Vendor E-Commerce Platform — Week 1: Vendor & Product CRUD foundations.',
    },
    servers: [{ url: `http://localhost:${config.port}`, description: 'Local dev server' }],
    components: {
      schemas: {
        CreateVendor: {
          type: 'object',
          required: ['businessName', 'email', 'password'],
          properties: {
            businessName: { type: 'string', example: 'Anitha Textiles' },
            email: { type: 'string', example: 'vendor@example.com' },
            password: { type: 'string', example: 'secret123' },
            phone: { type: 'string', example: '9876543210' },
            description: { type: 'string' },
            address: {
              type: 'object',
              properties: {
                city: { type: 'string' },
                state: { type: 'string' },
                country: { type: 'string' },
              },
            },
          },
        },
        UpdateVendor: {
          type: 'object',
          properties: {
            businessName: { type: 'string' },
            phone: { type: 'string' },
            description: { type: 'string' },
            status: { type: 'string', enum: ['pending', 'approved', 'suspended'] },
          },
        },
        CreateProduct: {
          type: 'object',
          required: ['vendor', 'name', 'price'],
          properties: {
            vendor: { type: 'string', example: '64f1c2e5a1b2c3d4e5f6a7b8' },
            name: { type: 'string', example: 'Handloom Cotton Saree' },
            description: { type: 'string' },
            category: { type: 'string', example: 'apparel' },
            price: { type: 'number', example: 1499 },
            currency: { type: 'string', example: 'INR' },
            stock: { type: 'integer', example: 25 },
            images: { type: 'array', items: { type: 'string' } },
            status: { type: 'string', enum: ['draft', 'active', 'archived'] },
          },
        },
        UpdateProduct: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            description: { type: 'string' },
            category: { type: 'string' },
            price: { type: 'number' },
            stock: { type: 'integer' },
            status: { type: 'string', enum: ['draft', 'active', 'archived'] },
          },
        },
      },
    },
  },
  // Scan route files for @openapi JSDoc comments
  apis: ['./src/modules/**/*.routes.js'],
};

module.exports = swaggerJsdoc(options);
