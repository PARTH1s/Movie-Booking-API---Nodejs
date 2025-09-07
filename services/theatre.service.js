const Theatre = require('../models/theatre.model');
const Movie = require('../models/movie.model');
const { STATUS } = require('../utils/constants');

/**
 * Utility to extract Mongoose validation errors
 */
const formatValidationError = (error) => {
    const err = {};
    Object.keys(error.errors).forEach((key) => {
        err[key] = error.errors[key].message;
    });
    return err;
};

/**
 * Create a new theatre
 * @param {object} data - Theatre details
 * @returns {Promise<object>} Newly created theatre
 */
const createTheatre = async (data) => {
    try {
        return await Theatre.create(data);
    } catch (error) {
        if (error.name === 'ValidationError') {
            throw { err: formatValidationError(error), code: STATUS.UNPROCESSABLE_ENTITY };
        }
        console.error('Error creating theatre:', error);
        throw error;
    }
};

/**
 * Delete a theatre by ID
 * @param {string} id - Theatre ID
 * @returns {Promise<object>} Deleted theatre
 */
const deleteTheatre = async (id) => {
    try {
        const response = await Theatre.findByIdAndDelete(id);
        if (!response) {
            throw { err: 'No record of a theatre found for the given id', code: STATUS.NOT_FOUND };
        }
        return response;
    } catch (error) {
        console.error('Error deleting theatre:', error);
        throw error;
    }
};

/**
 * Get a single theatre by ID
 * @param {string} id - Theatre ID
 * @returns {Promise<object>} Theatre object
 */
const getTheatre = async (id) => {
    try {
        const response = await Theatre.findById(id);
        if (!response) {
            throw { err: 'No theatre found for the given id', code: STATUS.NOT_FOUND };
        }
        return response;
    } catch (error) {
        console.error('Error fetching theatre:', error);
        throw error;
    }
};

/**
 * Get all theatres (with optional filters and pagination)
 * @param {object} data - Filter and pagination options
 * @returns {Promise<Array>} List of theatres
 */
const getAllTheatres = async (data) => {
    try {
        const query = {};
        const pagination = {};

        if (data?.city) query.city = data.city;
        if (data?.pincode) query.pincode = data.pincode;
        if (data?.name) query.name = data.name;
        if (data?.movieId) query.movies = { $all: data.movieId };

        if (data?.limit) pagination.limit = parseInt(data.limit, 10);
        if (data?.skip) {
            const perPage = data.limit ? parseInt(data.limit, 10) : 3;
            pagination.skip = data.skip * perPage;
        }

        return await Theatre.find(query, {}, pagination);
    } catch (error) {
        console.error('Error fetching theatres:', error);
        throw error;
    }
};

/**
 * Update a theatre by ID
 * @param {string} id - Theatre ID
 * @param {object} data - Update data
 * @returns {Promise<object>} Updated theatre
 */
const updateTheatre = async (id, data) => {
    try {
        const response = await Theatre.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        });
        if (!response) {
            throw { err: 'No theatre found for the given id', code: STATUS.NOT_FOUND };
        }
        return response;
    } catch (error) {
        if (error.name === 'ValidationError') {
            throw { err: formatValidationError(error), code: STATUS.UNPROCESSABLE_ENTITY };
        }
        console.error('Error updating theatre:', error);
        throw error;
    }
};

/**
 * Add or remove movies from a theatre
 * @param {string} theatreId - Theatre ID
 * @param {Array<string>} movieIds - List of movie IDs
 * @param {boolean} insert - true = add movies, false = remove movies
 * @returns {Promise<object>} Updated theatre with populated movies
 */
const updateMoviesInTheatres = async (theatreId, movieIds, insert) => {
    try {
        const update = insert
            ? { $addToSet: { movies: { $each: movieIds } } }
            : { $pull: { movies: { $in: movieIds } } };

        const theatre = await Theatre.findByIdAndUpdate({ _id: theatreId }, update, { new: true });

        if (!theatre) {
            throw { err: 'No theatre found for the given id', code: STATUS.NOT_FOUND };
        }

        return theatre.populate('movies');
    } catch (error) {
        console.error('Error updating movies in theatre:', error);
        throw error;
    }
};

/**
 * Get all movies in a theatre
 * @param {string} id - Theatre ID
 * @returns {Promise<object>} Theatre with populated movies
 */
const getMoviesInATheatre = async (id) => {
    try {
        const theatre = await Theatre.findById(id, {
            name: 1,
            movies: 1,
            address: 1,
        }).populate('movies');

        if (!theatre) {
            throw { err: 'No theatre with the given id found', code: STATUS.NOT_FOUND };
        }
        return theatre;
    } catch (error) {
        console.error('Error fetching movies for theatre:', error);
        throw error;
    }
};

/**
 * Check if a movie exists in a theatre
 * @param {string} theatreId - Theatre ID
 * @param {string} movieId - Movie ID
 * @returns {Promise<boolean>} True if movie exists in theatre
 */
const checkMovieInATheatre = async (theatreId, movieId) => {
    try {
        const response = await Theatre.findById(theatreId);
        if (!response) {
            throw { err: 'No such theatre found for the given id', code: STATUS.NOT_FOUND };
        }
        return response.movies.includes(movieId);
    } catch (error) {
        console.error('Error checking movie in theatre:', error);
        throw error;
    }
};

module.exports = {
    createTheatre,
    deleteTheatre,
    getTheatre,
    getAllTheatres,
    updateTheatre,
    updateMoviesInTheatres,
    getMoviesInATheatre,
    checkMovieInATheatre,
};
