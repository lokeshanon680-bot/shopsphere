const express = require('express');
const controller = require('./vendor.controller');
const validate = require('../../middlewares/validate');
const {
  createVendorSchema,
  updateVendorSchema,
  vendorIdParamSchema,
} = require('./vendor.validation');

const router = express.Router();

/**
 * @openapi
 * /api/v1/vendors:
 *   post:
 *     tags: [Vendors]
 *     summary: Register a new vendor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateVendor'
 *     responses:
 *       201:
 *         description: Vendor created
 *   get:
 *     tags: [Vendors]
 *     summary: List vendors (paginated)
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [pending, approved, suspended] }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *     responses:
 *       200:
 *         description: List of vendors
 */
router
  .route('/')
  .post(validate({ body: createVendorSchema }), controller.createVendor)
  .get(controller.listVendors);

/**
 * @openapi
 * /api/v1/vendors/{id}:
 *   get:
 *     tags: [Vendors]
 *     summary: Get a vendor by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Vendor found }
 *       404: { description: Vendor not found }
 *   patch:
 *     tags: [Vendors]
 *     summary: Update a vendor
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateVendor'
 *     responses:
 *       200: { description: Vendor updated }
 *   delete:
 *     tags: [Vendors]
 *     summary: Delete a vendor
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204: { description: Vendor deleted }
 */
router
  .route('/:id')
  .get(validate({ params: vendorIdParamSchema }), controller.getVendor)
  .patch(
    validate({ params: vendorIdParamSchema, body: updateVendorSchema }),
    controller.updateVendor
  )
  .delete(validate({ params: vendorIdParamSchema }), controller.deleteVendor);

module.exports = router;
