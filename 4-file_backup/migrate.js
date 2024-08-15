import fs from 'fs-extra-promise'
import glob from 'glob-promise'
import { fileURLToPath } from 'url'
import { userInfo } from 'os'


const csvTojson = (content) => {
    content = content
        .split('\n')
        .map((line) => line.split(','))
    
    return JSON.stringify(
        content.reduce((obj, [path, hash], i) => {
            if(i === 0 && path !== 'username') {
                obj['username'] = userInfo().username
            }
            obj[path] = hash
            return obj
        }, {}),
        null,
        4
    )
}

const main = async (dirname) => {
    const manifests = await glob(`${dirname}/*.csv`)
    if (!manifests.length) {
        console.log('not CSV manifests to migrate')
    }
    for (const m of manifests) {
        console.log(`migrating from ${m} to ${m.replace('csv', 'json')}`)
        const content = csvTojson(await fs.readFileAsync(m, 'utf-8'))
        fs.writeFileAsync(m.replace('csv', 'json'), content, 'utf-8')
        fs.rmAsync(m)
    }
}


if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const dirname = process.argv[2]
    await main(dirname)
}
