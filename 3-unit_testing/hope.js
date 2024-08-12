import assert from 'assert'
import caller from 'caller'

// State of test.
class Hope {
    constructor () {
        this.up = []
        this.todo = []
        this.down = []
        this.passes = []
        this.fails = []
        this.errors = []
    }

    setup (callback) {
        this.up.push([caller(), callback])
    }

    test (comment, callback, tags = []) {
        this.todo.push([`${caller()}::${comment}`, callback, tags])
    }

    multiTest (comment, functionToTest, cases, tags = []) {
        const callBy = caller()
        cases.forEach(([args, result], idx) => {
            this.todo.push([
                `${callBy}::${comment} ${idx}`,
                () => assert(functionToTest(...args) === result),
                tags
            ])
        })
    }

    teardown (callback) {
        this.down.push([caller(), callback])
    }

    filter (tagName) {
        this.todo = this.todo.filter(([comment, test, tags]) => tags.includes(tagName))
    }

    async run () {
        for (const [comment, test] of this.todo) {
            try {
                const callFile = comment.split('::')[0]
                const [ , setup = false] = this.up.filter(([file, _]) => file === callFile).pop() ?? []
                const [ , teardown = false] = this.down.filter(([file, _]) => file === callFile).pop() ?? []
                
                if (setup) setup()

                const result = test()
                if (typeof result === 'object') await result
                
                if (teardown) teardown()
                this.passes.push(comment)
            } catch (e) {
                if (e instanceof assert.AssertionError) {
                    this.fails.push(comment)
                } else {
                    this.errors.push(comment)
                }
            }
        }
    }

    terse () {
        return this.cases()
            .map(([title, results]) => `${title}: ${results.length}`)
            .join(' ')
    }

    verbose () {
        let report = ''
        let prefix = ''
        for (const [title, results] of this.cases()) {
            report += `${prefix}${title}:`
            prefix = '\n'
            for (const r of results) {
                report += `${prefix}  ${r}`
            }
        }
        return report
    }

    cases () {
        return [
            ['passes', this.passes],
            ['fails', this.fails],
            ['errors', this.errors]]
    }
}

export default new Hope()
