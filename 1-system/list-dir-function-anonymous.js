import fs from 'fs'

const srcDir = process.argv[2]
fs.readdir(srcDir, (err, files) => {
    console.log('running callback')
    if (err) {
        console.error(err)
    } else {
        for (const name of files) {
            console.log(name)
        }
    }
})
console.log('last line of program')