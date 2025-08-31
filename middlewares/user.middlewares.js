const { errorResponseBody } = require("../utils/responsebody");

/**
 * Middleware to validate update user requests.
 * Ensures that at least one of `userRole` or `userStatus` is present in the body.
 */
const validateUpdateUserRequest = (req, res, next) => {
  const { userRole, userStatus } = req.body;

  if (!(userRole || userStatus)) {
    return res.status(400).json({
      ...errorResponseBody,
      err: "Malformed request, please provide at least one of 'userRole' or 'userStatus'."
    });
  }

  next();
};

module.exports = {
  validateUpdateUserRequest,
};
