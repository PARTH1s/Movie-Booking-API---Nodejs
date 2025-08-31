const User = require('../models/user.model');
const { USER_ROLE, USER_STATUS, STATUS } = require('../utils/constants');

/**
 * Create a new user with role-based status validation.
 * - Customers can only be created with `approved` or no status.
 * - Non-customers are created with `pending` status.
 */
const createUser = async (data) => {
  try {
    // Handle customer role validations
    if (!data.userRole || data.userRole === USER_ROLE.customer) {
      if (data.userStatus && data.userStatus !== USER_STATUS.approved) {
        throw { err: "We cannot set any other status for customer", code: STATUS.BAD_REQUEST };
      }
    }

    // Non-customers always start with `pending` status
    if (data.userRole && data.userRole !== USER_ROLE.customer) {
      data.userStatus = USER_STATUS.pending;
    }

    const response = await User.create(data);
    return response;
  } catch (error) {
    if (error.name === 'ValidationError') {
      const err = {};
      Object.keys(error.errors).forEach((key) => {
        err[key] = error.errors[key].message;
      });
      throw { err, code: STATUS.UNPROCESSABLE_ENTITY || 422 };
    }
    throw error;
  }
};

/**
 * Get a user by email.
 * Throws 404 if no user is found.
 */
const getUserByEmail = async (email) => {
  try {
    const response = await User.findOne({ email });
    if (!response) {
      throw { err: "No user found for the given email", code: STATUS.NOT_FOUND };
    }
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Get a user by ID.
 * Throws 404 if no user is found.
 */
const getUserById = async (id) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      throw { err: "No user found for the given id", code: STATUS.NOT_FOUND };
    }
    return user;
  } catch (error) {
    throw error;
  }
};

/**
 * Update a user's role or status.
 * Returns updated document or 404 if not found.
 */
const updateUserRoleOrStatus = async (data, userId) => {
  try {
    const updateQuery = {};
    if (data.userRole) updateQuery.userRole = data.userRole;
    if (data.userStatus) updateQuery.userStatus = data.userStatus;

    const response = await User.findByIdAndUpdate(userId, updateQuery, {
      new: true,
      runValidators: true,
    });

    if (!response) {
      throw { err: "No user found for the given id", code: STATUS.NOT_FOUND };
    }

    return response;
  } catch (error) {
    if (error.name === 'ValidationError') {
      const err = {};
      Object.keys(error.errors).forEach((key) => {
        err[key] = error.errors[key].message;
      });
      throw { err, code: STATUS.BAD_REQUEST };
    }
    throw error;
  }
};

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
  updateUserRoleOrStatus,
};
