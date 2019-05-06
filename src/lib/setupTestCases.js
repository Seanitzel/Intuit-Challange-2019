// Parses a text file with test cases input and returns an array of the test cases.
export function formatTaskFile(file, node=false) {
    const dataRows = (node ? readFile(file) : file).split('\n')

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
        } else if(rowAsArray.length === 2){
            let positionType = 'boxPositions'
            if (counter <= testCase.h) {
                positionType = 'hunterPositions'
            }
            counter--
            testCase[positionType].push(rowAsArray)
        } else {
            formattedData.testCases.push(testCase)
        }
    })

    formattedData.testCases.splice(0, 1)

    return formattedData.testCases
}

// Initializes a new test case.
function newTestCase(sizes) {
    return {
        n:               sizes[0],
        b:               sizes[1],
        h:               sizes[2],
        boxPositions:    [],
        hunterPositions: [],
    }
}


 // Reads a file and returns its contents as a string.
function readFile(filename) {
    const fs = require('fs')

    return fs.readFileSync(__dirname + filename, 'utf8', function (err, data) {
        if (err) {
            throw err
        }
        return data
    })
}
