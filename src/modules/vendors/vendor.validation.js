const { z } = require('zod');

const addressSchema = z
  .object({
    city: z.string().trim().optional(),
    state: z.string().trim().optional(),
    country: z.string().trim().optional(),
  })
  .optional();

const createVendorSchema = z.object({
  businessName: z.string().trim().min(2, 'businessName must be at least 2 characters'),
  email: z.string().trim().email('Invalid email address'),
  password: z.string().min(6, 'password must be at least 6 characters'),
  phone: z.string().trim().optional(),
  description: z.string().trim().max(1000).optional(),
  address: addressSchema,
});

const updateVendorSchema = z.object({
  businessName: z.string().trim().min(2).optional(),
  phone: z.string().trim().optional(),
  description: z.string().trim().max(1000).optional(),
  status: z.enum(['pending', 'approved', 'suspended']).optional(),
  address: addressSchema,
});

const vendorIdParamSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid vendor id'),
});

module.exports = { createVendorSchema, updateVendorSchema, vendorIdParamSchema };
