import glob from 'glob'

glob('**/*.*', (err, files) => {
    if (err) {
        console.error(err)
    } else {
        for (const filename of files) {
            console.log(filename)
        }
    }
})