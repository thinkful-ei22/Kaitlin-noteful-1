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
    
  notes.filter(searchTerm)
    .then(list => {
      if (list) {
        res.json(list);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});

// GET NOTE WITH SPECIFIC ID

notesRouter.get('/notes/:id', (req, res, next) => {
  const id = req.params.id;

  notes.find(id)
    .then(item => {
      if (item) {
        res.json(item);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
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

  if (!updateObj.title) {
    const err = new Error('Missing `title` in request body.');
    err.status = 400;
    return next(err);
  }
    
  notes.update(id, updateObj)
    .then(item => {
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
    err.status = 400;
    return next(err);
  }

  notes.create(newItem)
    .then(item => {
      if (item) {
        res.json(item);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});

// DELETE //

notesRouter.delete('/notes/:id', (req, res, next) => {
  if (req.params.id) {
    
    notes.delete(req.params.id)
      .then(item => {
        if (item) {
          res.status(204).end();
        } else {
          next();
        }
      })
      .catch(err => {
        next(err);
      });
  }
});

module.exports = notesRouter;