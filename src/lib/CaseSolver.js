import {TestCaseBuilder} from './TestCaseBuilder'

export class CaseSolver {
    constructor(testCase) {
        this.magicCarpet = TestCaseBuilder.build(testCase)
        this.isOdd ? this.initOdd() : this.initEven()
        this.huntersAdded = 0
    }

    // For the first task
    initEven() {
        const center = this.center

        this.topLeftQuarter     = CaseSolver.carpetSegment(0, center, 0, center)
        this.topRightQuarter    = CaseSolver.carpetSegment(0, center, center, this.n)
        this.bottomLeftQuarter  = CaseSolver.carpetSegment(center, this.n, 0, center)
        this.bottomRightQuarter = CaseSolver.carpetSegment(center, this.n, center, this.n)
    }

    // For the second task
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

    // Represents a carpet segment
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

        let balancedSuccessfully = segmentCouples.every(({seg1, seg2}) => {
            return solver.balanceSegments(seg1, seg2)
        })

        if (solver.isOdd) {
            balancedSuccessfully = this.oddPipeline(solver, segmentCouples)
        }

        // if (!balancedSuccessfully) {
        //     return {carpet: solver.magicCarpet, answer: -1}
        // }

        // segmentCouples.forEach(({seg1, seg2}) => {
        //     solver.addMoreHunters(seg1, seg2)
        // })

        return {carpet: solver.magicCarpet, answer: solver.huntersAdded}
    }

    static oddPipeline(solver, segmentCouples) {
        segmentCouples.push(this.segmentCouple(solver.centerLeft, solver.centerRight))
        segmentCouples.push(this.segmentCouple(solver.centerTop, solver.centerBottom))
        solver.finalTouch()
        return solver.balanceSegmentsOdd(solver.topLeftQuarter, solver.centerTop, solver.centerLeft, solver.bottomRightQuarter, solver.centerBottom, solver.centerRight) &&
            solver.balanceSegmentsOdd(solver.topRightQuarter, solver.centerTop, solver.centerRight, solver.bottomLeftQuarter, solver.centerBottom, solver.centerLeft)
    }

    //
    static huntersInSegments(segments) {
        let hunters = 0
        segments.forEach(segment => hunters += segment.hunters)
        return hunters
    }

    get isOdd() {
        return !!(this.magicCarpet.length % 2)
    }

    get n() {
        return this.magicCarpet.length
    }

    get center() {
        return Math.floor(this.magicCarpet.length / 2)
    }

    evaluateCarpet() {
        let segments = ['topLeftQuarter', 'bottomLeftQuarter', 'topRightQuarter', 'bottomRightQuarter']

        if (this.isOdd) {
            const centerSegments = ['centerLeft', 'centerRight', 'centerTop', 'centerBottom']
            segments             = segments.concat(centerSegments)
        }

        segments.forEach(segment => this.evaluateSegment(this[segment]))

        return this
    }

    evaluateSegment(segment) {
        for (let i = segment.rowStart; i < segment.rowEnd; ++i) {
            for (let j = segment.colStart; j < segment.colEnd; ++j) {
                this.updateSegment({row: i, col: j}, segment)
            }
        }
    }

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

    isBalanced() {
        return (this.topBottomBalanced() && this.leftRightBalanced())
    }

    topBottomBalanced() {
        return (this.topHalfHunters === this.bottomHalfHunters)
    }

    leftRightBalanced() {
        return (this.leftHalfHunters === this.rightHalfHunters)
    }

    get topHalfHunters() {
        const top = CaseSolver.huntersInSegments([this.topLeftQuarter, this.topRightQuarter])
        return this.isOdd ? top + this.centerTop.hunters : top
    }

    get bottomHalfHunters() {
        const bottom = CaseSolver.huntersInSegments([this.bottomLeftQuarter, this.bottomRightQuarter])
        return this.isOdd ? bottom + this.centerBottom.hunters : bottom
    }

    get leftHalfHunters() {
        const left = CaseSolver.huntersInSegments([this.topLeftQuarter, this.bottomLeftQuarter])
        return this.isOdd ? left + this.centerLeft.hunters : left
    }

    get rightHalfHunters() {
        const right = CaseSolver.huntersInSegments([this.topRightQuarter, this.bottomRightQuarter])
        return this.isOdd ? right + this.centerRight.hunters : right
    }

    balanceSegments(seg1, seg2) {
        if (seg1.hunters === seg2.hunters) {
            return true
        }

        return seg1.hunters > seg2.hunters ?
               this.balanceSegmentsHelper(seg1.hunters - seg2.hunters, seg2)
                                           :
               this.balanceSegmentsHelper(seg2.hunters - seg1.hunters, seg1)
    }

    balanceSegmentsHelper(difference, segment) {
        while (difference && segment.emptyCellIndices.length) {
            if (!this.addHunter(segment)) {
                break
            }
            difference--
        }

        return !difference
    }

    balanceSegmentsOdd(seg1, seg1Center, seg1CenterSide, seg2, seg2Center, seg2CenterSide) {
        // const h1 = CaseSolver.huntersInSegments([seg1, seg1Center]),
        //       h2 = CaseSolver.huntersInSegments([seg2, seg2Center]),
        //       h3 = CaseSolver.huntersInSegments([seg1, seg1CenterSide]),
        //       h4 = CaseSolver.huntersInSegments([seg2, seg2CenterSide])
        //
        // if (h1 !== h2) {
        //     h1 > h2 ? this.balanceSegmentsHelper(h1 - h2, seg2Center) :
        //     this.balanceSegmentsHelper(h2 - h1, seg1Center)
        // }
        //
        // if (h3 !== h4) {
        //     h3 > h4 ? this.balanceSegmentsHelper(h3 - h4, seg2CenterSide) :
        //     this.balanceSegmentsHelper(h4 - h3, seg1CenterSide)
        // }
        if (!this.topBottomBalanced()) {
            const difference = this.topHalfHunters - this.bottomHalfHunters
            difference > 0 ? this.balanceSegmentsHelper(difference, this.centerBottom) :
            this.balanceSegmentsHelper(Math.abs(difference), this.centerTop)
        }

        if (!this.leftRightBalanced()) {
            const difference = this.leftHalfHunters - this.rightHalfHunters
            difference > 0 ? this.balanceSegmentsHelper(difference, this.centerLeft) :
            this.balanceSegmentsHelper(Math.abs(difference), this.centerRight)
        }

        return this.isBalanced()
    }

    addMoreHunters(segment1, segment2) {
        while (segment1.emptyCellIndices.length && segment2.emptyCellIndices.length) {
            this.addHunter(segment2)
            this.addHunter(segment1)
        }
    }

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
