'use strict';

const fs = require('fs');

const replaceWord = function (word, singleName) {
  if (word.toLowerCase() === 'example' || word.toLowerCase() === 'exampleschema') {
    switch (word) {
      case 'exampleSchema':
        return singleName + 'Schema';
      case 'Example':
        let capital = singleName.charAt(0).toUpperCase() + singleName.slice(1, singleName.length);
        return capital;
      case 'example':
        return singleName;
    }
  }
  return word;
};

const model = function (rsName) {
  const singleName = rsName.slice(0, rsName.length - 1);
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

  promiseReadFile('./app/models/example.js', { encoding: 'utf8' })
    .then((data) => {
      let words = data.split(/([^A-Za-z])/);
      return words.map((word) => {
        if((/\w+/).test(word)) {
          return replaceWord(word, singleName);
        }
        return word;
      }).join('');
    })
    .then((js) => promiseWriteFile('./app/models/' + singleName + '.js', js, 'w'))
    .catch(console.error)
    ;
};

module.exports = model;
