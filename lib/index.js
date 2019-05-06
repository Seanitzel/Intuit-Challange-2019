"use strict";

var _setupTestCases = require("./setupTestCases");

var _CaseSolver = require("./CaseSolver");

var _fs = _interopRequireDefault(require("fs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function generateResults(file) {
  var res = (0, _setupTestCases.formatTaskFile)(file, true).map(function (testCase, i) {
    return "Case #".concat(i + 1, ": ").concat(_CaseSolver.CaseSolver.solve(testCase).answer, "\n");
  });
  res = res.toString().replace(/[,]+/g, '');

  _fs.default.writeFile("./".concat(file, " Solution.txt"), res, function (err) {
    if (err) {
      console.log(err);
      return;
    }

    console.log('Success!');
  });
}

['/task-1.txt', '/task-2.txt'].forEach(function (fileName) {
  return generateResults(fileName);
});