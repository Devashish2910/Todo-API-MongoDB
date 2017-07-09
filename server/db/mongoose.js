// load mongoose
const mongoose = require('mongoose');

// load promises
mongoose.Promise = global.Promise;

// connect database
mongoose.connect('mongodb://devashish:devashish2910@ds147882.mlab.com:47882/todoapp' || 'mongodb://localhost:27017/TodoApp');

module.exports = {
  mongoose
};
