// load users
const {User} = require('./../models/user');

// load bcrypt
const bcrypt = require('bcryptjs');

module.exports = function(userCreds) {
  //console.log(userCreds);
  return new Promise((resolve, reject) => {
    User.findOne({email: userCreds.email})
    .then(userDetails => {
      // compare both passwords
      if(bcrypt.compareSync(userCreds.password, userDetails.get('password'))) {
        resolve(userDetails);
      } else {
        reject('Password is wrong!!');
      }
    })
    .catch(e => {
      console.log(User);
      reject("No User Found");
    })
  });
};
