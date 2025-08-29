/**
 * Middleware for validating Show requests
 */

const { STATUS } = require('../utils/constants');
const { errorResponseBody } = require('../utils/responsebody');
const { Types } = require('mongoose');
const { ObjectId } = Types;

/**
 * Utility to build a fresh error response (avoids mutation issues)
 */
const buildError = (message) => ({
    ...errorResponseBody,
    err: message
});

/**
 * Validate request body for creating a new show
 */
const validateCreateShowRequest = (req, res, next) => {
    const { theatreId, movieId, timing, noOfSeats, price } = req.body;

    // Validate theatre ID
    if (!theatreId) {
        return res.status(STATUS.BAD_REQUEST).json(buildError("No theatre provided"));
    }
    if (!ObjectId.isValid(theatreId)) {
        return res.status(STATUS.BAD_REQUEST).json(buildError("Invalid theatre id"));
    }

    // Validate movie ID
    if (!movieId) {
        return res.status(STATUS.BAD_REQUEST).json(buildError("No movie provided"));
    }
    if (!ObjectId.isValid(movieId)) {
        return res.status(STATUS.BAD_REQUEST).json(buildError("Invalid movie id"));
    }

    // Validate timing
    if (!timing) {
        return res.status(STATUS.BAD_REQUEST).json(buildError("No timing provided"));
    }

    // Validate seat count
    if (!noOfSeats) {
        return res.status(STATUS.BAD_REQUEST).json(buildError("No seat info provided"));
    }

    // Validate price
    if (!price) {
        return res.status(STATUS.BAD_REQUEST).json(buildError("No price information provided"));
    }

    next();
};

/**
 * Validate request body for updating an existing show
 * Restricts changing theatreId or movieId
 */
const validateShowUpdateRequest = (req, res, next) => {
    if (req.body.theatreId || req.body.movieId) {
        return res
            .status(STATUS.BAD_REQUEST)
            .json(buildError("Cannot update theatre or movie for an existing show"));
    }
    next();
};

module.exports = {
    validateCreateShowRequest,
    validateShowUpdateRequest
};
