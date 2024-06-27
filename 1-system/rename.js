import fs from 'fs'

const [srcExt, dstExt] = process.argv.slice(2, 4)
const files = process.argv.slice(4)

for (const srcName of files) {
    const dstName = srcName.replace(srcExt,dstExt)
    fs.cp(srcName, dstName, { force: false, errorOnExist: true }, (err) => {
        if (err) {
            if (err.code === 'ERR_FS_CP_EEXIST') {
                console.log(`file '${srcName}' already exists`)
            } else {
                console.error(err)
            }   
        }
    })
}