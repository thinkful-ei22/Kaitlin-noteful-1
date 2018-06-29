'use strict'; 

const app = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;
chai.use(chaiHttp);


describe('Noteful App', function () {
  describe('Express static', function () {

    it('GET request "/" should return the index page', function () {
      return chai
        .request(app)
        .get('/')
        .then(function (res) {
          expect(res).to.exist;
          expect(res).to.have.status(200);
          expect(res).to.be.html;
        });
    });
  });

  describe('404 handler', function () {

    it('should respond with 404 when given a bad path', function () {
      return chai
        .request(app)
        .get('/DOES/NOT/EXIST')
        .then(res => {
          expect(res).to.have.status(404);
        });
    });
  });

  // should return the default of 10 Notes as an array
  // should return an array of objects with the id, title and content
  // should return correct search results for a valid query
  // should return an empty array for an incorrect query

  describe('Return Notes Array', function() {
    it('should return return 10 default notes', function() {
      return chai 
        .request(app)
        .get('/api/notes')
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length(10);
        });
    });

    it('should return an array of objects with the id, title, and content', function() {
      return chai
        .request(app)
        .get('/api/notes')
        .then(function(res) {
          expect(res).to.be.json;
          const expectedKeys = ['id', 'title', 'content'];
          res.body.forEach(function(item) {
            expect(item).to.be.a('object');
            expect(item).to.include.keys(expectedKeys);
          });
        });
    });

    it('should return correct search results for a valid query', function() {
      return chai
        .request(app)
        .get('/api/notes?searchTerm=about%20cats')
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length(4);
          expect(res.body[0]).to.be.a('object');
        });
    });
  });

  it('should return an empty array for an incorrect search query', function() {
    return chai
      .request(app)
      .get('/api/notes?searchTerm=Not%20a%20Valid%20Search')
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res.body).to.be.a('array');
        expect(res.body).to.have.length(0);
      });
  });

  // GET /api/notes/:id

  // should return correct note object with id, title and content for a given id
  // should respond with a 404 for an invalid id (/api/notes/DOESNOTEXIST)

  describe('Return by ID', function() {
    it('should return an item by id', function() {
      return chai
        .request(app)
        .get('/api/notes/1000')
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a('object');
          expect(res.body).to.include.keys('id', 'title', 'content');

        });
    });

    it('should return 404 for invalid id', function() {
      return chai
        .request(app)
        .get('/api/notes/DOESNOTEXIST')
        .catch(err => err.response)
        .then(function(res) {
          expect(res).to.have.status(404);
        });
    });
  });

  // POST /api/notes

  // should create and return a new item with location header when provided valid data
  // should return an object with a message property "Missing title in request body" when missing "title" field

  describe('Post a new item', function() {
    it('should create and return a new item w/ location header when provided valid data', function() {
      const newItem = { 'title': 'another article about cats?',
        'content': 'you betcha.' };
      return chai
        .request(app)
        .post('/api/notes')
        .send(newItem)
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.include.keys('id', 'title', 'content');
          expect(res.body.id).to.equal(1010);
          expect(res.body.title).to.equal(newItem.title);
          expect(res.body.content).to.equal(newItem.content);
        });
    });

    it('should return an object with a message when missing "title" field', function() {
      const badItem = { 'content': 'what about dogs?' };
      return chai
        .request(app)
        .post('/api/notes')
        .send(badItem)
        .catch(err => err.response)
        .then(function(res) {
          expect(res).to.have.status(400);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body.message).to.equal('Missing `title` in request body.');

        });
    });

  });

  // PUT /api/notes/:id

  // should update and return a note object when given valid data
  // should respond with a 404 for an invalid id (/api/notes/DOESNOTEXIST)
  // should return an object with a message property "Missing title in request body" when missing "title" field

  describe('PUT api/notes/:id', function() {
    it('should update and return a note object when given valid data', function(){
      const updateItem = {'title': 'dogs are better!', 'content': 'hell yeah they are.'};
      return chai
        .request(app)
        .put('/api/notes/1001')
        .send(updateItem)
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body.title).to.equal(updateItem.title);
          expect(res.body.content).to.equal(updateItem.content);
        });
    });

    it('should respond with 404 for an invalid id', function() {
      const updateItem = {'title': 'dogs are better!', 'content': 'hell yeah they are.'};
      return chai
        .request(app)
        .put('/api/notes/DOESNOTEXIST')
        .send(updateItem)
        .catch(err => err.response)
        .then(function(res) {
          expect(res).to.have.status(404);
        });
    });

    it('should return an object with a message property "Missing title in request body" when missing "title" field', function(){
      const badUpItem = {'content': 'hell yeah they are.'};
      return chai
        .request(app)
        .put('/api/notes/1001')
        .send(badUpItem)
        .catch(err => err.response)
        .then(function(res) {
          expect(res).to.have.status(400);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body.message).to.equal('Missing `title` in request body.');
        });
    });
  });

  // DELETE /api/notes/:id

  // should delete an item by id

  describe('DELETE by id', function() {
    it('should delete an item by the id', function() {
      return chai
        .request(app)
        .delete('/api/notes/1001')
        .then(function(res) {
          expect(res).to.have.status(204);
        });
    });
  });
});