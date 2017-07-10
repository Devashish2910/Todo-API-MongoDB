// load mongoose
const {mongoose} = require('../db/mongoose.js');

// load validator
const validate = require('validator');

//load JWT
const JWT = require('jsonwebtoken');

// Schema define
let Schema = mongoose.Schema;

// load bcrypt-js
const bcrypt = require('bcryptjs');


// schema for User
var minlength = [5, 'The value of password is shorter than the minimum allowed length ({MINLENGTH}).'];
var maxlength = [200, 'The value of password is greater than the maximum allowed length ({MAXLENGTH}).'];
const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase:true,
    validate: {
      validator: (value) => validate.isEmail(value),
      message: '{VALUE} is not a valid email. Please, try with different email.'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: minlength,
    maxlength: maxlength
  },
  tokens: [{
    access:{
      type: String,
      required: true
    },
    token:{
      type: String,
      required: true
    }
  }]
});

// // Authentication Method
// UserSchema.statics.authentication = function(userCreds) {
//   const User = this;
//   const email = userCreds.email;
//   return new Promise((resolve, reject) => {
//     User.findOne({email})
//     .then(userDetails => {
//
//       // compare both passwords
//       if(bcrypt.compareSync(userCreds.password, userDetails.get('password'))) {
//         resolve(userDetails);
//       } else {
//         reject('Password is wrong!!');
//       }
//     })
//     .catch(e => {
//       //console.log(User);
//       reject("No User Found");
//     })
//   });
// };

// User Public JSON
UserSchema.methods.toPublicJSON = function() {
  const user = this;
  return {
    id: user._id,
    email: user.email
  };
};

// Token Generate
UserSchema.methods.generateAuthToken = function() {
  return new Promise((resolve, reject) => {
      const user = this;
      const access = 'auth';
      const id = user._id.toString();
      const tokenData = {
        id,
        access
      };
    const token = JWT.sign({token: tokenData}, 'deva2910').toString();

    if(user.tokens.length > 0) {
      while(user.tokens.length > 0) {
        user.tokens.pop();
      }
      user.tokens.push({access, token});
    } else {
      user.tokens.push({access, token});
    }

    user.save()
      .then(user => {
        resolve(token);
      })
      .catch(e => {
        reject(e.message);
      })
  });
};

// Destroy Token
UserSchema.statics.destroyToken = function(token) {

 return new Promise((resolve, reject) => {
   const User = this;
   User.findByToken(token)
   .then(user => {
       while(user.tokens.length > 0) {
         user.tokens.pop();
       }
       user.save()
         .then(user => {
           resolve(user);
         })
         .catch(e => {
           reject(e.message);
         })
     })
   .catch(err => {
       reject(err);
     });
   })
   .catch(err => {
     reject(err);
   });

};

// Find By Token
UserSchema.statics.findByToken = function(token) {
  return new Promise((resolve, reject) => {
    const User = this;
    try {
      // decode token
      const decodedToken = JWT.verify(token, 'deva2910');
      //console.log(decodedToken);
      if (decodedToken !== null) {
        // find user from token number
        User.findById(decodedToken.token.id)
        .then(user => {
        if(user.tokens.length === 1) {
          resolve(user);
        } else {
          reject('Session Expired!!')
        }
        })
        .catch(err => {
          reject('Session Expired!!');
        });
      } else {
        reject('Session Expired!!');
      }
    } catch(e) {
      reject('Session Expired!!');
    }
  });
};

// Authenticating Require Middleware
// UserSchema.statics.requireAuthentication = function(req, res, next) {
//   const token = req.header('Auth');
//   const User = this;
//
//   User.findByToken(token)
//   .then(user => {
//     req.token = token;
//     req.user = user;
//     next();
//   })
//   .catch(err => {
//     res.status(401).send(err.message);
//   });
// };


// create model
let User = mongoose.model('User', UserSchema);

// export
module.exports = {
  User
};
