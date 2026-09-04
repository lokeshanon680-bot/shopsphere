const Product = require('./product.model');
const Vendor = require('../vendors/vendor.model');
const AppError = require('../../utils/AppError');

async function createProduct(payload) {
  // Confirm the referenced vendor actually exists before creating the
  // product — cheap check now saves confusing orphaned-reference bugs later.
  const vendorExists = await Vendor.exists({ _id: payload.vendor });
  if (!vendorExists) {
    throw new AppError('Vendor not found for given vendor id', 404, 'VENDOR_NOT_FOUND');
  }

  const product = await Product.create(payload);
  return product;
}

async function listProducts({ vendor, category, status, search, page = 1, limit = 20 } = {}) {
  const filter = {};
  if (vendor) filter.vendor = vendor;
  if (category) filter.category = category;
  if (status) filter.status = status;
  if (search) filter.$text = { $search: search };

  const skip = (page - 1) * limit;
  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate('vendor', 'businessName status')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    Product.countDocuments(filter),
  ]);

  return { products, total, page: Number(page), limit: Number(limit) };
}

async function getProductById(id) {
  const product = await Product.findById(id).populate('vendor', 'businessName status');
  if (!product) {
    throw new AppError('Product not found', 404, 'PRODUCT_NOT_FOUND');
  }
  return product;
}

async function updateProduct(id, updates) {
  const product = await Product.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    throw new AppError('Product not found', 404, 'PRODUCT_NOT_FOUND');
  }
  return product;
}

async function deleteProduct(id) {
  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    throw new AppError('Product not found', 404, 'PRODUCT_NOT_FOUND');
  }
  return product;
}

module.exports = { createProduct, listProducts, getProductById, updateProduct, deleteProduct };
