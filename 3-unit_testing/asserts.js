import assert from 'assert'
import hope from './hope.js'


function assertSetEqual (actual, expected, message) {
    if(actual.lenght === expected.lenght && [...actual].every(value => expected.has(value))) return
    throw new assert.AssertionError({ actual, expected, operator: 'set comparassion', message})
}

function assertMapEqual (actual, expected, message) {
    if (actual.size === expected.size) {
        for (const [key,  value] of actual) {
            if (JSON.stringify(value) !== JSON.stringify(expected.get(key)) || (value === undefined && !expected.has(key))) {
                throw new assert.AssertionError({ actual, expected, operator: 'map comparassion', message})
            }
        }
        return
    }
    throw new assert.AssertionError({ actual, expected, operator: 'map comparassion', message})
}

function assertArraySame (actual, expected, message) {
    const expectedStringify = expected.map(el => JSON.stringify(el))
    if (actual.lenght === expected.lenght && actual.every(value => expectedStringify.includes(JSON.stringify(value)))) return
    throw new assert.AssertionError({ actual, expected, operator: 'array comparassion', message})
}


hope.test('Checks set equality', () => assertSetEqual(new Set([1, 2, 3]), new Set([3, 1, 2]), 'Sets are equal'))
hope.test('Checks set inequality', () => assertSetEqual(new Set([1, 2, 3]), new Set([5, 1, 2]), 'Sets are not equal'))

const map1 = new Map();
map1.set('num', 1);
map1.set('arr', [1, 2]);
map1.set('str', 'abc');
map1.set('?', undefined);

const map2 = new Map();
map2.set('str', 'abc');
map2.set('num', 1);
map2.set('arr', [1, 2]);
map2.set('?')

assertMapEqual(map1, map2, 'Maps are equal')
hope.test('Checks map equality', () => assertMapEqual(map1, map2, 'Maps are equal'))

const map3 = new Map();
map3.set('num', 1);
map3.set('arr', [1, 2, 3]);

const map4 = new Map();
map4.set('str', 'abc');
map4.set('arr', [1, 2, 5]);

hope.test('Checks map inequality', () => assertMapEqual(map3, map4, 'Maps are not equal'))


hope.test('Checks array equality', () => assertArraySame([1, [2, 3], {x: 1, y: 3}], [{x: 1, y: 3}, 1, [2, 3]], 'Arrays are equal'))
hope.test('Checks array inequality', () => assertArraySame([1, [2, 3], {x: 1, y: 3}], [{x: 1 }, 1, [3, 3]], 'Arrays are not equal'))

hope.run()
console.log(hope.verbose())
