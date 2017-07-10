//<------- Import Libraries -------->
// load express & some settings
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;  // heroku port || local port

// load models
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

// load ObjectID from mongodb
const {ObjectID} = require('mongodb');

// load mongoose
const {mongoose} = require('./db/mongoose');

// load body-parser
const bodyParser = require('body-parser');

// laod underscore
const _ = require('underscore');

// load bcryptjs
const bcrypt = require('bcryptjs');

// load authentication method
const auth = require('./authentication/auth');

// load middleware
const middleware = require('./middleware/middleware.js')();

//<------- Middleware Config -------->
app.use(bodyParser.json());


//<------- Todo Section Start (CRUD) -------->
// App Root
app.get('/', middleware.requireAuthentication, (req, res) => {
  res.send("You are at the root of the app");
});

// Create Todo
app.post('/todos', middleware.requireAuthentication, (req, res) => {
  // get user details
  const userId = req.user._id;

  // create a document
  const todo = new Todo({
    description: req.body.description,
    status: req.body.status,
    creator: userId
  });
  // save it to database
   todo.save()
   .then(doc => {
     // doc - json from mongo
     res.status(200).send(doc);
   })
   .catch(err => {
     res.status(400).send(err);
   });
});

// Get All Todos
app.get('/todos', middleware.requireAuthentication, (req, res) => {

  Todo.find({creator: req.user._id})
  .then(allTodos => {
     res.send(allTodos);
  })
  .catch(err => {
    res.status(400).send(err);
  });
});

// Get Todo by id
app.get('/todos/:id', middleware.requireAuthentication, (req, res) => {
  const todoId = req.params.id;
  if(ObjectID.isValid(todoId)) {
    Todo.findOne({_id: todoId, creator: req.user._id})
    .then(todo => {
      if(todo !== null) {
        res.send(todo);
      } else {
        res.status(404).send("No Data Found")
      }
    })
    .catch(err => {
      res.send(err.message);
    });
  } else {
    res.status(400).send('You have not provided a valid Id')
  }
});

// Delete Todo by Id
app.delete('/todos/:id', middleware.requireAuthentication, (req, res) => {
  const todoId = req.params.id;

  if(!ObjectID.isValid(todoId)) {
    return res.status(400).send('Bad Request');
  }


  Todo.findOneAndRemove({_id: todoId, creator: req.user._id})
  .then(todo => {
    if(todo !== null) {
      res.send('Element Deleted Sucessfully');
    } else {
      res.status(404).send('No data found');
    }
  })
  .catch(err => {
    res.status(400).send(err.message);
  });
});

// Update Todo by Id
app.patch('/todos/:id', middleware.requireAuthentication, (req, res) => {
  const todoId = req.params.id;
  const body = _.pick(req.body, 'description', 'status');

  let userInput = {};

  if(!ObjectID.isValid(todoId)) {
    return res.status(400).send('Bad Request');
  }

  // update description
  if(req.body.hasOwnProperty('description') && _.isString(req.body.description) && req.body.description.trim().length > 0) {
    // update the value
     userInput.description = req.body.description.trim();
  } else if (req.body.hasOwnProperty('description')) {
    // return 400
    res.status(400).send("Not appropriate value");
  }

  // update status
  if(req.body.hasOwnProperty('status') && _.isBoolean(req.body.status)) {
    // update the value
     userInput.status = req.body.status;
  } else if (req.body.hasOwnProperty('status')) {
    // return 400
    res.status(400).send("Not appropriate value");
  }

  Todo.findOneAndUpdate({_id: todoId, creator: req.user._id}, {$set: userInput}, {new: true})
  .then(todo => {
    if(todo !== null) {
      res.send(todo);
    } else {
      res.status(404).send('No data found');
    }
  })
  .catch(err => {
    res.status(400).send(err.message);
  });


});

//<------- User Section Start -------->

// Create New User
app.post('/users', (req, res) => {
  // take email & password from user
  const userCred = _.pick(req.body, 'email', 'password');

  // encrypt password
  const hashing = new Promise((resolve, reject) => {
    const salt = bcrypt.genSaltSync(5);
    const hashed_password = bcrypt.hashSync(userCred.password, salt);
    if(hashed_password !== null) {
      resolve(hashed_password);
    } else {
      reject("Something Weired Happen!!");
    }
  })

  // create document
  hashing
  .then(hashed_pw => {
    const user = new User({
      email: userCred.email,
      password: hashed_pw
    });

    // save user to database
    user.save()
    .then(userDetails => {
      res.send(JSON.stringify({id: userDetails._id, email: userDetails.email}, undefined, 2));
    })
    .catch(e => {
      res.status(500).send(e.message);
    });
  })
  .catch(e => {
    res.status(500).send(e);
  });
});

// User Login
app.post('/users/login', (req, res) => {
  // take email & password from user
  const userCred = _.pick(req.body, 'email', 'password');

  if(!_.isString(userCred.email) || !_.isString(userCred.password)) {
    return res.status(400).send('Please enter approprite credentials.')
  }

  auth(userCred)
  .then(user => {
    // generate token
    user.generateAuthToken()
    .then(tokenInstance => {
      res.header('Auth',tokenInstance).send(user.toPublicJSON());
    })
    .catch(err => {
      res.status(500).send(err);
    });
  })
  .catch(e => {
    res.status(400).send(e);
  });
});


// user Logout
  app.delete('/users/logout', middleware.requireAuthentication, (req, res) => {
    const token = req.token;
    //console.log(token);
    User.destroyToken(token)
    .then(user => {
      res.status(200).send(`Logged Out from account: ${user.email}`);
    })
    .catch(err => {
      res.send(err);
    });
  });

//<------- App Listen -------->
app.listen(PORT, () => {
  console.log(`App is started on PORT: ${PORT}`);
});

module.exports = {
  app
};
