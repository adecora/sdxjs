import assert from  'assert'
import hope from './hope.js'

hope.test('Sum of 1 and 2', () => assert((1 + 2) === 3))
hope.multiTest('check all of these sums', (a, b) =>  a + b, [
    [[2, 3], 5],
    [[3, 2], 5],
    [[2, 2], 4]
  ])
