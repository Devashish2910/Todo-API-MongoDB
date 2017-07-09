// load mongoose
const {mongoose} = require('../db/mongoose.js');

// Schema define
let Schema = mongoose.Schema;

// schema for User
var minlength = [5, 'The value of password is shorter than the minimum allowed length ({minlength}).'];
var maxlength = [50, 'The value of password is greater than the maximum allowed length ({maxlength}).'];
const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: minlength,
    maxlength: maxlength
  }
});

// create model
let User = mongoose.model('User', UserSchema);

// export
module.exports = {
  User
};
