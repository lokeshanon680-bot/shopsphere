const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor',
      required: true,
      index: true, // "all products for vendor X" is a Week 1 core query
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      sparse: true, // allow multiple docs without a slug during creation flow
    },
    description: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    category: {
      type: String,
      trim: true,
      index: true, // Week 3: category-based browsing/filtering
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    images: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['draft', 'active', 'archived'],
      default: 'draft',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Anticipating Week 3 storefront query: active products in a category,
// newest first, scoped to a vendor.
productSchema.index({ vendor: 1, status: 1, createdAt: -1 });
productSchema.index({ category: 1, status: 1 });

// Text index for basic search-by-name/description (Week 3 search feature).
productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
