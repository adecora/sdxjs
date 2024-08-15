import fs from 'fs-extra-promise'
import glob from 'glob-promise'
import path from 'path'

import hashExisting from './hash-existing-async.js'
import findNew from './check-existing-files.js'

const backup = async (src, dst) => {
    let stamp = (await glob(`${dst}/*.csv`)).sort().pop()
    if (stamp === undefined) {
        stamp = 1
    } else {
        stamp = Number(path.basename(stamp).replace('.csv', ''))
        ++stamp
    }
    stamp = String(stamp).padStart(8, '0')

    const existing = await hashExisting(src)
    const needToCopy = await findNew(dst, existing)
    await copyFiles(dst, needToCopy)
    await saveManifest(dst, stamp, existing)
}

const copyFiles = async (dst, needToCopy) => {
    const promises = Object.keys(needToCopy).map(hash => {
        const srcPath = needToCopy[hash]
        const dstPath = `${dst}/${hash}.bck`
        fs.copyFileAsync(srcPath, dstPath)
    })
    return Promise.all(promises)
}

const saveManifest = async (dst, stamp, pathHash) => {
    pathHash = pathHash.sort()
    const content = pathHash.map(
        ([path, hash]) => `${path},${hash}`).join('\n')
    const manifest = `${dst}/${stamp}.csv`
    fs.writeFileAsync(manifest, content, 'utf-8')
}


export default backup


const [src, dst] = process.argv.slice(2)
backup(src, dst)
