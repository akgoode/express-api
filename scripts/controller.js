'use strict';

const fs = require('fs');
const rsName = process.argv[2];

const replaceWord = function (word) {
  if (word.toLowerCase() === 'example' || word.toLowerCase() === 'examples') {
    switch (word) {
      case 'Example':
        let capital = rsName.charAt(0).toUpperCase() + rsName.slice(1, rsName.length - 1);
        return capital;
      case 'example':
        return rsName.slice(0, rsName.length - 1);
      case 'examples':
        return rsName;
    }
  }
  return word;
};

const controller = function (filename, outFileFlag) {

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

  promiseReadFile('./app/controllers/examples.js', { encoding: 'utf8' })
    .then((data) => {
      let newArray = [];
      let words = data.split(/([^A-Za-z])/);
      // console.log(words);
      words.forEach((word) => {
        if((/\w+/).test(word)) {
          newArray.push(replaceWord(word));
          return;
        }
        newArray.push(word);
      });
      return newArray.join('');
    })
    .then((js) => promiseWriteFile('./app/controllers/' + filename + '.js', js, outFileFlag))
    .catch(console.error)
    ;
};

module.exports = controller;
