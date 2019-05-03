export class TestCaseBuilder {
    constructor(testCase) {
        this.testCase = testCase
    }

    static build(testCase) {
        return new TestCaseBuilder(testCase)
            .createMagicCarpet()
            .arrangeCarpet()
            .magicCarpet
    }

    createMagicCarpet() {
        const carpet = []
        for (let i = 0; i < this.testCase.n; ++i)
            carpet.push(new Array(this.testCase.n).fill(0))
        this.magicCarpet = carpet

        return this
    }

    arrangeCarpet() {
        return this.arrangeCarpetHelper(this.testCase.boxPositions, 'B')
                   .arrangeCarpetHelper(this.testCase.hunterPositions, 'H')
    }

    arrangeCarpetHelper(positions, value) {
        positions.forEach(position => {
            this.magicCarpet[position[1] - 1][position[0] - 1] = value
        })
        return this
    }
}
