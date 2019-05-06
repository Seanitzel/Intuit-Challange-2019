// Builds a test case and returns its magic carpet.
export class TestCaseBuilder {
    constructor(testCase) {
        this.testCase = testCase
    }

    // Builder that returns magic carpet for a test case.
    static build(testCase) {
        return new TestCaseBuilder(testCase)
            .createMagicCarpet()
            .fillCarpet()
            .magicCarpet
    }

    // Creates a magic carpet for a test case.
    createMagicCarpet() {
        const carpet = []
        for (let i = 0; i < this.testCase.n; ++i)
            carpet.push(new Array(this.testCase.n))
        this.magicCarpet = carpet

        return this
    }

    //Fill the carpet with its data.
    fillCarpet() {
        return this.fillPositions(this.testCase.boxPositions, 'B')
                   .fillPositions(this.testCase.hunterPositions, 'H')
    }

    // Positions are defined using arrays where the first member is the column
    // and the second one is the row.
    // This was how the data for the challenge was set-up...
    fillPositions(positions, value) {
        positions.forEach(position => {
            const ROW_INDEX = position[1] - 1,
                  COL_INDEX = position[0] - 1

            this.magicCarpet[ROW_INDEX][COL_INDEX] = value
        })

        return this
    }
}
