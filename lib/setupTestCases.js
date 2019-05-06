"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatTaskFile = formatTaskFile;

function formatTaskFile(file) {
  var node = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var dataRows = (node ? readFile(file) : file).split('\n');
  var formattedData = {
    length: parseInt(dataRows.splice(0, 1)[0]),
    testCases: []
  };
  var counter, testCase;
  dataRows.forEach(function (row) {
    var rowAsArray = row.split(' ').map(function (val) {
      return parseInt(val);
    });

    if (rowAsArray.length === 3) {
      formattedData.testCases.push(testCase);
      testCase = newTestCase(rowAsArray);
      counter = testCase.b + testCase.h;
    } else {
      var positionType = 'boxPositions';

      if (counter <= testCase.h) {
        positionType = 'hunterPositions';
      }

      counter--;
      testCase[positionType].push(rowAsArray);
    }
  });
  formattedData.testCases.splice(0, 1);
  return formattedData.testCases;
}

function newTestCase(sizes) {
  return {
    n: sizes[0],
    b: sizes[1],
    h: sizes[2],
    boxPositions: [],
    hunterPositions: []
  };
} // Reads a file and returns its contents as a string.


function readFile(filename) {
  var fs = require('fs');

  return fs.readFileSync(__dirname + filename, 'utf8', function (err, data) {
    if (err) {
      throw err;
    }

    return data;
  });
}