import fs from 'fs-extra-promise'

const main = async (pattern, filenames) => {
    try {
        const regex = new RegExp(pattern)
        const files = await Promise.all(filenames.map(file => readFile(file)))
        files.forEach(({filename, lines}) => {
            console.log(filename.padEnd(80, '='))
            lines.forEach(([lineno, line]) => {
                if (regex.test(line)) {
                    console.log(`    \x1b[1;31m%s:\x1b[0m ${line}`, lineno.padStart(2))
                }
            })
        })
    } catch(e) {
        if (e.code === 'ENOENT') {
            console.log(`No shuch file or directory: '${e.path}'`)
        } else {
            console.error('Fail')
        }
    }
}

const readFile = async (filename) => {
    const data = await fs.readFileAsync(filename, { encoding: 'utf-8' })
    const lines = data
        .split('\n')
        .map((line, lineno) => [(lineno + 1).toString(), line])
    return {
        filename,
        lines
    }
}

const pattern = process.argv[2]
const filenames = process.argv.slice(3)
main(pattern, filenames)
