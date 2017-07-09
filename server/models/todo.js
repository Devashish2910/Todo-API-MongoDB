// load mongoose
const {mongoose} = require('../db/mongoose.js');

// Schema define
let Schema = mongoose.Schema;

// create model for storing data (tables)
 // schema for Todo
 // const TodoSchema = new Schema({
 //   description: {
 //     type: String,
 //     required: true,
 //     minlength: 1,
 //     trim: true
 //   },
 //   status: {
 //     type: Boolean,
 //     default: false
 //   },
 //   completedAt: {
 //     type: Number
 //   }
 // });

 // create model
 let Todo = mongoose.model('Todo', {
   description: {
     type: String,
     required: true,
     minlength: 1,
     trim: true
   },
   status: {
     type: Boolean,
     default: false
   },
   completedAt: {
     type: Number,
     default: null
   }
 });

module.exports = {
  Todo
};
