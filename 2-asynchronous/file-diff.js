import fs from 'fs-extra-promise'

const main = async(filenames) => {
    const [left, right] = (await Promise.all(filenames.map(filename => readFile(filename)))).map(file => new Set(file))
    const lines = Array.from(new Set([...left, ...right])).sort()
    
    for (let line of lines) {
        if (left.has(line) && right.has(line)) {
            console.log('*', line)
        } else if (left.has(line)) {
            console.log('1', line)
        } else {
            console.log('2', line)
        }
    }
}

const readFile = async (filename) => {
    const data = await fs.readFileAsync(filename, { encoding: 'utf-8' })
    const lines = data
        .trimEnd('\n')
        .split('\n')
    return lines
}

if (process.argv.length < 4) {
    console.error('Usage: node file-diff.js left.txt right.txt')
    process.exit(1)
}

const filenames = process.argv.slice(2)
main(filenames)
