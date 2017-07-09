// load mongoose
const mongoose = require('mongoose');

// load promises
mongoose.Promise = global.Promise;

// connect database
const heroku = 'mongodb://devashish:devashish2910@ds147882.mlab.com:47882/todoapp';
const local = 'mongodb://localhost:27017/TodoApp';
mongoose.connect(heroku || local);

module.exports = {
  mongoose
};
