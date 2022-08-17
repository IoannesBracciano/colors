import { red } from "."

test('red is red', () => {
    expect(red.r).toEqual(255)
    expect(red.g).toEqual(0)
    expect(red.b).toEqual(0)
})
