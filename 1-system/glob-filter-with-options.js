import glob from 'glob'

glob('**/*.*', { ignore: '*.bck' }, (err, files) => {
    if (err) {
        console.error(err)
    } else {
        for (const filename in files) {
            console.log(filename)
        }
    }
})