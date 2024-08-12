import assert from 'assert'
import hope from './hope.js'

function assertAppoxEqual (actual, expected, message, tolerance = 0.01) {
    let relative = Math.abs(actual - expected) / expected
    if (relative <= tolerance) return
    throw new assert.AssertionError({ actual, expected, operator: `tolerance: ${tolerance}`, message })
}


hope.test('Checks equality tolerance exception', () => { assertAppoxEqual(1.0, 2.0, 'Values are too far apart') })
hope.test('Checks equality tolerance', () => { assertAppoxEqual(1.0, 2.0, 'Large margin of error', 10.0) })

hope.run()
console.log(hope.verbose())
