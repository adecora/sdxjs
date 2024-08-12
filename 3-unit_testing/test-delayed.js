import assert from 'assert'
import hope from './hope.js'


hope.test('delayed test', async () => {
    const sum = await (new Promise((resolve, _) => setTimeout(() => resolve(1 + 2), 3000)))
    assert(sum === 3)
})
