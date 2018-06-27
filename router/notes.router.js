'use strict';

// INITIALIZE DATABASE //

const data = require('../db/notes');
const simDB = require('../db/simDB');

const notes = simDB.initialize(data);

// DONE //

const express = require('express');
const notesRouter = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

// GET LIST OF NOTES + FILTER

notesRouter.get('/notes', (req, res, next) => {
  const { searchTerm } = req.query;
    
  notes.filter(searchTerm, (err, list) => {
    if (err) {
      return next(err); // goes to error handler
    }
    res.json(list); // responds with filtered array
  });
});

// GET NOTE WITH SPECIFIC ID

notesRouter.get('/notes/:id', (req, res, next) => {
  const id = req.params.id;
  notes.find(id, (err, list) => {
    if (err) {
      return next(err);
    }
    if (list) {
      res.json(list);
    }
    else {
      next();
    }
  });
});

// PUT (UPDATE) NOTE

notesRouter.put('/notes/:id', (req, res, next) => {
  const id = req.params.id;
    
  /***** Never trust users - validate input *****/
  const updateObj = {};
  const updateFields = ['title', 'content'];
    
  updateFields.forEach(field => {
    if (field in req.body) {
      updateObj[field] = req.body[field];
    }
  });
    
  notes.update(id, updateObj, (err, item) => {
    if (err) {
      return next(err);
    }
    if (item) {
      res.json(item);
    } else {
      next();
    }
  });
});

// POST ENDPOINT //

notesRouter.post('/notes', (req, res, next) => {
  const { title, content } = req.body;

  const newItem = { title, content };
  // Validate!!!
  if (!newItem.title) {
    const err = new Error('Missing `title` in request body.');
    err.status(400);
    return next(err);
  }

  notes.create(newItem, (err, item) => {
    if (err) {
      return next(err);
    }
    if (item) {
      res.location(`http://${req.headers.host}/notes/${item.id}`).status(210).json(item);
    } else {
      next();
    }
  })
});

module.exports = notesRouter;