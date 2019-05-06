"use strict";

var _setupTestCases = require("./setupTestCases");

var _CaseSolver = require("./CaseSolver");

var _fs = _interopRequireDefault(require("fs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var firstSet = '/task-1.txt';
var secondSet = '/task-2.txt';

function generateResults(file) {
  var res = (0, _setupTestCases.formatTaskFile)(file, true).map(function (testCase, i) {
    return "Case #".concat(i + 1, ": ").concat(_CaseSolver.CaseSolver.solve(testCase).answer, "\n");
  }); // res = formatTaskFile(file, true).slice(135, 145).map((testCase, i) => {
  //     return `Case #${i + 131}: ${CaseSolver.solve(testCase).answer}\n`
  // })

  res = res.toString().replace(/[,]+/g, '');

  _fs.default.writeFile("./".concat(file, "-answers2.txt"), res, function (err) {
    if (err) {
      console.log(err);
      return;
    }

    console.log('Success!');
  });
}

function forceGC() {
  if (global.gc) {
    global.gc();
  } else {
    console.warn('No GC hook! Start your program as `node --expose-gc file.js`.');
  }
}

generateResults(firstSet);