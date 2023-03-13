const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const exerciseValidator = require('../../validations/exercise.validation');
const exerciseController = require('../../controllers/exercise.controller');

const multer = require('multer');
const crypto = require('crypto');
const path = require('path');
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const { GridFsStorage } = require('multer-gridfs-storage');

const ExerciseSchema = require('../../models/exercise.model');
const config = require('../../config/config');
const connection = require('../../config/database');



const router = express.Router();


// Create storage engine
const storage = new GridFsStorage({
  url: config.mongoose.url,
  options: { useUnifiedTopology: true, useNewUrlParser: true },
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'fs',
          metadata: {
            name: req.body.name,
            description: req.body.description,
          },
        };
        resolve(fileInfo);
      });
    });
  },
  schema: ExerciseSchema
});
// Initiate multer upload middleware
const upload = multer({ storage });




router
  .route('/')
  .post(validate(exerciseValidator.createExercise), upload.single('file'), exerciseController.createExercise);

router
  .route('/:fileId')
  .get(exerciseController.getExercise);

router
  .route('/metadata/:fileId')
  .get(exerciseController.getExerciseMetaData);


router
  .route('/:fileId')
  .delete(exerciseController.deleteExercise);

module.exports = router;
