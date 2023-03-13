const httpStatus = require('http-status');
const { Exercise } = require('../models');
const ApiError = require('../utils/ApiError');
const mongoose = require('mongoose');


const createExercise = async (userBody, gfs) => {
  await gfs.files.updateOne(
    { _id: mongoose.Types.ObjectId(userBody.id) },
    {
      $set: {
        'metadata.name': userBody.metadata.name,
        'metadata.description': userBody.metadata.description,
      },
    }
  );

  return userBody;
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryExercises = async (filter, options) => {
  const users = await Exercise.paginate(filter, options);
  return users;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<Exercise>}
 */
const getExerciseById = async (id) => {
  return Exercise.findById(id);
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<Exercise>}
 */
const getExerciseByEmail = async (email) => {
  return Exercise.findOne({ email });
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<Exercise>}
 */
const updateExerciseById = async (userId, updateBody) => {
  const user = await getExerciseById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Exercise not found');
  }
  if (updateBody.email && (await Exercise.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<Exercise>}
 */
const deleteExerciseById = async (userId) => {
  const user = await getExerciseById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Exercise not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createExercise,
  queryExercises,
  getExerciseById,
  getExerciseByEmail,
  updateExerciseById,
  deleteExerciseById,
};
