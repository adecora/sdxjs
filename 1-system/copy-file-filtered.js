import glob from 'glob'
import fs from 'fs-extra'
import path from 'path'

if (process.argv.length !== 4) {
    console.error(`Bad usage: node ${process.argv[1]} srcDirectory dstDirectory`)
    process.exit(1)
}

const [srcRoot, dstRoot] = process.argv.slice(2)

glob(`${srcRoot}/**/*.*`, { ignore: '*.bck' }, (err, files) => {
    if (err) {
        console.error(err)
    } else {
        for (const srcName of files) {
            fs.stat(srcName, (err, stats) => {
                if (err) {
                    console.error(err)
                } else if (stats.isFile()) {
                    const dstName = srcName.replace(srcRoot, dstRoot)
                    const dstDir = path.dirname(dstName)
                    fs.ensureDir(dstDir, (err) => {
                        if (err) {
                            console.error(err)
                        } else {
                            fs.copy(srcName, dstName, (err) => {
                                if (err) {
                                    console.error(err)
                                }
                            })
                        }
                    })
                }
            })
        }
    }
})