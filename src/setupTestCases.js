export function formatTaskFile(file) {
    const dataRows = file.split('\n')

    const formattedData = {
        length:    parseInt(dataRows.splice(0, 1)[0]),
        testCases: [],
    }

    let counter, testCase

    dataRows.forEach(row => {
        const rowAsArray = row.split(' ').map(val => parseInt(val))
        if (rowAsArray.length === 3) {
            formattedData.testCases.push(testCase)
            testCase = newTestCase(rowAsArray)
            counter  = testCase.b + testCase.h
        } else {
            let positionType = 'boxPositions'
            if (counter <= testCase.h) {
                positionType = 'hunterPositions'
            }
            counter--
            testCase[positionType].push(rowAsArray)
        }
    })

    formattedData.testCases.splice(0, 1)

    return formattedData.testCases
}

function newTestCase(sizes) {
    return {
        n:               sizes[0],
        b:               sizes[1],
        h:               sizes[2],
        boxPositions:    [],
        hunterPositions: [],
    }
}
