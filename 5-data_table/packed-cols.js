import assert from 'assert'
import sizeof from 'object-sizeof'
import yaml from 'js-yaml'

import { buildCols, timeAndSize } from './build.js'


const main = () => {
    const nRows = parseInt(process.argv[2])
    const nCols = parseInt(process.argv[3])

    const labels = [...Array(nCols).keys()].map(i => `label_${i + 1}`)
    const someLabels = labels.slice(0, Math.floor(labels.length / 2))
    assert(someLabels.length > 0,
        'Must have some labels for select (array too short)')
    
    const colTable = buildCols(nRows, labels)
    const [packedColBinaryTime, packedColBinarySize] = timeAndSize(asBinary, colTable)
    const result = {
        nRows,
        nCols,
        packedColBinaryTime,
        packedColBinarySize
    }
    console.log(yaml.dump(result))
}

const asBinary = (table) => {
    const labels = Object.keys(table)

    const nCols = labels.length
    const nRows = table[labels[0]].length
    const dimensions = new Uint32Array([nCols, nRows])

    const allLabels = labels.join('\n')
    const encoder = new TextEncoder()
    const encodedLabels = encoder.encode(allLabels)

    const dataSize = sizeof(0) * nCols * nRows
    const totalSize =
        dimensions.byteLength + encodedLabels.byteLength + dataSize
    
    const buffer = new ArrayBuffer(totalSize)
    const result = new Uint8Array(buffer)
    result.set(new Uint8Array(dimensions.buffer), 0)
    result.set(encodedLabels, dimensions.byteLength)
    
    let current = dimensions.byteLength + encodedLabels.byteLength
    labels.forEach(label => {
        const temp = new Float64Array(table[label])
        result.set(new Uint8Array(temp.buffer), current)
        current += temp.byteLength
    })

    return result
}

main()
