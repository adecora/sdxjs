import glob from 'glob'

const srcDir = process.argv[2]

glob(`${srcDir}/**/*.*`, { ignore: '*.bck' }, (err, files) => {
    if (err) {
        console.error(err)
    } else {
        for (const filename of files) {
            console.log(filename)
        }
    }
})