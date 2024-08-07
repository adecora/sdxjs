import glob from 'glob-promise'
import fs from 'fs-extra-promise'

const main = async (srcDir) => {
    const files = await glob(`${srcDir}/**/*.*`)
    const pairs = await Promise.all(files.map(f => statPair(f)))
    const filtered = pairs
        .filter(pair => pair.stats.isFile())
        .map(pair => pair.filename)
    const counts = await Promise.all(
        filtered.map(name => lineCount(name))
    )
    counts.forEach(
        ({ filename, lines }) => console.log(`${lines}: ${filename}`)
    )
}

const statPair = async (filename) => {
    const stats = await fs.statAsync(filename)
    return { filename, stats }
}

const lineCount = async (filename) => {
    const data =  await fs.readFileAsync(filename, { encoding: 'utf-8' })
    return {
        filename,
        lines: data.split('\n').length - 1
    }
}

const srcDir = process.argv[2]
main(srcDir)
