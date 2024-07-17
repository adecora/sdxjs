import fs from 'fs-extra-promise'


const main = async (lineNo, filenames) => {
    const files = await Promise.all(filenames.map(f => headFile(lineNo, f)))
    files.forEach(file => {
        console.log(file.name)
        console.log(file.name.replace(/./g, '-'))
        console.log(file.lines.join('\n'))
        console.log()
    })
}

const headFile = async (lineNo, filename) => {
    const file = await fs.readFileAsync(filename, { encoding: 'utf-8' })
    const lines = file.split('\n').slice(0, lineNo)
    return {
        name: filename,
        lines
    }
}



const lineNo = process.argv[2]
const filenames = process.argv.slice(3)
main(lineNo, filenames)
