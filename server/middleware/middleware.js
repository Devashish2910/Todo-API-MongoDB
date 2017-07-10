// load user
const{User} = require('./../models/user');

module.exports = function(req, res, next) {
  return {
    requireAuthentication: function(req, res, next) {
      const token = req.header('Auth');

      User.findByToken(token)
      .then(user => {
        req.token = token;
        req.user = user;
        next();
      })
      .catch(err => {
        res.status(401).send(err);
      });

    }
  }
};
