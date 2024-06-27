import fs from 'fs'

const files = process.argv.slice(2)
let totalLines = 0

for (const file of files) {
    const text = fs.readFileSync(file).toString()
    const lines = text.split('\r\n').length
    console.log(`${file.padEnd(25)} ${lines}`)
    totalLines += lines
}

console.log(`${'total'.padEnd(25)} ${totalLines}`)