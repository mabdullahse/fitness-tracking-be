const Joi = require('joi');


const createExercise = {
  body: Joi.object().keys({
    // name: Joi.string().required(),
    // description: Joi.string().required(),
    // video: Joi.string().required(),
  }),
};




module.exports = {
  createExercise,
};
