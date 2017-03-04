'use strict';

const fs = require('fs');
const transform = require('./transform');

const controller = function (rsName) {

  const promiseReadFile = function (inFile, options) {
    return new Promise( (resolve, reject) => {
      fs.readFile(inFile, options, (error, data) => {
        if (error) {
          reject(error);
        }

        resolve(data);
      });
    });
  };

  const promiseWriteFile = function (outFile, data, outFileFlag) {
    return new Promise( (resolve, reject) => {
      fs.writeFile(outFile, data, { flag: outFileFlag }, (error) => {
        if (error) {
          reject(error);
        }

        resolve(true);
      });
    });
  };

  promiseReadFile('./generate/ex-controller.js', { encoding: 'utf8' })
    .then((data) => {
      return transform(data, rsName);
    })
    .then((js) => promiseWriteFile('./app/controllers/' + rsName[0] + '.js', js, 'w'))
    .catch(console.error)
    ;
};

module.exports = controller;
