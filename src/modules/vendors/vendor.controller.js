const vendorService = require('./vendor.service');
const catchAsync = require('../../utils/catchAsync');

// Controllers stay thin: parse request -> call service -> shape response.
// No business logic, no direct Mongoose calls here.

const createVendor = catchAsync(async (req, res) => {
  const vendor = await vendorService.createVendor(req.body);
  res.status(201).json({ success: true, data: vendor });
});

const listVendors = catchAsync(async (req, res) => {
  const result = await vendorService.listVendors(req.query);
  res.status(200).json({ success: true, ...result });
});

const getVendor = catchAsync(async (req, res) => {
  const vendor = await vendorService.getVendorById(req.params.id);
  res.status(200).json({ success: true, data: vendor });
});

const updateVendor = catchAsync(async (req, res) => {
  const vendor = await vendorService.updateVendor(req.params.id, req.body);
  res.status(200).json({ success: true, data: vendor });
});

const deleteVendor = catchAsync(async (req, res) => {
  await vendorService.deleteVendor(req.params.id);
  res.status(204).send();
});

module.exports = { createVendor, listVendors, getVendor, updateVendor, deleteVendor };
