import glob from 'glob'

glob('**/*.*', (err, files) => {
    if (err) {
        console.error(err)
    } else {
        files = files.filter((f) => { return !f.endsWith('.bck') })
        for (const filename of files) {
            console.log(filename)
        }
    }
})