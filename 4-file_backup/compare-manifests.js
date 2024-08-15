import fs from 'fs-extra-promise'
import minimist from 'minimist'
import path from 'path'
import { fileURLToPath } from 'url'

class Manifests {
    constructor () {
        this.changed = []
        this.renamed = []
        this.deleted = []
        this.added = []
    }

    diff (fileA, fileB) {
        for (const [path, hash] of Object.entries(fileA)) {
            if (path in fileB) {
                if (hash !== fileB[path]) {
                    // File changes
                    this.changed.push(path)
                }
                delete fileA[path]
                delete fileB[path]
            } else {
                if(Object.values(fileB).includes(hash)) {
                    // Files renamed
                    const rename  = Object.entries(fileB).find(([p, h]) => h === hash)[0]
                    this.renamed.push(`${path} -> ${rename}`)
                    
                    delete fileA[path]
                    delete fileB[rename]
                } else {
                    // Files deleted
                    this.deleted.push(path)
                    
                    delete fileA[path]
                }
            }
        }

        for (const path of Object.keys(fileB)) {
            // Files added
            this.added.push(path)
            
            delete fileB[path]
        }
    }

    terse () {
        return this.cases()
            .map(([title, results]) => `${title.padStart(7)}: ${results.length}`)
            .join('\n')
    }

    verbose () {
        let report = ''
        let prefix = ''
        for (const [title, results] of this.cases()) {
            report += `${prefix}${title} (${results.length}):`
            prefix = '\n'
            for (const r of results) {
                report += `${prefix}  ${r}`
            }
        }
        return report
    } 

    cases () {
        return [
            ['changed', this.changed],
            ['renamed', this.renamed],
            ['deleted', this.deleted],
            ['added', this.added]
        ]
    }
}

const readManifest = async (filename) => {
    let fileParse = await (await fs.readFileAsync(filename, 'utf-8')).trim()
    if (/.csv$/.test(filename)) {
        fileParse = fileParse
            .split('\n')
            .reduce((obj, line) => {
                const [path, hash] = line.split(',')
                obj[path] = hash
                return obj
            }, {})
    } else if (/.json$/.test(filename)) {
        fileParse = JSON.parse(fileParse)
    } else {
        throw new Error('Incorrect manifest format')
    }
    
    'username' in fileParse && delete fileParse['username']
    return fileParse
}


const compareManifests = async (fileA, fileB) => {
    try {
        const manifests = new Manifests()
        fileA = await readManifest(fileA)
        fileB = await readManifest(fileB)
        
        manifests.diff(fileA, fileB)
        return manifests
    } catch(err) {
        console.error(err)
    }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const args = minimist(process.argv, { default: { v: false, verbose: false }})
    if (args['_'].length !== 4) {
        console.log(`Bad Usage: node ${path.basename(import.meta.filename)} fileA fileB`)
        process.exit(1)
    }
    const [fileA, fileB] = process.argv.slice(2)
    const manifests = await compareManifests(fileA, fileB)
    if (args.v || args.verbose) {
        console.log(manifests.verbose())
    } else {
        console.log(manifests.terse())
    }
}
