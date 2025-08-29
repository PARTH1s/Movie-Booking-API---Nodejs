/**
 * Controller for managing Show-related requests
 * Handles CRUD operations: create, read, update, delete
 */

const showService = require('../services/show.service');
const { successResponseBody, errorResponseBody } = require('../utils/responsebody');
const { STATUS } = require('../utils/constants');

/**
 * Helper function to handle errors consistently
 */
const handleError = (res, error) => {
    if (error.err) {
        errorResponseBody.err = error.err;
        return res.status(error.code).json(errorResponseBody);
    }

    errorResponseBody.err = error;
    return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
};

/**
 * Create a new show
 */
const create = async (req, res) => {
    try {
        const response = await showService.createShow(req.body);

        successResponseBody.message = "Successfully created the show";
        successResponseBody.data = response;

        return res.status(STATUS.CREATED).json(successResponseBody);
    } catch (error) {
        return handleError(res, error);
    }
};

/**
 * Get all shows (supports query filters)
 */
const getShows = async (req, res) => {
    try {
        const response = await showService.getShows(req.query);

        successResponseBody.message = "Successfully fetched the movie shows";
        successResponseBody.data = response;

        return res.status(STATUS.OK).json(successResponseBody);
    } catch (error) {
        return handleError(res, error);
    }
};

/**
 * Delete a show by ID
 */
const destroy = async (req, res) => {
    try {
        const response = await showService.deleteShow(req.params.id);

        successResponseBody.message = "Successfully deleted the show";
        successResponseBody.data = response;

        return res.status(STATUS.OK).json(successResponseBody);
    } catch (error) {
        return handleError(res, error);
    }
};

/**
 * Update a show by ID
 */
const update = async (req, res) => {
    try {
        const response = await showService.updateShow(req.params.id, req.body);

        successResponseBody.message = "Successfully updated the show";
        successResponseBody.data = response;

        return res.status(STATUS.OK).json(successResponseBody);
    } catch (error) {
        console.error("Update Show Error:", error);
        return handleError(res, error);
    }
};

module.exports = {
    create,
    getShows,
    destroy,
    update
};
