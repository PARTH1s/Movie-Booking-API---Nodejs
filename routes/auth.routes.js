const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middlewares');

/**
 * Route configuration for authentication-related endpoints
 * @param app -> Express application instance
 */
const routes = (app) => {
    // User signup route with validation and controller handling
    app.post(
        '/mba/api/v1/auth/signup',
        authMiddleware.validateSignupRequest,  // Validate user input for signup
        authController.signup                  // Handle user signup
    );

    // User signin route with validation and controller handling
    app.post(
        '/mba/api/v1/auth/signin',
        authMiddleware.validateSigninRequest,  // Validate user input for signin
        authController.signin                  // Handle user signin
    );

    // Password reset route with authentication and validation
    app.patch(
        '/mba/api/v1/auth/reset',
        authMiddleware.isAuthenticated,       // Ensure user is authenticated
        authMiddleware.validateResetPasswordRequest,  // Validate password reset request
        authController.resetPassword          // Handle password reset
    );
}

module.exports = routes;
