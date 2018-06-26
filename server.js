'use strict';

// Load array of notes

const { PORT } = require('./configure');
const data = require('./db/notes');
const infoLogger = require('./middleware/logger');

console.log('Hello Noteful!');


// INSERT EXPRESS APP CODE HERE...

const express = require('express');

const app = express();

// ADD STATIC SERVER HERE

app.use(express.static('public'));

// GET LIST OF NOTES + FILTER

app.get('/api/notes', (req, res) => {
  // res.json(data);
  //   res.json(searchedItem);
  let searchedItem = req.query.searchTerm;
  if (searchedItem) {
    let filterdList = data.filter(item => item.title.includes(searchedItem));
    res.json(filterdList);
  } else {
    res.json(data);
  }
});

// LOGGER

app.use(infoLogger);

// GET NOTE WITH SPECIFIC ID

app.get('/api/notes/:noteId', (req, res, next) => {
  let foundItem = data.find(item => item.id === Number(req.params.noteId));
  if (!foundItem) {
    next();
  }
  res.json(foundItem);
});

// ERROR TESTING

app.get('/boom', (req, res, next) => {
  throw new Error('Boom!!');
});

// 404 ERROR

app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  res.status(404).json({ message: 'Not Found' });
});

// CUSTOM ERROR

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});

// LISTEN

app.listen(PORT, function () {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});
