const userController = require('../controllers/user.controller');
const userMiddleware = require('../middlewares/user.middlewares');
const authMiddleware = require('../middlewares/auth.middlewares');

/**
 * User-related routes.
 * @param {object} app - Express app instance
 */
const route = (app) => {
  /**
   * Update user by ID
   * - Requires authentication
   * - Validates request body
   * - Only accessible by Admins
   */
  app.patch(
    '/mba/api/v1/user/:id',
    authMiddleware.isAuthenticated,
    userMiddleware.validateUpdateUserRequest,
    authMiddleware.isAdmin,
    userController.update
  );
};

module.exports = route;
