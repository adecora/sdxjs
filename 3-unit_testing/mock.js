import fs from 'fs'

const MOCK_READ_FILE_CONTROL = [false, false, true, false, true]

const mockReadFileSync = (filename, encoding = 'utf-8') => {
    if (MOCK_READ_FILE_CONTROL.shift() === false) {
        return fs.readFileSync(filename, encoding)
    } else {
        throw new Error('Mock error')
    }
}

for (let i = 1; i <= 8; i++) {
    try {
        mockReadFileSync(import.meta.filename)
        console.log(`Execution (${i}) succeed`)
    } catch (e) {
        console.log(`Execution (${i}) fail: ${e.name} ${e.message}`)
    }
}
