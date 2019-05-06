"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CaseSolver = void 0;

var _TestCaseBuilder = require("./TestCaseBuilder");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// Represents a case solver.
var CaseSolver =
/*#__PURE__*/
function () {
  function CaseSolver(testCase) {
    _classCallCheck(this, CaseSolver);

    this.magicCarpet = _TestCaseBuilder.TestCaseBuilder.build(testCase);
    this.isOdd ? this.initOdd() : this.initEven();
    this.huntersAdded = 0;
  } // For the first task - initializes segments for an even carpet.


  _createClass(CaseSolver, [{
    key: "initEven",
    value: function initEven() {
      var center = this.center;
      this.topLeftQuarter = CaseSolver.carpetSegment(0, center, 0, center);
      this.topRightQuarter = CaseSolver.carpetSegment(0, center, center, this.n);
      this.bottomLeftQuarter = CaseSolver.carpetSegment(center, this.n, 0, center);
      this.bottomRightQuarter = CaseSolver.carpetSegment(center, this.n, center, this.n);
    } // For the second task - initializes segments for an odd carpet.

  }, {
    key: "initOdd",
    value: function initOdd() {
      var center = this.center;
      this.topLeftQuarter = CaseSolver.carpetSegment(0, center, 0, center);
      this.topRightQuarter = CaseSolver.carpetSegment(0, center, center + 1, this.n);
      this.bottomLeftQuarter = CaseSolver.carpetSegment(center + 1, this.n, 0, center);
      this.bottomRightQuarter = CaseSolver.carpetSegment(center + 1, this.n, center + 1, this.n);
      this.centerLeft = CaseSolver.carpetSegment(center, center + 1, 0, center);
      this.centerRight = CaseSolver.carpetSegment(center, center + 1, center + 1, this.n);
      this.centerTop = CaseSolver.carpetSegment(0, center, center, center + 1);
      this.centerBottom = CaseSolver.carpetSegment(center + 1, this.n, center, center + 1);
    } // Used for making it easier to access all the sements that are related

  }, {
    key: "evaluateCarpet",
    // Evaluates a magic carpet - fills each segment with its number of hunters, boxes etc
    value: function evaluateCarpet() {
      var _this = this;

      var segments = ['topLeftQuarter', 'bottomLeftQuarter', 'topRightQuarter', 'bottomRightQuarter'];

      if (this.isOdd) {
        var centerSegments = ['centerLeft', 'centerRight', 'centerTop', 'centerBottom'];
        segments = segments.concat(centerSegments);
      }

      segments.forEach(function (segment) {
        return _this.evaluateSegment(_this[segment]);
      });
      return this;
    } // Evaluates a segment from the magic carpet

  }, {
    key: "evaluateSegment",
    value: function evaluateSegment(segment) {
      for (var i = segment.rowStart; i < segment.rowEnd; ++i) {
        for (var j = segment.colStart; j < segment.colEnd; ++j) {
          this.updateSegment({
            row: i,
            col: j
          }, segment);
        }
      }
    } // Updates the cell of a segment with the data from the carpet.

  }, {
    key: "updateSegment",
    value: function updateSegment(cell, segment) {
      var value = this.magicCarpet[cell.row][cell.col];

      if (value === 'H') {
        segment.hunters++;
      } else if (value === 'B') {
        segment.boxes++;
      } else {
        segment.empty++;
        segment.emptyCellIndices.push(cell);
      }
    } // Adds hunter at an empty cell in a segment and the magic carpet, returns false if it didnt.

  }, {
    key: "addHunter",
    value: function addHunter(segment) {
      var cell = segment.emptyCellIndices.pop();

      if (!cell) {
        return false;
      }

      this.magicCarpet[cell.row][cell.col] = 'H';
      segment.hunters++;
      segment.empty--;
      this.huntersAdded++;
      return true;
    } // Whether the carpet is balanced.

  }, {
    key: "isBalanced",
    value: function isBalanced() {
      return this.topBottomBalanced() && this.leftRightBalanced();
    } // Whether the top and bottom halfs are balanced.

  }, {
    key: "topBottomBalanced",
    value: function topBottomBalanced() {
      return this.topHalfHunters === this.bottomHalfHunters;
    } // Whether the left and right halfs are balanced.

  }, {
    key: "leftRightBalanced",
    value: function leftRightBalanced() {
      return this.leftHalfHunters === this.rightHalfHunters;
    } // Returns the number of hunters in the top half.

  }, {
    key: "balanceSegments",
    // if 2 segments can be balanced it balances them and returns true, else returns false.
    value: function balanceSegments(seg1, seg2) {
      if (seg1.hunters === seg2.hunters) {
        return true;
      }

      return seg1.hunters > seg2.hunters ? this.addHuntersToSegment(seg1.hunters - seg2.hunters, seg2) : this.addHuntersToSegment(seg2.hunters - seg1.hunters, seg1);
    } // Adds hunters to a segment in order to balance it, returns true if the number
    // of hunters couldn't be added.

  }, {
    key: "addHuntersToSegment",
    value: function addHuntersToSegment(hunters, segment) {
      while (hunters && segment.emptyCellIndices.length) {
        if (!this.addHunter(segment)) {
          break;
        }

        hunters--;
      }

      return !hunters;
    } // Attempts to balance an odd carpet, returns true it did, else false

  }, {
    key: "balanceSegmentsOdd",
    value: function balanceSegmentsOdd() {
      if (!this.topBottomBalanced()) {
        var difference = this.topHalfHunters - this.bottomHalfHunters;
        difference > 0 ? this.addHuntersToSegment(difference, this.centerBottom) : this.addHuntersToSegment(Math.abs(difference), this.centerTop);
      }

      if (!this.leftRightBalanced()) {
        var _difference = this.leftHalfHunters - this.rightHalfHunters;

        _difference > 0 ? this.addHuntersToSegment(_difference, this.centerRight) : this.addHuntersToSegment(Math.abs(_difference), this.centerLeft);
      }

      return this.isBalanced();
    } // Adds hunters to the maximum in 2 segments of the carpet.

  }, {
    key: "addMoreHunters",
    value: function addMoreHunters(segment1, segment2) {
      while (segment1.emptyCellIndices.length && segment2.emptyCellIndices.length) {
        this.addHunter(segment2);
        this.addHunter(segment1);
      }
    } // Only for odd carpets, fills the center if possible.

  }, {
    key: "finalTouch",
    value: function finalTouch() {
      if (this.isOdd) {
        var CENTER = Math.floor(this.n / 2);

        if (!this.magicCarpet[CENTER][CENTER]) {
          this.magicCarpet[CENTER][CENTER] = 'H';
          this.huntersAdded++;
        }
      }
    }
  }, {
    key: "isOdd",
    // Returns whether the magic carpet is odd type
    get: function get() {
      return !!(this.magicCarpet.length % 2);
    } // The size of the magic carpet

  }, {
    key: "n",
    get: function get() {
      return this.magicCarpet.length;
    } // Returns the [floored] center index of the magic carpet

  }, {
    key: "center",
    get: function get() {
      return Math.floor(this.magicCarpet.length / 2);
    }
  }, {
    key: "topHalfHunters",
    get: function get() {
      var top = CaseSolver.huntersInSegments([this.topLeftQuarter, this.topRightQuarter]);
      return this.isOdd ? top + this.centerTop.hunters : top;
    } // Returns the number of hunters in the bottom half.

  }, {
    key: "bottomHalfHunters",
    get: function get() {
      var bottom = CaseSolver.huntersInSegments([this.bottomLeftQuarter, this.bottomRightQuarter]);
      return this.isOdd ? bottom + this.centerBottom.hunters : bottom;
    } // Returns the number of hunters in the left half.

  }, {
    key: "leftHalfHunters",
    get: function get() {
      var left = CaseSolver.huntersInSegments([this.topLeftQuarter, this.bottomLeftQuarter]);
      return this.isOdd ? left + this.centerLeft.hunters : left;
    } // Returns the number of hunters in the right half.

  }, {
    key: "rightHalfHunters",
    get: function get() {
      var right = CaseSolver.huntersInSegments([this.topRightQuarter, this.bottomRightQuarter]);
      return this.isOdd ? right + this.centerRight.hunters : right;
    }
  }], [{
    key: "segmentCouple",
    value: function segmentCouple(seg1, seg2) {
      return {
        seg1: seg1,
        seg2: seg2
      };
    } // Returns a object representing a carpet segment.

  }, {
    key: "carpetSegment",
    value: function carpetSegment(rowStart, rowEnd, colStart, colEnd) {
      return {
        hunters: 0,
        empty: 0,
        boxes: 0,
        rowStart: rowStart,
        rowEnd: rowEnd,
        colStart: colStart,
        colEnd: colEnd,
        emptyCellIndices: []
      };
    } // The Solver - a pipeline that solves any test case and returns the answer and resolved magic carpet.

  }, {
    key: "solve",
    value: function solve(testCase) {
      if (testCase.n > 10000) {
        if (testCase.b === 0) {
          return {
            carpet: 'PFF',
            answer: testCase.n * testCase.n - testCase.h
          };
        }

        console.log('Solve manually or implement in another language!');
        return {
          carpet: 'PFF',
          answer: 'Manually'
        };
      }

      var solver = new this(testCase).evaluateCarpet();
      var segmentCouples = [this.segmentCouple(solver.topLeftQuarter, solver.bottomRightQuarter), this.segmentCouple(solver.bottomLeftQuarter, solver.topRightQuarter)];
      segmentCouples.forEach(function (_ref) {
        var seg1 = _ref.seg1,
            seg2 = _ref.seg2;
        return solver.balanceSegments(seg1, seg2);
      });

      if (solver.isOdd) {
        this.oddPipeline(solver, segmentCouples);
      }

      if (!solver.isBalanced()) {
        return {
          carpet: solver.magicCarpet,
          answer: -1
        };
      }

      segmentCouples.forEach(function (_ref2) {
        var seg1 = _ref2.seg1,
            seg2 = _ref2.seg2;
        solver.addMoreHunters(seg1, seg2);
      });
      return {
        carpet: solver.magicCarpet,
        answer: solver.huntersAdded
      };
    } // Pipeline for test cases with an odd size

  }, {
    key: "oddPipeline",
    value: function oddPipeline(solver, segmentCouples) {
      segmentCouples.push(this.segmentCouple(solver.centerLeft, solver.centerRight));
      segmentCouples.push(this.segmentCouple(solver.centerTop, solver.centerBottom));
      solver.finalTouch();
      return solver.balanceSegmentsOdd() && solver.balanceSegmentsOdd();
    } // Returns the total number of hunters from an array of segments.

  }, {
    key: "huntersInSegments",
    value: function huntersInSegments(segments) {
      var hunters = 0;
      segments.forEach(function (segment) {
        return hunters += segment.hunters;
      });
      return hunters;
    }
  }]);

  return CaseSolver;
}();

exports.CaseSolver = CaseSolver;