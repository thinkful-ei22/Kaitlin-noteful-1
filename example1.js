const express = require('express');
const app = express();

const myMiddlewareFunc = (req, res, next) => {

  console.log(req.url);

  if (false) {
    // return a response
    return res.json({msg: 'someMessage'});
  }
  else {
    // call next to trigger next middleware function
    next();
  }
};

app.use(myMiddlewareFunc);

app.get('/api/foo', (req, res) => {
  return res.json({foo: 'bar'});
});

app.get('/api/bar', (req, res) => {
  return res.json({bar: 'foo'});
});

app.listen(8080);