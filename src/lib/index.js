import {formatTaskFile} from './setupTestCases'
import {CaseSolver}     from './CaseSolver'
import fs               from 'fs'

const firstSet  = '/task-1.txt'
const secondSet = '/task-2.txt'

function generateResults(file) {
    let res = formatTaskFile(file, true).map((testCase, i) => {
        return `Case #${i + 1}: ${CaseSolver.solve(testCase).answer}\n`
    })

    // res = formatTaskFile(file, true).slice(135, 145).map((testCase, i) => {
    //     return `Case #${i + 131}: ${CaseSolver.solve(testCase).answer}\n`
    // })

    res = res.toString().replace(/[,]+/g, '')

    fs.writeFile(`./${file}-answers2.txt`, res, (err) => {
        if (err) {
            console.log(err)
            return
        }
        console.log('Success!')
    })
}

function forceGC() {
    if (global.gc) {
        global.gc()
    } else {
        console.warn('No GC hook! Start your program as `node --expose-gc file.js`.')
    }
}

generateResults(firstSet)


