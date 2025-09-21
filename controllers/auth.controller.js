const jwt = require('jsonwebtoken');
const userService = require('../services/user.service');
const { successResponseBody, errorResponseBody } = require('../utils/responsebody');

/**
 * Controller for user signup
 * @param req -> HTTP request object
 * @param res -> HTTP response object
 */
const signup = async (req, res) => {
    try {
        // Attempt to create a new user
        const response = await userService.createUser(req.body);

        // Send success response
        successResponseBody.data = response;
        successResponseBody.message = "Successfully registered a user";
        return res.status(201).json(successResponseBody);
    } catch (error) {
        // Handle error response with custom or default message
        return handleErrorResponse(res, error);
    }
};

/**
 * Controller for user signin
 * @param req -> HTTP request object
 * @param res -> HTTP response object
 */
const signin = async (req, res) => {
    try {
        // Fetch user by email
        const user = await userService.getUserByEmail(req.body.email);

        // Validate password
        const isValidPassword = await user.isValidPassword(req.body.password);
        if (!isValidPassword) {
            throw { err: 'Invalid password for the given email', code: 401 };
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.AUTH_KEY,
            { expiresIn: '1h' }
        );

        // Send success response with token and user details
        successResponseBody.message = "Successfully logged in";
        successResponseBody.data = {
            email: user.email,
            role: user.userRole,
            status: user.userStatus,
            token: token
        };

        return res.status(200).json(successResponseBody);
    } catch (error) {
        // Handle error response with custom or default message
        return handleErrorResponse(res, error);
    }
};

/**
 * Controller for resetting user password
 * @param req -> HTTP request object
 * @param res -> HTTP response object
 */
const resetPassword = async (req, res) => {
    try {
        // Fetch user from authenticated request
        const user = await userService.getUserById(req.user);

        // Check if old password is correct
        const isOldPasswordCorrect = await user.isValidPassword(req.body.oldPassword);
        if (!isOldPasswordCorrect) {
            throw { err: 'Invalid old password, please provide the correct old password', code: 403 };
        }

        // Update password and save user
        user.password = req.body.newPassword;
        await user.save();

        // Send success response with updated user data
        successResponseBody.data = user;
        successResponseBody.message = 'Successfully updated the password for the given user';
        return res.status(200).json(successResponseBody);
    } catch (error) {
        // Handle error response with custom or default message
        return handleErrorResponse(res, error);
    }
};

/**
 * Helper function to handle error responses
 * @param res -> HTTP response object
 * @param error -> Error object
 */
const handleErrorResponse = (res, error) => {
    // If error has custom properties, send them, else send default error
    if (error.err) {
        errorResponseBody.err = error.err;
        return res.status(error.code || 500).json(errorResponseBody);
    }
    
    console.error(error); // Log unexpected errors
    errorResponseBody.err = 'An unexpected error occurred';
    return res.status(500).json(errorResponseBody);
};

module.exports = {
    signup,
    signin,
    resetPassword
};
