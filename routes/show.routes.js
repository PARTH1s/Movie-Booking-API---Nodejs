/**
 * Routes for Show APIs
 * Handles CRUD operations on shows
 */

const showController = require('../controllers/show.controller');
const authMiddlewares = require('../middlewares/auth.middlewares');
const showMiddlewares = require('../middlewares/show.middlewares');

const routes = (app) => {
    /**
     * Create a new show
     * Requires: Authenticated + Admin/Client role
     */
    app.post(
        '/mba/api/v1/shows',
        authMiddlewares.isAuthenticated,
        authMiddlewares.isAdminOrClient,
        showMiddlewares.validateCreateShowRequest,
        showController.create
    );

    /**
     * Get all shows
     * Public route
     */
    app.get('/mba/api/v1/shows', showController.getShows);

    /**
     * Delete a show by ID
     * Requires: Authenticated + Admin/Client role
     */
    app.delete(
        '/mba/api/v1/shows/:id',
        authMiddlewares.isAuthenticated,
        authMiddlewares.isAdminOrClient,
        showController.destroy
    );

    /**
     * Update a show by ID
     * Requires: Authenticated + Admin/Client role
     */
    app.patch(
        '/mba/api/v1/shows/:id',
        authMiddlewares.isAuthenticated,
        authMiddlewares.isAdminOrClient,
        showMiddlewares.validateShowUpdateRequest,
        showController.update
    );
};

module.exports = routes;
