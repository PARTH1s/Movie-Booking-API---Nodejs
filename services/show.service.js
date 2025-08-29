/**
 * Service Layer for Shows
 * Handles CRUD operations with validation and error handling
 */

const Show = require('../models/show.model');
const Theatre = require('../models/theatre.model');
const { STATUS } = require('../utils/constants');

/**
 * Create a new show
 * @param {Object} data - show details
 * @returns {Promise<Object>} - created show
 */
const createShow = async (data) => {
    try {
        // Check if theatre exists
        const theatre = await Theatre.findById(data.theatreId);
        if (!theatre) {
            throw { err: 'No theatre found', code: STATUS.NOT_FOUND };
        }

        // Ensure the movie is available in that theatre
        if (!theatre.movies.includes(data.movieId)) {
            throw {
                err: 'Movie is not available in the requested theatre',
                code: STATUS.NOT_FOUND
            };
        }

        // Create and return new show
        return await Show.create(data);
    } catch (error) {
        if (error.name === 'ValidationError') {
            const err = {};
            for (const key of Object.keys(error.errors)) {
                err[key] = error.errors[key].message;
            }
            throw { err, code: STATUS.UNPROCESSABLE_ENTITY };
        }
        throw error;
    }
};

/**
 * Fetch shows with optional filters (theatreId, movieId)
 * @param {Object} filters - query filters
 * @returns {Promise<Array>} - list of shows
 */
const getShows = async (filters) => {
    try {
        const query = {};
        if (filters.theatreId) query.theatreId = filters.theatreId;
        if (filters.movieId) query.movieId = filters.movieId;

        const response = await Show.find(query)
            .populate('theatreId')
            .populate('movieId');

        if (!response || response.length === 0) {
            throw { err: 'No shows found', code: STATUS.NOT_FOUND };
        }

        return response;
    } catch (error) {
        throw error;
    }
};

/**
 * Delete a show by ID
 * @param {String} id - show ID
 * @returns {Promise<Object>} - deleted show
 */
const deleteShow = async (id) => {
    try {
        const response = await Show.findByIdAndDelete(id);
        if (!response) {
            throw { err: 'No show found', code: STATUS.NOT_FOUND };
        }
        return response;
    } catch (error) {
        throw error;
    }
};

/**
 * Update a show by ID
 * @param {String} id - show ID
 * @param {Object} data - fields to update
 * @returns {Promise<Object>} - updated show
 */
const updateShow = async (id, data) => {
    try {
        const response = await Show.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true
        });

        if (!response) {
            throw { err: 'No show found for the given ID', code: STATUS.NOT_FOUND };
        }

        return response;
    } catch (error) {
        if (error.name === 'ValidationError') {
            const err = {};
            for (const key of Object.keys(error.errors)) {
                err[key] = error.errors[key].message;
            }
            throw { err, code: STATUS.UNPROCESSABLE_ENTITY };
        }
        throw error;
    }
};

module.exports = {
    createShow,
    getShows,
    deleteShow,
    updateShow
};
