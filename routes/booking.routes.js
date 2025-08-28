const bookingController = require('../controllers/booking.controller');
const authMiddleware = require('../middlewares/auth.middlewares');
const bookingMiddleware = require('../middlewares/booking.middlewares');

// Defines all booking-related routes
const routes = (app) => {
  // Create a new booking
  app.post(
    '/mba/api/v1/bookings',
    authMiddleware.isAuthenticated,
    bookingMiddleware.validateBookingCreateRequest,
    bookingController.create
  );

  // Update booking status/details by ID
  app.patch(
    '/mba/api/v1/bookings/:id',
    authMiddleware.isAuthenticated,
    bookingMiddleware.canChangeStatus,
    bookingController.update
  );

  // Get all bookings for the logged-in user
  app.get(
    '/mba/api/v1/bookings',
    authMiddleware.isAuthenticated,
    bookingController.getBookings
  );

  // Get all bookings (admin only)
  app.get(
    '/mba/api/v1/bookings/all',
    authMiddleware.isAuthenticated,
    authMiddleware.isAdmin,
    bookingController.getAllBookings
  );

  // Get a single booking by ID (for the logged-in user)
  app.get(
    '/mba/api/v1/bookings/:id',
    authMiddleware.isAuthenticated,
    bookingController.getBookingById
  );
};

module.exports = routes;
