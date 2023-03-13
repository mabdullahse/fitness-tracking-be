const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const exerciseSchema = mongoose.Schema(
  {
    metadata: {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      description: {
        type: String,
        required: true,
        trim: true
      },
    },
    filename: {
      type: String,
    },
    contentType: {
      type: String,
    },
    uploadDate: {
      type: Date,
      default: Date.now
    },
    metadata: {
      type: Object
    },
    length: {
      type: Number,
    },
    chunkSize: {
      type: Number,
    }
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
exerciseSchema.plugin(toJSON);
exerciseSchema.plugin(paginate);




const ExerciseSchema = mongoose.model('Exercise', exerciseSchema, 'fs.files');

module.exports = ExerciseSchema;
