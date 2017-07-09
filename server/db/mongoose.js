// load mongoose
const mongoose = require('mongoose');

// load promises
mongoose.Promise = global.Promise;

// connect database
mongoose.connect('mongodb://localhost:27017/TodoApp');

module.exports = {
  mongoose
};
