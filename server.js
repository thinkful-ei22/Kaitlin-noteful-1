'use strict';

// Load array of notes

const { PORT } = require('./config');
const data = require('./db/notes');

console.log('Hello Noteful!');


// INSERT EXPRESS APP CODE HERE...

const express = require('express');
const morgan = require('morgan');
const app = express();
const notesRouter = require('./router/notes.router');

// LOGGER

app.use(morgan('common'));

// ADD STATIC SERVER HERE

app.use(express.static('public'));

// PARSE REQUEST BODY

app.use(express.json());

// ADD ROUTERS //

app.use('/api', notesRouter);

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

if (require.main === module) {
  app.listen(PORT, function () {
    console.info(`Server listening on ${this.address().port}`);
  }).on('error', err => {
    console.error(err);
  });
}

module.exports = app;
