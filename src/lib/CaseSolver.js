import {TestCaseBuilder} from './TestCaseBuilder'

// Represents a case solver.
export class CaseSolver {
    constructor(testCase) {
        this.magicCarpet = TestCaseBuilder.build(testCase)
        this.isOdd ? this.initOdd() : this.initEven()
        this.huntersAdded = 0
    }

    // For the first task - initializes segments for an even carpet.
    initEven() {
        const center = this.center

        this.topLeftQuarter     = CaseSolver.carpetSegment(0, center, 0, center)
        this.topRightQuarter    = CaseSolver.carpetSegment(0, center, center, this.n)
        this.bottomLeftQuarter  = CaseSolver.carpetSegment(center, this.n, 0, center)
        this.bottomRightQuarter = CaseSolver.carpetSegment(center, this.n, center, this.n)
    }

    // For the second task - initializes segments for an odd carpet.
    initOdd() {
        const center = this.center

        this.topLeftQuarter     = CaseSolver.carpetSegment(0, center, 0, center)
        this.topRightQuarter    = CaseSolver.carpetSegment(0, center, center + 1, this.n)
        this.bottomLeftQuarter  = CaseSolver.carpetSegment(center + 1, this.n, 0, center)
        this.bottomRightQuarter = CaseSolver.carpetSegment(center + 1, this.n, center + 1, this.n)

        this.centerLeft   = CaseSolver.carpetSegment(center, center + 1, 0, center)
        this.centerRight  = CaseSolver.carpetSegment(center, center + 1, center + 1, this.n)
        this.centerTop    = CaseSolver.carpetSegment(0, center, center, center + 1)
        this.centerBottom = CaseSolver.carpetSegment(center + 1, this.n, center, center + 1)
    }

    // Used for making it easier to access all the sements that are related
    static segmentCouple(seg1, seg2) {
        return {seg1, seg2}
    }

    // Returns a object representing a carpet segment.
    static carpetSegment(rowStart, rowEnd, colStart, colEnd) {
        return {
            hunters:          0,
            empty:            0,
            boxes:            0,
            rowStart,
            rowEnd,
            colStart,
            colEnd,
            emptyCellIndices: [],
        }
    }

    // The Solver - a pipeline that solves any test case and returns the answer and resolved magic carpet.
    static solve(testCase) {
        if (testCase.n > 10000) {
            if (testCase.b === 0) {
                return {carpet: 'PFF', answer: testCase.n * testCase.n - testCase.h}
            }

            console.log('Solve manually or implement in another language!')
            return {carpet: 'PFF', answer: 'Manually'}
        }

        let solver = new this(testCase).evaluateCarpet()

        const segmentCouples = [
            this.segmentCouple(solver.topLeftQuarter, solver.bottomRightQuarter),
            this.segmentCouple(solver.bottomLeftQuarter, solver.topRightQuarter),
        ]

        segmentCouples.forEach(({seg1, seg2}) => {
            return solver.balanceSegments(seg1, seg2)
        })

        if (solver.isOdd) {
            this.oddPipeline(solver, segmentCouples)
        }

        if (!solver.isBalanced()) {
            return {carpet: solver.magicCarpet, answer: -1}
        }

        segmentCouples.forEach(({seg1, seg2}) => {
            solver.addMoreHunters(seg1, seg2)
        })

        return {carpet: solver.magicCarpet, answer: solver.huntersAdded}
    }

    // Pipeline for test cases with an odd size
    static oddPipeline(solver, segmentCouples) {
        segmentCouples.push(this.segmentCouple(solver.centerLeft, solver.centerRight))
        segmentCouples.push(this.segmentCouple(solver.centerTop, solver.centerBottom))
        solver.finalTouch()
        return solver.balanceSegmentsOdd() && solver.balanceSegmentsOdd()
    }

    // Returns the total number of hunters from an array of segments.
    static huntersInSegments(segments) {
        let hunters = 0
        segments.forEach(segment => hunters += segment.hunters)
        return hunters
    }

    // Returns whether the magic carpet is odd type
    get isOdd() {
        return !!(this.magicCarpet.length % 2)
    }

    // The size of the magic carpet
    get n() {
        return this.magicCarpet.length
    }

    // Returns the [floored] center index of the magic carpet
    get center() {
        return Math.floor(this.magicCarpet.length / 2)
    }

    // Evaluates a magic carpet - fills each segment with its number of hunters, boxes etc
    evaluateCarpet() {
        let segments = ['topLeftQuarter', 'bottomLeftQuarter', 'topRightQuarter', 'bottomRightQuarter']

        if (this.isOdd) {
            const centerSegments = ['centerLeft', 'centerRight', 'centerTop', 'centerBottom']
            segments             = segments.concat(centerSegments)
        }

        segments.forEach(segment => this.evaluateSegment(this[segment]))

        return this
    }

    // Evaluates a segment from the magic carpet
    evaluateSegment(segment) {
        for (let i = segment.rowStart; i < segment.rowEnd; ++i) {
            for (let j = segment.colStart; j < segment.colEnd; ++j) {
                this.updateSegment({row: i, col: j}, segment)
            }
        }
    }

    // Updates the cell of a segment with the data from the carpet.
    updateSegment(cell, segment) {
        const value = this.magicCarpet[cell.row][cell.col]

        if (value === 'H') {
            segment.hunters++
        } else if (value === 'B') {
            segment.boxes++
        } else {
            segment.empty++
            segment.emptyCellIndices.push(cell)
        }
    }

    // Adds hunter at an empty cell in a segment and the magic carpet, returns false if it didnt.
    addHunter(segment) {
        const cell = segment.emptyCellIndices.pop()

        if (!cell) {
            return false
        }

        this.magicCarpet[cell.row][cell.col] = 'H'
        segment.hunters++
        segment.empty--
        this.huntersAdded++
        return true
    }

    // Whether the carpet is balanced.
    isBalanced() {
        return (this.topBottomBalanced() && this.leftRightBalanced())
    }

    // Whether the top and bottom halfs are balanced.
    topBottomBalanced() {
        return (this.topHalfHunters === this.bottomHalfHunters)
    }

    // Whether the left and right halfs are balanced.
    leftRightBalanced() {
        return (this.leftHalfHunters === this.rightHalfHunters)
    }

    // Returns the number of hunters in the top half.
    get topHalfHunters() {
        const top = CaseSolver.huntersInSegments([this.topLeftQuarter, this.topRightQuarter])
        return this.isOdd ? top + this.centerTop.hunters : top
    }

    // Returns the number of hunters in the bottom half.
    get bottomHalfHunters() {
        const bottom = CaseSolver.huntersInSegments([this.bottomLeftQuarter, this.bottomRightQuarter])
        return this.isOdd ? bottom + this.centerBottom.hunters : bottom
    }

    // Returns the number of hunters in the left half.
    get leftHalfHunters() {
        const left = CaseSolver.huntersInSegments([this.topLeftQuarter, this.bottomLeftQuarter])
        return this.isOdd ? left + this.centerLeft.hunters : left
    }

    // Returns the number of hunters in the right half.
    get rightHalfHunters() {
        const right = CaseSolver.huntersInSegments([this.topRightQuarter, this.bottomRightQuarter])
        return this.isOdd ? right + this.centerRight.hunters : right
    }

    // if 2 segments can be balanced it balances them and returns true, else returns false.
    balanceSegments(seg1, seg2) {
        if (seg1.hunters === seg2.hunters) {
            return true
        }

        return seg1.hunters > seg2.hunters ?
               this.addHuntersToSegment(seg1.hunters - seg2.hunters, seg2)
                                           :
               this.addHuntersToSegment(seg2.hunters - seg1.hunters, seg1)
    }

    // Adds hunters to a segment in order to balance it, returns true if the number
    // of hunters couldn't be added.
    addHuntersToSegment(hunters, segment) {
        while (hunters && segment.emptyCellIndices.length) {
            if (!this.addHunter(segment)) {
                break
            }
            hunters--
        }

        return !hunters
    }

    // Attempts to balance an odd carpet, returns true it did, else false
    balanceSegmentsOdd() {
        if (!this.topBottomBalanced()) {
            const difference = this.topHalfHunters - this.bottomHalfHunters
            difference > 0 ? this.addHuntersToSegment(difference, this.centerBottom) :
            this.addHuntersToSegment(Math.abs(difference), this.centerTop)
        }

        if (!this.leftRightBalanced()) {
            const difference = this.leftHalfHunters - this.rightHalfHunters
            difference > 0 ? this.addHuntersToSegment(difference, this.centerRight) :
            this.addHuntersToSegment(Math.abs(difference), this.centerLeft)
        }

        return this.isBalanced()
    }

    // Adds hunters to the maximum in 2 segments of the carpet.
    addMoreHunters(segment1, segment2) {
        while (segment1.emptyCellIndices.length && segment2.emptyCellIndices.length) {
            this.addHunter(segment2)
            this.addHunter(segment1)
        }
    }

    // Only for odd carpets, fills the center if possible.
    finalTouch() {
        if (this.isOdd) {
            const CENTER = Math.floor(this.n / 2)
            if (!this.magicCarpet[CENTER][CENTER]) {
                this.magicCarpet[CENTER][CENTER] = 'H'
                this.huntersAdded++
            }
        }
    }
}
