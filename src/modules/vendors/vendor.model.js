const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema(
  {
    businessName: {
      type: String,
      required: true,
      trim: true,
      index: true, // vendors are frequently searched/listed by name
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false, // never return password hash by default
    },
    phone: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'suspended'],
      default: 'pending',
      index: true, // Week 3: filtering approved vendors for storefront listing
    },
    address: {
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      country: { type: String, trim: true },
    },
  },
  {
    timestamps: true,
  }
);

// Compound index anticipating Week 3 queries like "approved vendors in a city"
vendorSchema.index({ status: 1, 'address.city': 1 });

module.exports = mongoose.model('Vendor', vendorSchema);
