import {formatTaskFile} from './setupTestCases'
import {CaseSolver}     from './CaseSolver'
import fs               from 'fs'

//Gets a file name, parses and solves all the test cases in it, and creates a file with the result.
function generateResults(file) {
    let res = formatTaskFile(file, true).map((testCase, i) => {
        return `Case #${i + 1}: ${CaseSolver.solve(testCase).answer}\n`
    })

    res = res.toString().replace(/[,]+/g, '')

    fs.writeFile(`./${file} Solution.txt`, res, (err) => {
        if (err) {
            console.log(err)
            return
        }
        console.log('Success!')
    })
}

// Solving the tasks!
['/task-1.txt', '/task-2.txt'].forEach(fileName => generateResults(fileName))



