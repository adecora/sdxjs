import fs from 'fs-extra-promise'

const main = async(filenames) => {
    const lines = await Promise.all(filenames.map(file => readFile(file)))
    const sets = lines.map(data =>  new Set(data.filter(line => line)))
    const common = sets.reduce((setA, setB) => {
        const intersectionSet = new Set()

        for(let elem of setA) {
            if (setB.has(elem)) {
                intersectionSet.add(elem)
            }
        }

        return intersectionSet
    })
    
    common.forEach(line => {
        console.log(line)
    })
}

const readFile = async(filename) => {
    const data = await fs.readFileAsync(filename, { encoding: 'utf-8' })
    const lines = data.split('\n')
    return lines
}

if (process.argv.length < 4) {
    console.error('Usage: node in-all.js file1 file2 [files]')
    process.exit(-1)
} 

const filenames = process.argv.slice(2)
main(filenames)
