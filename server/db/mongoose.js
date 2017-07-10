// load mongoose
const mongoose = require('mongoose');

// load promises
mongoose.Promise = global.Promise;

// connect database
let enviroment = process.env.NODE_ENV;

if(enviroment === 'production') {
  // link from mLab
  const heroku = 'mongodb://devashish:devashish2910@ds147882.mlab.com:47882/todoapp';
  mongoose.connect(heroku);
} else {
  const local = 'mongodb://localhost:27017/TodoApp';
  mongoose.connect(local);
}

module.exports = {
  mongoose
};
