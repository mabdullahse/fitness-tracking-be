const mongoose = require('mongoose');

const config = require("./config");

const connection = mongoose.createConnection(config.mongoose.url, config.mongoose.option);

connection.on("error", function (error) {

    logger.info('Error connecting to MongoDB');
    logger.error(error);

});


module.exports = connection;