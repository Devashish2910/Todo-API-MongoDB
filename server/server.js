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

//<------- Middleware Config -------->
app.use(bodyParser.json());


//<------- Todo Section Start (CRUD) -------->
// App Root
app.get('/', (req, res) => {
  res.send("You are at the root of the app");
});

// Create Todo
app.post('/todos', (req, res) => {
  // create a document
  const todo = new Todo({
    description: req.body.description,
    status: req.body.status
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
app.get('/todos', (req, res) => {
  Todo.find()
  .then(allTodos => {
     res.send(allTodos);
  })
  .catch(err => {
    res.status(400).send(err);
  });
});

// Update Todo By Id

// Get Todo by id
app.get('/todos/:id', (req, res) => {
  const todoId = req.params.id;
  if(ObjectID.isValid(todoId)) {
    Todo.findById(todoId)
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
app.delete('/todos/:id', (req, res) => {
  const todoId = req.params.id;

  if(!ObjectID.isValid(todoId)) {
    return res.status(400).send('Bad Request');
  }

  Todo.findByIdAndRemove(todoId)
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

//<------- User Section Start -------->


//<------- App Listen -------->
app.listen(PORT, () => {
  console.log(`App is started on PORT: ${PORT}`);
});

module.exports = {
  app
};
