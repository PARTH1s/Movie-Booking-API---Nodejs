const Booking = require('../models/booking.model');
const Show = require('../models/show.model');
const { STATUS } = require('../utils/constants');

// Create a new booking and calculate total cost
const createBooking = async (data) => {
  try {
    const show = await Show.findOne({
      movieId: data.movieId,
      theatreId: data.theatreId,
      _id: data.showId,
    });

    if (!show) {
      throw { err: 'Show not found', code: STATUS.NOT_FOUND };
    }

    data.totalCost = data.noOfSeats * show.price;
    const response = await Booking.create(data);
    await show.save();

    return response.populate('movieId theatreId');
  } catch (error) {
    if (error.name === 'ValidationError') {
      const err = {};
      Object.keys(error.errors).forEach((key) => {
        err[key] = error.errors[key].message;
      });
      throw { err, code: STATUS.UNPROCESSABLE_ENTITY };
    }
    throw error;
  }
};

// Update an existing booking by ID
const updateBooking = async (data, bookingId) => {
  try {
    const response = await Booking.findByIdAndUpdate(bookingId, data, {
      new: true,
      runValidators: true,
    });

    if (!response) {
      throw { err: 'No booking found for the given id', code: STATUS.NOT_FOUND };
    }

    return response;
  } catch (error) {
    if (error.name === 'ValidationError') {
      const err = {};
      Object.keys(error.errors).forEach((key) => {
        err[key] = error.errors[key].message;
      });
      throw { err, code: STATUS.UNPROCESSABLE_ENTITY };
    }
    throw error;
  }
};

// Get all bookings for a specific user
const getBookings = async (data) => {
  try {
    return await Booking.find(data);
  } catch (error) {
    throw error;
  }
};

// Get all bookings in the system
const getAllBookings = async () => {
  try {
    return await Booking.find();
  } catch (error) {
    throw error;
  }
};

// Get a single booking by ID and validate ownership
const getBookingById = async (id, userId) => {
  try {
    const response = await Booking.findById(id);

    if (!response) {
      throw { err: 'No booking records found for the id', code: STATUS.NOT_FOUND };
    }

    if (response.userId.toString() !== userId.toString()) {
      throw { err: 'Not able to access the booking', code: STATUS.UNAUTHORISED };
    }

    return response;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createBooking,
  updateBooking,
  getBookings,
  getAllBookings,
  getBookingById,
};
