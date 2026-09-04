const bcrypt = require('bcryptjs');
const Vendor = require('./vendor.model');
const AppError = require('../../utils/AppError');

const SALT_ROUNDS = 10;

async function createVendor(payload) {
  const { password, ...rest } = payload;
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const vendor = await Vendor.create({ ...rest, passwordHash });
  return vendor;
}

async function listVendors({ status, page = 1, limit = 20 } = {}) {
  const filter = {};
  if (status) filter.status = status;

  const skip = (page - 1) * limit;
  const [vendors, total] = await Promise.all([
    Vendor.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
    Vendor.countDocuments(filter),
  ]);

  return { vendors, total, page: Number(page), limit: Number(limit) };
}

async function getVendorById(id) {
  const vendor = await Vendor.findById(id);
  if (!vendor) {
    throw new AppError('Vendor not found', 404, 'VENDOR_NOT_FOUND');
  }
  return vendor;
}

async function updateVendor(id, updates) {
  const vendor = await Vendor.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });
  if (!vendor) {
    throw new AppError('Vendor not found', 404, 'VENDOR_NOT_FOUND');
  }
  return vendor;
}

async function deleteVendor(id) {
  const vendor = await Vendor.findByIdAndDelete(id);
  if (!vendor) {
    throw new AppError('Vendor not found', 404, 'VENDOR_NOT_FOUND');
  }
  return vendor;
}

module.exports = { createVendor, listVendors, getVendorById, updateVendor, deleteVendor };
