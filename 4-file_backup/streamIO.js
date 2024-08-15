import fs from 'fs-extra-promise'

const main = (src, dst) => {
    fs.createReadStream(src, 'utf-8').pipe(fs.createWriteStream(dst, 'utf-8'))
}


const [src, dst] = process.argv.slice(2)
main(src, dst)
