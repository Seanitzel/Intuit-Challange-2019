"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TestCaseBuilder = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// Builds a test case and returns its magic carpet.
var TestCaseBuilder =
/*#__PURE__*/
function () {
  function TestCaseBuilder(testCase) {
    _classCallCheck(this, TestCaseBuilder);

    this.testCase = testCase;
  } // Builder that returns magic carpet for a test case.


  _createClass(TestCaseBuilder, [{
    key: "createMagicCarpet",
    // Creates a magic carpet for a test case.
    value: function createMagicCarpet() {
      var carpet = [];

      for (var i = 0; i < this.testCase.n; ++i) {
        carpet.push(new Array(this.testCase.n));
      }

      this.magicCarpet = carpet;
      return this;
    } //Fill the carpet with its data.

  }, {
    key: "fillCarpet",
    value: function fillCarpet() {
      return this.fillPositions(this.testCase.boxPositions, 'B').fillPositions(this.testCase.hunterPositions, 'H');
    } // Positions are defined using arrays where the first member is the column
    // and the second one is the row.
    // This was how the data for the challenge was set-up...

  }, {
    key: "fillPositions",
    value: function fillPositions(positions, value) {
      var _this = this;

      positions.forEach(function (position) {
        var ROW_INDEX = position[1] - 1,
            COL_INDEX = position[0] - 1;
        _this.magicCarpet[ROW_INDEX][COL_INDEX] = value;
      });
      return this;
    }
  }], [{
    key: "build",
    value: function build(testCase) {
      return new TestCaseBuilder(testCase).createMagicCarpet().fillCarpet().magicCarpet;
    }
  }]);

  return TestCaseBuilder;
}();

exports.TestCaseBuilder = TestCaseBuilder;