const httpStatus = require('http-status');
const mongoose = require('mongoose');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { exerciseService } = require('../services');
const { Exercise } = require('../models');
const Grid = require('gridfs-stream');
const connection = require('../config/database');



// Create GridFS stream
let gfs, gridFsBucket;
connection.once('open', () => {

  gridFsBucket = new mongoose.mongo.GridFSBucket(connection.db, {
    bucketName: 'fs'
  });

  gfs = Grid(connection.db, mongoose.mongo);
  gfs.collection('fs');

});


const createExercise = catchAsync(async (req, res) => {
  const user = await exerciseService.createExercise({ ...req.file, metadata: { ...req.body } }, gfs);
  res.status(httpStatus.CREATED).send(user);
});


const getExercise = catchAsync(async (req, res) => {

  gfs.files.findOne({ _id: mongoose.Types.ObjectId(req.params.fileId) }, (err, file) => {
    console.log(file);
    if (err || !file) {
      return res.status(404).send('File not found');
    }
    res.set('Content-Type', file.contentType);
    const readstream = gridFsBucket.openDownloadStream(file._id);
    readstream.pipe(res);

    // send file data along with metadata
    readstream.pipe(res).on('finish', () => {
      console.log('it has finished');
    });
  });
});

const getExerciseMetaData = catchAsync(async (req, res) => {

  gfs.files.findOne({ _id: mongoose.Types.ObjectId(req.params.fileId) }, (err, file) => {
    console.log(file);
    if (err || !file) {
      return res.status(404).send('File not found');
    }
    res.json(file);
  });
});

const deleteExercise = catchAsync(async (req, res) => {

  gridFsBucket.delete(mongoose.Types.ObjectId(req.params.fileId), function (err, result) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'File deleted successfully' });
  });
});



module.exports = {
  createExercise,
  getExercise,
  getExerciseMetaData,
  deleteExercise
};
