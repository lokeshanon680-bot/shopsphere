const express = require('express');
const controller = require('./product.controller');
const validate = require('../../middlewares/validate');
const {
  createProductSchema,
  updateProductSchema,
  productIdParamSchema,
} = require('./product.validation');

const router = express.Router();

/**
 * @openapi
 * /api/v1/products:
 *   post:
 *     tags: [Products]
 *     summary: Create a product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProduct'
 *     responses:
 *       201: { description: Product created }
 *       404: { description: Referenced vendor not found }
 *   get:
 *     tags: [Products]
 *     summary: List products (filter, search, paginate)
 *     parameters:
 *       - in: query
 *         name: vendor
 *         schema: { type: string }
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [draft, active, archived] }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *     responses:
 *       200: { description: List of products }
 */
router
  .route('/')
  .post(validate({ body: createProductSchema }), controller.createProduct)
  .get(controller.listProducts);

/**
 * @openapi
 * /api/v1/products/{id}:
 *   get:
 *     tags: [Products]
 *     summary: Get a product by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Product found }
 *       404: { description: Product not found }
 *   patch:
 *     tags: [Products]
 *     summary: Update a product
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProduct'
 *     responses:
 *       200: { description: Product updated }
 *   delete:
 *     tags: [Products]
 *     summary: Delete a product
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204: { description: Product deleted }
 */
router
  .route('/:id')
  .get(validate({ params: productIdParamSchema }), controller.getProduct)
  .patch(
    validate({ params: productIdParamSchema, body: updateProductSchema }),
    controller.updateProduct
  )
  .delete(validate({ params: productIdParamSchema }), controller.deleteProduct);

module.exports = router;
