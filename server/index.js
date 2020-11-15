'use strict';

module.exports = app => {
  let express = require('express'); // eslint-disable-line node/no-extraneous-require
  let path = require('path');
  app.use('/coverage', express.static(path.join(__dirname, '..', 'coverage')));
};
