import {TestCaseBuilder} from './TestCaseBuilder'

export class CaseSolver {
    constructor(testCase) {
        this.magicCarpet = TestCaseBuilder.build(testCase)

        const breakPoint = this.magicCarpet.length / 2

        this.quarter1 = CaseSolver.generateQuarter(0, breakPoint, 0, breakPoint)
        this.quarter2 = CaseSolver.generateQuarter(breakPoint, breakPoint * 2, 0, breakPoint)
        this.quarter3 = CaseSolver.generateQuarter(0, breakPoint, breakPoint, breakPoint * 2)
        this.quarter4 = CaseSolver.generateQuarter(breakPoint, breakPoint * 2, breakPoint, breakPoint * 2)

        this.huntersAdded = 0
    }

    static generateQuarter(rowStart, rowEnd, colStart, colEnd) {
        return {
            hunters: 0,
            empty:   0,
            boxes:   0,
            rowStart,
            rowEnd,
            colStart,
            colEnd,
        }
    }

    static solve(testCase) {
        const solver = new this(testCase).evaluateCarpet()

        solver.fixQuarters(solver.quarter1, solver.quarter4)
        solver.fixQuarters(solver.quarter2, solver.quarter3)
        solver.addMoreHunters(solver.quarter1, solver.quarter4)
        solver.addMoreHunters(solver.quarter2, solver.quarter3)

        if (!solver.isBalanced()) {
            solver.huntersAdded = -1
        }
        return {carpet: solver.magicCarpet, answer: solver.huntersAdded}
    }

    addHunterAttempt(quarter) {
        for (let j = quarter.rowStart; j < quarter.rowEnd; ++j) {
            for (let i = quarter.colStart; i < quarter.colEnd; ++i) {
                if (this.magicCarpet[j][i] === 0) {
                    return this.addHunter(quarter, j, i)
                }
            }
        }
        return false
    }

    addHunter(quarter, j, i) {
        this.magicCarpet[j][i] = 'H'
        quarter.hunters++
        quarter.empty--
        this.huntersAdded++
        return true
    }

    evaluateCarpet() {
        ['quarter1', 'quarter2', 'quarter3', 'quarter4'].forEach(quarter => this.evaluateQuarter(this[quarter]))
        return this
    }

    evaluateQuarter(quarter) {
        for (let j = quarter.rowStart; j < quarter.rowEnd; ++j) {
            for (let i = quarter.colStart; i < quarter.colEnd; ++i) {
                const value = this.magicCarpet[j][i]
                CaseSolver.updateQuarter(value, quarter)
            }
        }
    }

    isBalanced() {
        const left  = CaseSolver.huntersInHalf(this.quarter1, this.quarter2)
        const right = CaseSolver.huntersInHalf(this.quarter3, this.quarter4)
        const front = CaseSolver.huntersInHalf(this.quarter1, this.quarter3)
        const back  = CaseSolver.huntersInHalf(this.quarter2, this.quarter4)

        return left === right && front === back
    }

    static huntersInHalf(q1, q2) {
        return q1.hunters + q2.hunters
    }

    static updateQuarter(value, quarter) {
        if (value === 'H') {
            quarter.hunters++
        } else if (value === 'B') {
            quarter.boxes++
        } else {
            quarter.empty++
        }
    }

    fixQuarters(q1, q2) {
        if (q1.hunters === q2.hunters) {
            return false
        }
        return q1.hunters > q2.hunters ?
               this.fixQuartersHelper(q1.hunters - q2.hunters, q2)
                                       :
               this.fixQuartersHelper(q2.hunters - q1.hunters, q1)
    }

    fixQuartersHelper(difference, quarter) {
        for (let i = 0; i < difference; ++i) {
            this.addHunterAttempt(quarter)
        }

        return true
    }

    addMoreHunters(q1, q2) {
        let counter = 0
        // console.log(q1, q2)
        for (let j = q1.rowStart; j < q1.rowEnd; ++j) {
            for (let i = q1.colStart; i < q1.colEnd; ++i) {
                if (this.magicCarpet[j][i] === 0) {
                    if (this.addHunterAttempt(q2)) {
                        this.addHunter(q1, j, i)
                        counter++
                    }
                }
            }
        }
        // console.log(counter)
    }
}
