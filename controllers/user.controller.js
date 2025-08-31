const userService = require('../services/user.service');
const { errorResponseBody, successResponseBody } = require('../utils/responsebody');
const { STATUS } = require('../utils/constants');

/**
 * Controller: Update a user's role or status.
 * - Calls the user service
 * - Returns a standardized success or error response
 */
const update = async (req, res) => {
  try {
    const response = await userService.updateUserRoleOrStatus(req.body, req.params.id);

    return res.status(STATUS.OK).json({
      ...successResponseBody,
      data: response,
      message: 'Successfully updated the user',
    });
  } catch (error) {
    if (error.err) {
      return res.status(error.code || STATUS.BAD_REQUEST).json({
        ...errorResponseBody,
        err: error.err,
      });
    }

    return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
      ...errorResponseBody,
      err: error.message || 'Internal server error',
    });
  }
};

module.exports = {
  update,
};
