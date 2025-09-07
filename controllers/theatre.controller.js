const theatreService = require('../services/theatre.service');
const { successResponseBody, errorResponseBody } = require('../utils/responsebody');
const { STATUS } = require('../utils/constants');
const sendMail = require('../services/email.service');

/**
 * Utility: Send success response
 */
const handleSuccess = (res, status, data, message) => {
    return res.status(status).json({
        ...successResponseBody,
        data,
        message,
    });
};

/**
 * Utility: Send error response
 */
const handleError = (res, error) => {
    if (error?.err && error?.code) {
        return res.status(error.code).json({
            ...errorResponseBody,
            err: error.err,
        });
    }
    return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
        ...errorResponseBody,
        err: error,
    });
};

/**
 * Create a new theatre
 */
const create = async (req, res) => {
    try {
        const response = await theatreService.createTheatre({
            ...req.body,
            owner: req.user,
        });

        // Send confirmation email (async, fire-and-forget)
        sendMail(
            'Successfully created a theatre',
            req.user,
            'You have successfully created a new theatre'
        );

        return handleSuccess(res, STATUS.CREATED, response, 'Successfully created the theatre');
    } catch (error) {
        return handleError(res, error);
    }
};

/**
 * Delete a theatre by ID
 */
const destroy = async (req, res) => {
    try {
        const response = await theatreService.deleteTheatre(req.params.id);
        return handleSuccess(res, STATUS.OK, response, 'Successfully deleted the given theatre');
    } catch (error) {
        return handleError(res, error);
    }
};

/**
 * Fetch a theatre by ID
 */
const getTheatre = async (req, res) => {
    try {
        const response = await theatreService.getTheatre(req.params.id);
        return handleSuccess(res, STATUS.OK, response, 'Successfully fetched the theatre data');
    } catch (error) {
        return handleError(res, error);
    }
};

/**
 * Fetch all theatres (with optional filters)
 */
const getTheatres = async (req, res) => {
    try {
        const response = await theatreService.getAllTheatres(req.query);
        return handleSuccess(res, STATUS.OK, response, 'Successfully fetched all theatres');
    } catch (error) {
        return handleError(res, error);
    }
};

/**
 * Update a theatre by ID
 */
const update = async (req, res) => {
    try {
        const response = await theatreService.updateTheatre(req.params.id, req.body);
        return handleSuccess(res, STATUS.OK, response, 'Successfully updated the theatre');
    } catch (error) {
        return handleError(res, error);
    }
};

/**
 * Add/Remove movies in a theatre
 */
const updateMovies = async (req, res) => {
    try {
        const response = await theatreService.updateMoviesInTheatres(
            req.params.id,
            req.body.movieIds,
            req.body.insert
        );
        return handleSuccess(res, STATUS.OK, response, 'Successfully updated movies in the theatre');
    } catch (error) {
        return handleError(res, error);
    }
};

/**
 * Get movies from a theatre
 */
const getMovies = async (req, res) => {
    try {
        const response = await theatreService.getMoviesInATheatre(req.params.id);
        return handleSuccess(res, STATUS.OK, response, 'Successfully fetched movies for the theatre');
    } catch (error) {
        return handleError(res, error);
    }
};

/**
 * Check if a movie exists in a theatre
 */
const checkMovie = async (req, res) => {
    try {
        const response = await theatreService.checkMovieInATheatre(
            req.params.theatreId,
            req.params.movieId
        );
        return handleSuccess(res, STATUS.OK, response, 'Successfully checked movie presence in theatre');
    } catch (error) {
        return handleError(res, error);
    }
};

module.exports = {
    create,
    destroy,
    getTheatre,
    getTheatres,
    update,
    updateMovies,
    getMovies,
    checkMovie,
};
