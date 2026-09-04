const { z } = require('zod');

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid id');

const createProductSchema = z.object({
  vendor: objectId,
  name: z.string().trim().min(2, 'name must be at least 2 characters'),
  description: z.string().trim().max(2000).optional(),
  category: z.string().trim().optional(),
  price: z.coerce.number().nonnegative('price cannot be negative'),
  currency: z.string().trim().length(3).optional(),
  stock: z.coerce.number().int().nonnegative().optional(),
  images: z.array(z.string().url('each image must be a valid URL')).optional(),
  status: z.enum(['draft', 'active', 'archived']).optional(),
});

const updateProductSchema = z.object({
  name: z.string().trim().min(2).optional(),
  description: z.string().trim().max(2000).optional(),
  category: z.string().trim().optional(),
  price: z.coerce.number().nonnegative().optional(),
  currency: z.string().trim().length(3).optional(),
  stock: z.coerce.number().int().nonnegative().optional(),
  images: z.array(z.string().url()).optional(),
  status: z.enum(['draft', 'active', 'archived']).optional(),
});

const productIdParamSchema = z.object({
  id: objectId,
});

module.exports = { createProductSchema, updateProductSchema, productIdParamSchema };
