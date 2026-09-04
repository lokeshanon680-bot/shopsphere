const express = require('express');

const router = express.Router();

/**
 * Auth module is scaffolded here (routes/controller/service/model pattern
 * kept consistent with vendors & products) so the folder structure is
 * ready to go. Per the assignment brief, full authentication & application
 * security work — login, JWT issuance, password reset, RBAC middleware —
 * is Week 2 scope and will be built out in auth.controller.js /
 * auth.service.js.
 */

/**
 * @openapi
 * /api/v1/auth/status:
 *   get:
 *     tags: [Auth]
 *     summary: Auth module placeholder (Week 2 will add login/register/JWT)
 *     responses:
 *       200: { description: Module scaffolded, not yet implemented }
 */
router.get('/status', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Auth module scaffolded. Login/JWT/RBAC land in Week 2.',
  });
});

module.exports = router;
