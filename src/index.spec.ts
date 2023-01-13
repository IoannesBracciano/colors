import { Color, convert } from "."
// import { convert } from "./colorspaces"

describe('Color constructor', () => {

    test('can parse #-hexadecimal notation', () => {
        const c1 = Color('#ff5267')
        expect(c1.colorspace).toBe('rgb')
        expect(c1.components).toEqual([255, 82, 103, 1])

        const c2 = Color('#44009038')
        expect(c2.colorspace).toBe('rgb')
        expect(c2.components).toEqual([68, 0, 144, 56/255])
    })

    test('can parse rgb(a) functional notation', () => {
        const c1 = Color('rgb(173 88 88)')
        expect(c1.colorspace).toBe('rgb')
        expect(c1.components).toEqual([173, 88, 88, 1])

        const c2 = Color('rgb(230, 210,227)')
        expect(c2.colorspace).toBe('rgb')
        expect(c2.components).toEqual([230, 210, 227, 1])

        const c3 = Color('rgb(50% 76% 85%)')
        expect(c3.colorspace).toBe('rgb')
        expect(c3.components).toEqual([128, 194, 217, 1])
    })

    test('can parse hsl(a) functional notation', () => {
        const c1 = Color('hsl(130 80% 87%)')
        expect(c1.colorspace).toBe('hsl')
        expect(c1.components).toEqual([130, 0.8, 0.87, 1])

        const c2 = Color('hsl(3.141592rad,0.5,0.34)')
        expect(c2.colorspace).toBe('hsl')
        expect(c2.components).toEqual([180, 0.5, 0.34, 1])

        const c3 = Color('hsl(100grad 100% 0.6)')
        expect(c3.colorspace).toBe('hsl')
        expect(c3.components).toEqual([90, 1, 0.6, 1])

        const c4 = Color('hsl(0.8turn, 0.95, 42%)')
        expect(c4.colorspace).toBe('hsl')
        expect(c4.components).toEqual([288, 0.95, 0.42, 1])
    })

    test('can parse hwb(a) functional notation', () => {
        const c1 = Color('hwb(15 92% 12%)')
        expect(c1.colorspace).toBe('hwb')
        expect(c1.components).toEqual([15, 0.92, 0.12, 1])

        const c2 = Color('hwb(1rad,0.77,0.08)')
        expect(c2.colorspace).toBe('hwb')
        expect(c2.components).toEqual([57, 0.77, 0.08, 1])

        const c3 = Color('hwb(80grad 0.1 34.5%)')
        expect(c3.colorspace).toBe('hwb')
        expect(c3.components).toEqual([72, 0.1, 0.35, 1])

        const c4 = Color('hwb(0.84turn, 2%, 0.05)')
        expect(c4.colorspace).toBe('hwb')
        expect(c4.components).toEqual([302, 0.02, 0.05, 1])
    })

})

describe('Colorspace "hsl"', () => {

    test('can convert colors from "rgb"', () => {
        const c1 = convert(Color('#6f52c3'), 'hsl')
        expect(c1.colorspace).toBe('hsl')
        expect(c1.components).toEqual([255, 0.48, 0.54, 1])

        const c2 = convert(Color('rgb(200 200 200)'), 'hsl')
        expect(c2.colorspace).toBe('hsl')
        expect(c2.components).toEqual([0, 0, 0.78, 1])
    })

    test('can convert colors from "hwb"', () => {
        const c1 = convert(Color('hwb(2 33% 2%)'), 'hsl')
        expect(c1.colorspace).toBe('hsl')
        expect(c1.components).toEqual([2, 0.94, 0.66, 1])
    })

})

describe('Colorspace "hwb"', () => {

    test('can convert colors from "rgb"', () => {
        const c1 = convert(Color('#6f52c3'), 'hwb')
        expect(c1.colorspace).toBe('hwb')
        expect(c1.components).toEqual([255, 0.32, 0.24, 1])

        const c2 = convert(Color('rgb(200 200 200)'), 'hwb')
        expect(c2.colorspace).toBe('hwb')
        expect(c2.components).toEqual([undefined, 0.78, 0.22, 1])
    })

    test('can convert colors from "hsl"', () => {
        const c1 = convert(Color('hsl(360 37% 22%)'), 'hwb')
        expect(c1.colorspace).toBe('hwb')
        expect(c1.components).toEqual([0, 0.14, 0.70, 1])
    })

})

describe('Colorspace "rgb"', () => {

    test('can convert colors from "hsl"', () => {
        const c1 = convert(Color('hsl(50 100% 50%)'), 'rgb')
        expect(c1.colorspace).toBe('rgb')
        expect(c1.components).toEqual([255, 213, 0, 1])
    })

    test('can convert colors from "hwb"', () => {
        const c1 = convert(Color('hwb(67 58% 11%)'), 'rgb')
        expect(c1.colorspace).toBe('rgb')
        expect(c1.components).toEqual([218, 227, 148, 1])
    })

})

fdescribe('Color operations', () => {
    test('can mix two colors in any colorspace', () => {
        const green = Color('#00ff00')
        const red = Color('#ff0000')
        const result = green.mix(red, 0.5)
        expect(result.components).toEqual([207, 168, 0, 1])
    })
})
