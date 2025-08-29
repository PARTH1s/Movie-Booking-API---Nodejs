/**
 * Middleware for validating Booking requests
 */

const { STATUS, USER_ROLE, BOOKING_STATUS } = require('../utils/constants');
const { errorResponseBody } = require('../utils/responsebody');
const { Types } = require('mongoose');
const { ObjectId } = Types;

const theatreService = require('../services/theatre.service');
const userService = require('../services/user.service');

/**
 * Utility to build a fresh error response (avoids shared mutation issues)
 */
const buildError = (message) => ({
    ...errorResponseBody,
    err: message
});

/**
 * Validate request body for creating a booking
 */
const validateBookingCreateRequest = async (req, res, next) => {
    const { theatreId, movieId, timing, noOfSeats } = req.body;

    // Validate theatre ID
    if (!theatreId) {
        return res.status(STATUS.BAD_REQUEST).json(buildError("No theatre ID provided"));
    }
    if (!ObjectId.isValid(theatreId)) {
        return res.status(STATUS.BAD_REQUEST).json(buildError("Invalid theatre ID format"));
    }

    // Check if theatre exists
    const theatre = await theatreService.getTheatre(theatreId);
    if (!theatre) {
        return res.status(STATUS.NOT_FOUND).json(buildError("No theatre found for the given ID"));
    }

    // Validate movie ID
    if (!movieId) {
        return res.status(STATUS.BAD_REQUEST).json(buildError("No movie ID provided"));
    }
    if (!ObjectId.isValid(movieId)) {
        return res.status(STATUS.BAD_REQUEST).json(buildError("Invalid movie ID format"));
    }

    // Check if movie is running in the given theatre
    if (!theatre.movies.includes(movieId)) {
        return res.status(STATUS.NOT_FOUND).json(
            buildError("The requested movie is not available in this theatre")
        );
    }

    // Validate timing
    if (!timing) {
        return res.status(STATUS.BAD_REQUEST).json(buildError("No movie timing provided"));
    }

    // Validate seat count
    if (!noOfSeats) {
        return res.status(STATUS.BAD_REQUEST).json(buildError("No seat count provided"));
    }

    // Request passed all validations
    next();
};

/**
 * Restrict booking status change based on user role
 */
const canChangeStatus = async (req, res, next) => {
    const user = await userService.getUserById(req.user);

    // Customers can only cancel, not change status arbitrarily
    if (
        user.userRole === USER_ROLE.customer &&
        req.body.status &&
        req.body.status !== BOOKING_STATUS.cancelled
    ) {
        return res
            .status(STATUS.UNAUTHORIZED) // fixed typo: UNAUTHORISED → UNAUTHORIZED
            .json(buildError("You are not allowed to change the booking status"));
    }

    next();
};

module.exports = {
    validateBookingCreateRequest,
    canChangeStatus
};
