'use strict';

const controller = require('./controller');
const model = require('./model');
let rsName = process.argv[2];


const scaffold = function() {
  controller(rsName);
  model(rsName);
};

scaffold();

module.exports = scaffold;
