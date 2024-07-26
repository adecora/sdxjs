import parse from 'minimist'
import glob from 'glob'
import path from 'path'
import hope from './hope.js'

const main = async (args) => {
    const options = parse(args)
    if (!options.filenames || options.filenames.length === 0) {
        options.filenames = glob.sync(`${options.root}/**/test-*.js`)
    }

    for (const f of options.filenames) {
        await import(`./${path.basename(f)}`)
    }
    hope.run()
    const result = (options.output === 'terse')
        ? hope.terse()
        : hope.verbose()
    console.log(result)
}

main(process.argv.slice(2))
