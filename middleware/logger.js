'use strict';

const myLogger = (req,res,next) => {
  const now = new Date();
  res.json(`${now.toLocaleDateString()} ${now.toLocaleTimeString()} ${req.method} ${req.url}`);
  next(); // go to `next` middleware
};

module.exports = myLogger;