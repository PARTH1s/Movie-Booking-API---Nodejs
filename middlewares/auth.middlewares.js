const jwt = require('jsonwebtoken');
const { errorResponseBody } = require('../utils/responsebody');
const userService = require('../services/user.service');
const { USER_ROLE, STATUS } = require('../utils/constants');

/**
 * Middleware to validate user signup request
 * @param req -> HTTP request object
 * @param res -> HTTP response object
 * @param next -> Next middleware function
 */
const validateSignupRequest = async (req, res, next) => {
    // Check for user name
    if (!req.body.name) {
        return sendErrorResponse(res, "Name of the user not present in the request");
    }

    // Check for user email
    if (!req.body.email) {
        return sendErrorResponse(res, "Email of the user not present in the request");
    }

    // Check for user password
    if (!req.body.password) {
        return sendErrorResponse(res, "Password of the user not present in the request");
    }

    // If all validations pass, proceed to next middleware
    next();
};

/**
 * Middleware to validate user signin request
 * @param req -> HTTP request object
 * @param res -> HTTP response object
 * @param next -> Next middleware function
 */
const validateSigninRequest = async (req, res, next) => {
    // Check for user email
    if (!req.body.email) {
        return sendErrorResponse(res, "No email provided for sign in");
    }

    // Check for user password
    if (!req.body.password) {
        return sendErrorResponse(res, "No password provided for sign in");
    }

    // If all validations pass, proceed to next middleware
    next();
};

/**
 * Middleware to check if the user is authenticated via JWT token
 * @param req -> HTTP request object
 * @param res -> HTTP response object
 * @param next -> Next middleware function
 */
const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.headers["x-access-token"];

        // Ensure token is provided
        if (!token) {
            return sendErrorResponse(res, "No token provided", STATUS.FORBIDDEN);
        }

        // Verify the token
        const decodedToken = jwt.verify(token, process.env.AUTH_KEY);

        // If verification fails, send error
        if (!decodedToken) {
            return sendErrorResponse(res, "Token not verified", STATUS.UNAUTHORISED);
        }

        // Fetch user details and attach to request object
        const user = await userService.getUserById(decodedToken.id);
        req.user = user.id;

        // Proceed to next middleware
        next();
    } catch (error) {
        handleJwtError(error, res);
    }
};

/**
 * Middleware to validate reset password request
 * @param req -> HTTP request object
 * @param res -> HTTP response object
 * @param next -> Next middleware function
 */
const validateResetPasswordRequest = (req, res, next) => {
    // Check for old password
    if (!req.body.oldPassword) {
        return sendErrorResponse(res, 'Missing the old password in the request');
    }

    // Check for new password
    if (!req.body.newPassword) {
        return sendErrorResponse(res, 'Missing the new password in the request');
    }

    // If all validations pass, proceed to next middleware
    next();
};

/**
 * Middleware to check if the user has admin role
 * @param req -> HTTP request object
 * @param res -> HTTP response object
 * @param next -> Next middleware function
 */
const isAdmin = async (req, res, next) => {
    await checkUserRole(req, res, USER_ROLE.admin, "User is not an admin, cannot proceed with the request", next);
};

/**
 * Middleware to check if the user has client role
 * @param req -> HTTP request object
 * @param res -> HTTP response object
 * @param next -> Next middleware function
 */
const isClient = async (req, res, next) => {
    await checkUserRole(req, res, USER_ROLE.client, "User is not a client, cannot proceed with the request", next);
};

/**
 * Middleware to check if the user has either admin or client role
 * @param req -> HTTP request object
 * @param res -> HTTP response object
 * @param next -> Next middleware function
 */
const isAdminOrClient = async (req, res, next) => {
    const user = await userService.getUserById(req.user);
    if (![USER_ROLE.admin, USER_ROLE.client].includes(user.userRole)) {
        return sendErrorResponse(res, "User is neither a client nor an admin, cannot proceed with the request");
    }
    next();
};

/**
 * Helper function to send error response
 * @param res -> HTTP response object
 * @param message -> Error message
 * @param statusCode -> HTTP status code (optional, default 400)
 */
const sendErrorResponse = (res, message, statusCode = STATUS.BAD_REQUEST) => {
    errorResponseBody.err = message;
    return res.status(statusCode).json(errorResponseBody);
};

/**
 * Helper function to handle JWT verification errors
 * @param error -> Error object
 * @param res -> HTTP response object
 */
const handleJwtError = (error, res) => {
    if (error.name === "JsonWebTokenError") {
        return sendErrorResponse(res, error.message, STATUS.UNAUTHORISED);
    }
    if (error.code === STATUS.NOT_FOUND) {
        return sendErrorResponse(res, "User doesn't exist", error.code);
    }
    return sendErrorResponse(res, "Internal Server Error", STATUS.INTERNAL_SERVER_ERROR);
};

/**
 * Helper function to check user role and proceed or send error response
 * @param req -> HTTP request object
 * @param res -> HTTP response object
 * @param requiredRole -> Required user role
 * @param errorMessage -> Error message if role mismatch
 * @param next -> Next middleware function
 */
const checkUserRole = async (req, res, requiredRole, errorMessage, next) => {
    const user = await userService.getUserById(req.user);
    if (user.userRole !== requiredRole) {
        return sendErrorResponse(res, errorMessage, STATUS.UNAUTHORISED);
    }
    next();
};

module.exports = {
    validateSignupRequest,
    validateSigninRequest,
    isAuthenticated,
    validateResetPasswordRequest,
    isAdmin,
    isClient,
    isAdminOrClient
};
