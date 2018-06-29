'use strict'; 

const app = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;
chai.use(chaiHttp);


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
  it('should return the default array of notes', function() {
    return chai 
      .request(app)
      .get('/api/notes')
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res.body).to.be.a('array');
        expect(res.body).to.have.length(10);
        const expectedKeys = ['id', 'title', 'content'];
        res.body.forEach(function(item) {
          expect(item).to.be.a('object');
          expect(item).to.include.keys(expectedKeys);
        });
      });
  });
});

// GET /api/notes/:id
// should return correct note object with id, title and content for a given id
// should respond with a 404 for an invalid id (/api/notes/DOESNOTEXIST)

// describe('Return by ID', function() {
//   it('should return an item by id', function(id) {
//     return chai
//       .request(app)
//       .get(`api/notes/${id}`)
//       .then(function(res) {
//         expect(res).to.have.status(200);
//         const expectedKeys = ['id', 'title', 'content'];

//       });
//   });
// });