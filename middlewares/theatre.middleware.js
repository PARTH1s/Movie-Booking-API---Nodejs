const { errorResponseBody } = require('../utils/responsebody');

/**
 * Utility to send validation error
 */
const sendValidationError = (res, message) => {
  return res.status(400).json({
    ...errorResponseBody,
    err: message,
  });
};

/**
 * Validate request body for creating a theatre
 */
const validateTheatreCreateRequest = (req, res, next) => {
  const { name, pincode, city } = req.body;

  if (!name) {
    return sendValidationError(res, 'The name of the theatre is missing in the request');
  }

  if (!pincode) {
    return sendValidationError(res, 'The pincode of the theatre is missing in the request');
  }

  if (!city) {
    return sendValidationError(res, 'The city of the theatre is missing in the request');
  }

  next(); // Validation passed
};

/**
 * Validate request body for updating movies in a theatre
 */
const validateUpdateMoviesRequest = (req, res, next) => {
  const { insert, movieIds } = req.body;

  if (insert === undefined) {
    return sendValidationError(res, 'The "insert" parameter is missing in the request');
  }

  if (!movieIds) {
    return sendValidationError(res, 'No movies provided in the request to update in theatre');
  }

  if (!Array.isArray(movieIds)) {
    return sendValidationError(res, 'Expected "movieIds" to be an array');
  }

  if (movieIds.length === 0) {
    return sendValidationError(res, 'The "movieIds" array is empty');
  }

  next(); // Validation passed
};

module.exports = {
  validateTheatreCreateRequest,
  validateUpdateMoviesRequest,
};
