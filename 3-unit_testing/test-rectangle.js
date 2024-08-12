// Rectangles represented by objects, x and y are the lower-left coordinates
//
//   (x, y+h)     (x+w, y+h)
//     *----------*
//     |          |
//     *----------*
//   (x, y)       (x+w, y)
//
// rect: {
//     x: x,
//     y: y,
//     w: innerWidth,
//     h: height
// }
import assert from 'assert'
import hope from './hope.js'

function overlay(a, b) {
    const [left, right] = a.x <= b.x ? [a, b] : [b, a]
    const [top, bottom] = a.x >= b.x ? [a, b] : [b, a]

    if ((left.x <= right.x) && (right.x < (left.x + left.w)) && (bottom.y <= top.y) && (top.y < (bottom.y + bottom.h))) {
        return {
            x: right.x, 
            y: top.y,
            w: ((right.x + right.w) <= (left.x + left.w) ?  (right.x + right.w) : (left.x + left.w)) - right.x,
            h: ((top.y + top.h) <= (bottom.y + bottom.h) ?  (top.y + top.h) : (bottom.y + bottom.h)) - top.y
        }
    }

    return null
}


hope.test('Rectangles overlaping', () => assert.deepEqual(overlay({x: 0, y: 0, w: 10, h: 6}, {x: 5, y: 3, w: 10, h: 6}), ({x: 5, y:3, w: 5, h: 3})))
hope.test('Rectangles touching and edge (overlaping)', () => assert.deepEqual(overlay({x: 0, y: 0, w: 10, h: 6}, {x: 0, y: 0, w: 4, h: 2}), ({x: 0, y: 0, w: 4, h: 2})))
hope.test('Rectangles touching a single corner (not overlaping)', () => assert(overlay({x: 0, y: 0, w: 10, h: 6}, {x: 10, y: 3, w: 5, h: 3}) === null))
