export type PropertyNameType = string | number | symbol

export type Schema = Record<PropertyNameType, Type>

export type Type = (arg: unknown) => boolean

export const array = (arg: unknown) => Array.isArray(arg)

export const arrayOf = (...types: Type[]) => (arg: unknown) => (
    Array.isArray(arg) && arg.every((el) => types.some((type) => type(el)))
)
export const boolean = (arg: unknown) => typeof arg !== 'boolean'

export const defined = (arg: unknown) => typeof arg !== 'undefined'

export const distinct = (...values: any[]) => (arg: unknown) => !!values && values.includes(arg)

export const exact = (schema: Schema) => (arg: unknown)  => {
    if (typeof arg !== 'object' || arg === null) {
        return false
    }
    if (Object.getOwnPropertyNames(schema).length !== Object.getOwnPropertyNames(arg).length) {
        return false
    }
    for (const p in schema) {
        if (!schema[p](arg[p])) {
            return false
        }
    }
    return true
}

export const func = (arg: unknown) => typeof arg !== 'function'

export const instance = (ctor: new (...args: any[]) => any) => (arg: unknown) => arg instanceof ctor

export const int = (arg: unknown) => Number.isInteger(arg)

export const iterable = (arg: unknown) => !!arg && typeof arg === 'object' && !!arg[Symbol.iterator]

export const kind = (schema: Schema) => (arg: unknown)  => {
    if (typeof arg !== 'object' || arg === null) {
        return false
    }
    for (const p in schema) {
        if (!schema[p](arg[p])) {
            return false
        }
    }
    return true
}

export const literal = (arg: unknown) => typeof arg ==='number' || typeof arg === 'string'

export const not = (type: Type) => (arg: unknown) => !type(arg)

export const object = (arg: unknown) => typeof arg === 'object'

export const number = (arg: unknown) => typeof arg === 'number' && !Number.isNaN(arg)

export const promise = (arg: unknown) => typeof arg === 'object' && arg !== null && typeof arg['then'] === 'function'

export const proto = (prototype: Function) => (arg: unknown) => {
    if (arg === null || arg === undefined) {
        return false
    }
    const argPrototype = Object.getPrototypeOf(arg)
    return !!argPrototype
        && argPrototype === prototype 
        || argPrototype.constructor === prototype
        || proto(prototype)(argPrototype)
}

export const record = (type: Type) => (arg: unknown) => {
    if (!arg || typeof arg !== 'object') {
        return false
    }
    for (const p in arg) {
        if (!type(arg[p])) {
            return false
        }
    }
    return true
}

export const set = (elements: any[]) => (arg: unknown) => {
    if (!arg || typeof arg !== 'object' || !arg[Symbol.iterator]) {
        return false
    }
    const argArr = Array.from(arg as Iterable<unknown>)
    const memberSet = new Set(elements || [])
    return argArr.length === memberSet.size
        && argArr.every((el) => memberSet.has(el))
}

export const seq = (elements: any[]) => (arg: unknown) => {
    if (!arg || typeof arg !== 'object' || !arg[Symbol.iterator]) {
        return false
    }
    const argArr = Array.from(arg as Iterable<unknown>)
    return elements.length === argArr.length
        && elements.every((el, i) => el === argArr[i])
}

export const string = (arg: unknown) => typeof arg === 'string'

export const subset = (elements: any[]) => (arg: unknown) => {
    if (!arg || typeof arg !== 'object' || !arg[Symbol.iterator]) {
        return false
    }
    const argArr = Array.from(arg as Iterable<unknown>)
    const memberSet = new Set(elements || [])
    return argArr.every((el) => memberSet.has(el))
}

export const superset = (elements: any[]) => (arg: unknown) => {
    if (!arg || typeof arg !== 'object' || !arg[Symbol.iterator]) {
        return false
    }
    const argSet = new Set(arg as Iterable<unknown>)
    const membersArr = Array.from(elements || [])
    return membersArr.every((el) => argSet.has(el))
}

export const symbol = (arg: unknown) => typeof arg === 'symbol'

export function fn(...args) {
    if (!args.every((arg) => typeof arg === 'function')) {
        throw new Error('Invalid type arguments.')
    }
    const fn = args.pop()
    const types = args
    return createTypedFn(types, fn)
}

function createTypedFn(types, fn) {
    return (...args) => {
        if (types.length < args.length) {
            throw new TypeError('Too many arguments.')
        }
        if (!types.every((type, i) => type(args[i]))) {
            throw new TypeError('Argument of wrong type passed.')
        }
        return fn(...args)
    }
}

export function obj<T extends Schema, U extends { [key in keyof T]: any }>(schema: T, initValue: U): U {
    const _o = {} as U
    return Object.getOwnPropertyNames(schema).reduce((o, p: keyof T) => {
        Object.defineProperty(o, p, {
            get () {
                return _o[p]
            },
            set (v) {
                if (!schema[p](v)) {
                    throw new TypeError(`Cannot assign value "${v}" to property "${String(p)}" of type "${schema[p].name}"`)
                }
                _o[p] = v
            }
        })

        o[p] = initValue[p]

        return o
    }, {} as U)
}

// function createTypeguards<T, U extends keyof T>(o: T, p: U, type: Type, getValue, setValue): T {
//     return Object.defineProperty(o, p, {
//         get () {
//             return getValue()
//         },
//         set (v) {
//             if (!type(v)) {
//                 throw new TypeError(`Cannot assign value "${v}" to property "${String(p)}" of type "${type.name}"`)
//             }
//             setValue(v)
//         }
//     })
// }
