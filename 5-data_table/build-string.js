import microtime from 'microtime'
import sizeof from 'object-sizeof'


// 'A'.codePointAt(0) -> 65
// 'Z'.codePointAt(0) -> 90

const randLetter = () => {
    // Random letter between A - Z
    return String.fromCharCode(Math.floor(Math.random() * 26) + 65)
}

const buildCell = () => {
    return [...Array(4)].map(_ => randLetter()).join('')
}

const buildCell2 = (iR) => {
    return [...Array(4)].map(_ => String.fromCharCode(65 + iR % 26)).join('')
}

export const buildRows = (nRows, labels) => {
    const result = []
    for (let iR = 0; iR < nRows; iR += 1) {
        const row = {}
        labels.forEach(label => {
            row[label] = buildCell2(iR)
        })
        result.push(row)
    }
    return result    
}

export const buildCols = (nRows, labels) => {
    const result = {}
    labels.forEach(label => {
        result[label] = []
        for (let iR = 0; iR < nRows; iR += 1) {
            result[label].push(buildCell2(iR))
        }
    })
    return result
}

export const timeAndSize = (func, ...params) => {
    const before = microtime.now()
    const result = func(...params)
    const after = microtime.now()
    return [after - before, sizeof(result)]
}
