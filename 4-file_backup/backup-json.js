import fs from 'fs-extra-promise'
import minimist from 'minimist'
import { userInfo } from 'os'

import hashExisting from './hash-existing-async.js'
import findNew from './check-existing-files.js'

const backup = async (src, dst, format, timestamp = null) => {
    if (timestamp === null) {
        timestamp = Math.round((new Date()).getTime() / 1000)
    }
    timestamp = String(timestamp).padStart(10, '0')

    const existing = await hashExisting(src)
    const needToCopy = await findNew(dst, existing)
    await copyFiles(dst, needToCopy)
    await saveManifest(dst, timestamp, existing, format)
}

const copyFiles = async (dst, needToCopy) => {
    const promises = Object.keys(needToCopy).map(hash => {
        const srcPath = needToCopy[hash]
        const dstPath = `${dst}/${hash}.bck`
        fs.copyFileAsync(srcPath, dstPath)
    })
    return Promise.all(promises)
}

const saveManifest = async (dst, timestamp, pathHash, format='csv') => {
    pathHash = pathHash.sort()
    pathHash.unshift(['username', userInfo().username])
    let content
    if (format === 'csv') {
        content = pathHash.map(
            ([path, hash]) => `${path},${hash}`).join('\n')
    } else {
        content = JSON.stringify(
            pathHash.reduce((obj, [path, hash]) => {
                obj[path] = hash
                return obj
            }, {}), 
            null, 
            4
        )
    }
    const manifest = `${dst}/${timestamp}.${format}`
    fs.writeFileAsync(manifest, content, 'utf-8')
}


export default backup

const args = minimist(process.argv.slice(2))

const [source, destiny] = args['_']
let format = args.f || args.format

backup(source, destiny, format)
