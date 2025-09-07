const theatreController = require('../controllers/theatre.controller');
const theatreMiddleware = require('../middlewares/theatre.middleware');
const authMiddleware = require('../middlewares/auth.middlewares');

/**
 * Theatre Routes
 * @param {object} app - Express app instance
 */
const routes = (app) => {
    /**
     * CREATE a new theatre
     */
    app.post(
        '/mba/api/v1/theatres',
        authMiddleware.isAuthenticated,
        authMiddleware.isAdminOrClient,
        theatreMiddleware.validateTheatreCreateRequest,
        theatreController.create
    );

    /**
     * DELETE a theatre by ID
     */
    app.delete(
        '/mba/api/v1/theatres/:id',
        authMiddleware.isAuthenticated,
        authMiddleware.isAdminOrClient,
        theatreController.destroy
    );

    /**
     * READ a single theatre by ID
     */
    app.get('/mba/api/v1/theatres/:id', theatreController.getTheatre);

    /**
     * READ all theatres (with optional query filters)
     */
    app.get('/mba/api/v1/theatres', theatreController.getTheatres);

    /**
     * UPDATE a theatre by ID (partial update)
     */
    app.patch(
        '/mba/api/v1/theatres/:id',
        authMiddleware.isAuthenticated,
        authMiddleware.isAdminOrClient,
        theatreController.update
    );

    /**
     * UPDATE a theatre by ID (full update)
     * Note: Consider removing this if PATCH already handles updates
     */
    app.put(
        '/mba/api/v1/theatres/:id',
        authMiddleware.isAuthenticated,
        authMiddleware.isAdminOrClient,
        theatreController.update
    );

    /**
     * UPDATE movies in a theatre (add/remove)
     */
    app.patch(
        '/mba/api/v1/theatres/:id/movies',
        authMiddleware.isAuthenticated,
        authMiddleware.isAdminOrClient,
        theatreMiddleware.validateUpdateMoviesRequest,
        theatreController.updateMovies
    );

    /**
     * READ all movies in a theatre
     */
    app.get('/mba/api/v1/theatres/:id/movies', theatreController.getMovies);

    /**
     * CHECK if a specific movie exists in a theatre
     */
    app.get(
        '/mba/api/v1/theatres/:theatreId/movies/:movieId',
        theatreController.checkMovie
    );
};

module.exports = routes;
