import { array, arrayOf, int, kind, number, string, fn, obj } from "./typed"

test('will call a function and forward the returned value if arguments are of valid type', () => {
    const onlyTruthy = fn(array, (arr) => arr.filter(Boolean))
    expect(onlyTruthy([{}, '0', 0, undefined, []])).toEqual([{}, '0', []])

    const odds = fn(arrayOf(int), (numbers) => numbers.filter((number) => number % 2))
    expect(odds([1, 2, 3, 4, 5, 6, 7, 8, 9])).toEqual([1, 3, 5, 7, 9])

    const square = fn(number, (x) => Math.pow(x, 2))
    expect(square(2)).toBe(4)

    const personKind = kind({ name: string, surname: string })
    const getFullName = fn(personKind, (person) => person.name + ' ' + person.surname)
    const person = { name: 'Sandra', middlename: 'Ray', surname: 'Smith' }
    expect(getFullName(person)).toBe('Sandra Smith')
})

test('will update property values of valid type', () => {
    const personSchema = {
        name: string,
        surname: string,
        age: int
    }
    const person = obj(personSchema, {
        name: 'John',
        surname: 'Snow',
        age: 30
    })
    expect(person.name).toBe('John')
    expect(person.surname).toBe('Snow')
    expect(person.age).toBe(30)
})