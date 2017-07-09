//<------- Import Libraries -------->
// load express & some settings
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;  // heroku port || local port

// load models
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

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
  res.send("You are at the root of the app.");
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


//<------- User Section Start -------->


//<------- App Listen -------->
app.listen(PORT, () => {
  console.log(`App is started on PORT: ${PORT}`);
});
