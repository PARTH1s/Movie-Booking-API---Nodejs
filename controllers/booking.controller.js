const { successResponseBody, errorResponseBody } = require('../utils/responsebody');
const bookingService = require('../services/booking.service');
const { STATUS } = require('../utils/constants');

// Create a new booking for the logged-in user
const create = async (req, res) => {
  try {
    const userId = req.user;
    const response = await bookingService.createBooking({ ...req.body, userId });
    successResponseBody.message = 'Successfully created a booking';
    successResponseBody.data = response;
    return res.status(STATUS.CREATED).json(successResponseBody);
  } catch (error) {
    if (error.err) {
      errorResponseBody.err = error.err;
      return res.status(error.code).json(errorResponseBody);
    }
    errorResponseBody.err = error;
    return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
  }
};

// Update an existing booking by ID
const update = async (req, res) => {
  try {
    const response = await bookingService.updateBooking(req.body, req.params.id);
    successResponseBody.data = response;
    successResponseBody.message = 'Successfully updated the booking';
    return res.status(STATUS.OK).json(successResponseBody);
  } catch (error) {
    if (error.err) {
      errorResponseBody.err = error.err;
      return res.status(error.code).json(errorResponseBody);
    }
    errorResponseBody.err = error;
    return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
  }
};

// Get all bookings for the logged-in user
const getBookings = async (req, res) => {
  try {
    const response = await bookingService.getBookings({ userId: req.user });
    successResponseBody.data = response;
    successResponseBody.message = 'Successfully fetched the bookings';
    return res.status(STATUS.OK).json(successResponseBody);
  } catch (error) {
    errorResponseBody.err = error;
    return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
  }
};

// Get all bookings in the system
const getAllBookings = async (req, res) => {
  try {
    const response = await bookingService.getAllBookings();
    successResponseBody.data = response;
    successResponseBody.message = 'Successfully fetched the bookings';
    return res.status(STATUS.OK).json(successResponseBody);
  } catch (error) {
    errorResponseBody.err = error;
    return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
  }
};

// Get a single booking by ID for the logged-in user
const getBookingById = async (req, res) => {
  try {
    const response = await bookingService.getBookingById(req.params.id, req.user);
    successResponseBody.data = response;
    successResponseBody.message = 'Successfully fetched the booking';
    return res.status(STATUS.OK).json(successResponseBody);
  } catch (error) {
    if (error.err) {
      errorResponseBody.err = error.err;
      return res.status(error.code).json(errorResponseBody);
    }
    errorResponseBody.err = error;
    return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
  }
};

module.exports = {
  create,
  update,
  getBookings,
  getAllBookings,
  getBookingById,
};
