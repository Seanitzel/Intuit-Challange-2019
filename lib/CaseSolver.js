"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CaseSolver = void 0;

var _TestCaseBuilder = require("./TestCaseBuilder");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var CaseSolver =
/*#__PURE__*/
function () {
  function CaseSolver(testCase) {
    _classCallCheck(this, CaseSolver);

    this.magicCarpet = _TestCaseBuilder.TestCaseBuilder.build(testCase);
    this.isOdd ? this.initOdd() : this.initEven();
    this.huntersAdded = 0;
  } // For the first task


  _createClass(CaseSolver, [{
    key: "initEven",
    value: function initEven() {
      var center = this.center;
      this.topLeftQuarter = CaseSolver.carpetSegment(0, center, 0, center);
      this.topRightQuarter = CaseSolver.carpetSegment(0, center, center, this.n);
      this.bottomLeftQuarter = CaseSolver.carpetSegment(center, this.n, 0, center);
      this.bottomRightQuarter = CaseSolver.carpetSegment(center, this.n, center, this.n);
    } // For the second task

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
    }
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
    }
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
    }
  }, {
    key: "addHunter",
    value: function addHunter(segment) {
      var cell = segment.emptyCellIndices.pop();
      this.magicCarpet[cell.row][cell.col] = 'H';
      segment.hunters++;
      segment.empty--;
      this.huntersAdded++;
      return true;
    }
  }, {
    key: "isBalanced",
    value: function isBalanced() {
      var left = CaseSolver.huntersInSegments(this.topLeftQuarter, this.bottomLeftQuarter);
      var right = CaseSolver.huntersInSegments(this.topRightQuarter, this.bottomRightQuarter);
      var top = CaseSolver.huntersInSegments(this.topLeftQuarter, this.topRightQuarter);
      var bottom = CaseSolver.huntersInSegments(this.bottomLeftQuarter, this.bottomRightQuarter);

      if (this.isOdd) {
        left += this.centerLeft.hunters;
        right += this.centerRight.hunters;
        top += this.centerTop.hunters;
        bottom += this.centerBottom.hunters;
      }

      return left === right && top === bottom;
    }
  }, {
    key:   "balanceSegmentsOdd",
    value: function fixSegmentsOdd(seg1, seg1Center, seg2, seg2Center) {}
  }, {
    key:   "balanceSegments",
    value: function fixSegments(seg1, seg2) {
      if (seg1.hunters === seg2.hunters) {
        return true;
      }

      return seg1.hunters > seg2.hunters ? this.balanceSegmentsHelper(seg1.hunters - seg2.hunters, seg2) : this.balanceSegmentsHelper(seg2.hunters - seg1.hunters, seg1);
    }
  }, {
    key:   "balanceSegmentsHelper",
    value: function fixSegmentsHelper(difference, segment) {
      while (difference && segment.emptyCellIndices.length) {
        this.addHunter(segment);
        difference--;
      }

      return !difference;
    }
  }, {
    key: "addMoreHunters",
    value: function addMoreHunters(segment1, segment2) {
      while (segment1.emptyCellIndices.length && segment2.emptyCellIndices.length) {
        this.addHunter(segment2);
        this.addHunter(segment1);
      }
    }
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
    get: function get() {
      return !!(this.magicCarpet.length % 2);
    }
  }, {
    key: "n",
    get: function get() {
      return this.magicCarpet.length;
    }
  }, {
    key: "center",
    get: function get() {
      return Math.floor(this.magicCarpet.length / 2);
    }
  }], [{
    key: "segmentCouple",
    value: function segmentCouple(seg1, seg2) {
      return {
        seg1: seg1,
        seg2: seg2
      };
    } // Represents a carpet segment

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
      var segmentsCouples = [this.segmentCouple(solver.topLeftQuarter, solver.bottomRightQuarter), this.segmentCouple(solver.bottomLeftQuarter, solver.topRightQuarter)];

      if (solver.isOdd) {
        segmentsCouples.push(this.segmentCouple(solver.centerLeft, solver.centerRight));
        segmentsCouples.push(this.segmentCouple(solver.centerTop, solver.centerBottom));
        solver.finalTouch();
      }

      var balancedSuccessfully = segmentsCouples.every(function (_ref) {
        var seg1 = _ref.seg1,
            seg2 = _ref.seg2;
        return solver.balanceSegments(seg1, seg2);
      });

      if (!balancedSuccessfully) {
        return {
          carpet: solver.magicCarpet,
          answer: -1
        };
      }

      segmentsCouples.forEach(function (_ref2) {
        var seg1 = _ref2.seg1,
            seg2 = _ref2.seg2;
        solver.addMoreHunters(seg1, seg2);
      });
      return {
        carpet: solver.magicCarpet,
        answer: solver.huntersAdded
      };
    } //

  }, {
    key:   "huntersInSegments",
    value: function huntersInHalf(q1, q2) {
      return q1.hunters + q2.hunters;
    }
  }]);

  return CaseSolver;
}();

exports.CaseSolver = CaseSolver;
