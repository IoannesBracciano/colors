import { array, arrayOf, int, string } from "./typed"

const emptyArray = []
const emptyObject = {}
const emptyString = ""
const intArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
const mixedArray = [0.3, 'km', undefined]
const someString = "66% of that tetris cat "
const stringArray = ['t', 'e', 's', 't', 'i', 'n', 'g']

test('"array" will return true given any array, false otherwise', () => {
    expect(array(emptyArray)).toBe(true)
    expect(array(emptyObject)).toBe(false)
    expect(array(emptyString)).toBe(false)
    expect(array(intArray)).toBe(true)
    expect(array(mixedArray)).toBe(true)
    expect(array(someString)).toBe(false)
    expect(array(stringArray)).toBe(true)
    expect(array(3)).toBe(false)
    expect(array(null)).toBe(false)
    expect(array(true)).toBe(false)
    expect(array(undefined)).toBe(false)
})

test('"arrayOf(type)" will return true given an array of specified "type", false otherwise', () => {
    expect(arrayOf(int)(emptyArray)).toBe(true)
    expect(arrayOf(string)(emptyArray)).toBe(true)
    expect(arrayOf(int)(emptyObject)).toBe(false)
    expect(arrayOf(int)(emptyString)).toBe(false)
    expect(arrayOf(int)(intArray)).toBe(true)
    expect(arrayOf(string)(intArray)).toBe(false)
    expect(arrayOf(int)(mixedArray)).toBe(false)
    expect(arrayOf(int)(someString)).toBe(false)
    expect(arrayOf(int)(stringArray)).toBe(false)
    expect(arrayOf(int)(3)).toBe(false)
    expect(arrayOf(int)(null)).toBe(false)
    expect(arrayOf(int)(true)).toBe(false)
    expect(arrayOf(int)(undefined)).toBe(false)
})