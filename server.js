'use strict';

// Load array of notes
const data = require('./db/notes');

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

// GET NOTE WITH SPECIFIC ID

app.get('/api/notes/:noteId', (req, res) => {
  let foundItem = data.find(item => item.id === Number(req.params.noteId));
  res.json(foundItem);
});

// *BEYONCE VOICE* LISTEN

app.listen(8080, function () {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});
