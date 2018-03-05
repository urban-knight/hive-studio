var mongoose = require('mongoose');
const { promisifyAll } = require('bluebird');
promisifyAll(mongoose);

var uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
const options = {}

mongoose.Promise = global.Promise;

var conn = mongoose.connect(uri, options, (err) => {
  console.log("Mongoose connected to [" + process.env.DB_NAME + "]");
});

module.exports = conn;
