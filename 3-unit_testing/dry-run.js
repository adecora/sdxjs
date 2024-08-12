import assert from 'assert'
import microtime from 'microtime'

// State of test.
const HopeTest = []
let HopePass = 0
let HopeFail = 0
let HopeError = 0

// Record a single test for running later.
const hopeThat = (message, callback) => {
    HopeTest.push([message, callback])
}

// Run all of the test that have been asked for and report summary.
const main = () => {
    const start = microtime.nowDouble()
    HopeTest.forEach(([message, test]) => {
        try {
            test()
            HopePass += 1
        } catch (e) {
            if (e instanceof assert.AssertionError) {
                HopeFail += 1
            } else [
                HopeError += 1
            ]
        }
    })

    console.log(`Test's execution time: ${(microtime.nowDouble() - start).toFixed(4)} ms`)
    console.log(`pass ${HopePass}`)
    console.log(`fail ${HopeFail}`)
    console.log(`error ${HopeError}`)
}

// Something to test (doesn't handle zero properly).
const sign = (value) => {
    if (value < 0) {
        return -1
    } else {
        return 1
    }
}

// These two should pass.
hopeThat('Sign of negative is -1', () => assert(sign(-3) === -1))
hopeThat('Sign of positive is 1', () => assert(sign(19) === 1))

// This one should fail.
hopeThat('Sign of zero is 0', () => assert(sign(0) === 0))

// This one is an error.
hopeThat('Sign misspelled is error', () => assert(sgn(1) === 1))

// Call the main driver
main()
