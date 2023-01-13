// import { ColorspaceName, Colorspace } from "./colorspaces";

import { Coords } from "./space/coords"
import { toColorspace } from "./space"

export interface Unit {
    get max(): number
    get min(): number
    get name(): string
    get symbol(): string
    inverse(): number
    to(unit: string): number | undefined
}

function Unit(name: string, symbol: string, min: number, max: number, conversionFactors?: Readonly<Record<string, number>>) {
    const unit: Unit = {
        get max() {
            return max
        },
        get min() {
            return min
        },
        get name() {
            return name
        },
        get symbol() {
            return symbol
        },
        inverse() {
            return 1 / max
        },
        to(unit: string) {
            if (unit === symbol || unit === name) {
                return 1
            }
            return conversionFactors ? conversionFactors[unit] : undefined
        }
    }

    Object.defineProperties(Unit, {
        [name]: {
            get () {
                return unit
            }
        },
        [symbol]: {
            get () {
                return unit
            }
        }
    })

    return unit
}

Unit('degrees', 'deg', 0, 360, {
    'grad': 1 / 0.9,
    'rad': Math.PI / 180,
    'turn': 1 / 360
})

Unit('gradians', 'grad', 0, 400, {
    'deg': 0.9,
    'rad': Math.PI / 200,
    'turn': 1 / 400
})

Unit('radians', 'rad', 0, 2 * Math.PI, {
    'deg': 180 / Math.PI,
    'grad': 200 / Math.PI,
    'turn': 0.5 / Math.PI
})

Unit('turns', 'turn', 0, 2 * Math.PI, {
    'deg': 360,
    'grad': 400,
    'rad': 2 * Math.PI
})

Unit('percent', '%', 0, 100)

export type Quantity = {
    get unit(): string
    get value(): number
    to(unit: string): Quantity
    valueOf(unit?: string): number
}

function Quantity(prototype: any, value: number, unit: string | null) {
    return Object.assign(Object.create(prototype), {
        get unit() {
            return unit
        },
        get value() {
            return value
        }
    })
}

export type AngleUnit = ReturnType<typeof Angle.units>[number]

export function Angle(strOrValue: string | number, unit: AngleUnit = 'deg') {
    if (typeof strOrValue === 'string') {
        const [value, unit] = Angle.parse(strOrValue)
        return Quantity(Angle.prototype, Angle.sanitize(value, unit), unit)
    }
    return Quantity(Angle.prototype, Angle.sanitize(strOrValue, unit), unit)
}

Angle.parse = function Angle_parse(str: string) {
    const [value, unit = 'deg'] = (str.match(/[a-z]+|\d+(\.\d*)?/gi) || []) as [string, AngleUnit]

    if (!Angle.units().includes(unit)) {
        throw new EvalError(`Invalid angle unit of measurement "${str}".`)
    }

    return [parseFloat(value), unit] as const
}

Angle.prototype.to = function Angle_prototype_to(this: Quantity, unit: AngleUnit) {
    return Angle(this.valueOf(unit), unit)
}

Angle.prototype.valueOf = function Angle_prototype_valueOf(this: Quantity, unit: AngleUnit = 'deg') {
    const unitDef = Unit[this.unit]
    if (!unitDef) {
        return this.value;
    }
    const factor = unitDef.to(unit)
    return factor && Angle.sanitize(factor * this.value, unit)
}

Angle.sanitize = function Angle_sanitize(value: number, unit: AngleUnit) {
    const unitDef = Unit[unit]
    if (!unitDef) {
        return value;
    }
    if (value < unitDef.min) {
        const d = Math.ceil(Math.abs(value) / unitDef.max)
        const v = d * unitDef.max + value
        return unit === 'deg' || unit === 'grad'
            ? Math.round(v)
            : Math.round(v * 100) / 100
    }
    return unit === 'deg' || unit === 'grad'
        ? Math.round(value % unitDef.max)
        : Math.round(value % unitDef.max * 100) / 100
}

Angle.units = function Angle_units() {
    return ['deg', 'grad', 'rad', 'turn'] as const
}

export type IntensityUnit = '%' | null

export function Intensity(strOrValue: string | number, unit: IntensityUnit = null) {
    if (typeof strOrValue === 'string') {
        const [value, unit] = Intensity.parse(strOrValue)
        return Quantity(Intensity.prototype, Intensity.sanitize(value, unit), unit)
    }
    return Quantity(Intensity.prototype, Intensity.sanitize(strOrValue, unit), unit)
}

Intensity.parse = function Intensity_parse(str: string) {
    const [value, unit = null] = (str.match(/%|\d+(\.\d*)?/gi) || []) as [string, IntensityUnit]
    return [parseInt(value), unit] as const
}

Intensity.prototype.valueOf = function Intensity_prototype_valueOf(this: Quantity, unit: IntensityUnit = null) {
    if (this.unit === unit) {
        return this.value
    }
    if (unit === '%') {
        return Intensity.sanitize(this.value * 100 / 255, unit)
    }
    return Intensity.sanitize(this.value * 255 / 100, unit)
}

Intensity.sanitize = function Intensity_sanitize(value: number, unit: IntensityUnit) {
    if (unit === null) {
        return Math.round(Math.min(Math.max(value, 0), 255))
    }
    return Math.round(Math.min(Math.max(value, 0), 100))
}

Intensity.units = function Intensity_units() {
    return ['%', null] as const
}

export type LinearIntensityUnit = null

export function LinearIntensity(strOrValue: string | number, unit: LinearIntensityUnit = null) {
    if (typeof strOrValue === 'string') {
        const [value, unit] = LinearIntensity.parse(strOrValue)
        return Quantity(LinearIntensity.prototype, LinearIntensity.sanitize(value, unit), unit)
    }
    return Quantity(LinearIntensity.prototype, LinearIntensity.sanitize(strOrValue, unit), unit)
}

LinearIntensity.parse = function LinearIntensity_parse(str: string): [number, null] {
    const [value] = (str.match(/-?\d+(\.\d*)?/) || [])
    return value ? [parseInt(value), null] : [0, null]
}

LinearIntensity.prototype.valueOf = function LinearIntensity_prototype_valueOf(this: Quantity, unit: LinearIntensityUnit = null) {
    return LinearIntensity.sanitize(this.value, unit)
}

LinearIntensity.sanitize = function LinearIntensity_sanitize(value: number, unit: IntensityUnit) {
    return Math.round(Math.min(Math.max(value, -128), 127))
}

LinearIntensity.units = function LinearIntensity_units() {
    return [null] as const
}

export type FractionUnit = ReturnType<typeof Fraction.units>[number]

export function Fraction(strOrValue: string | number, unit: FractionUnit = null) {
    if (typeof strOrValue === 'string') {
        const [value, unit] = Fraction.parse(strOrValue)
        return Quantity(Fraction.prototype, Fraction.sanitize(value, unit), unit)
    }
    return Quantity(Fraction.prototype, Fraction.sanitize(strOrValue, unit), unit)
}

Fraction.parse = function Fraction_parse(str: string) {
    const [value, unit = null] = (str.match(/%|\d+(\.\d*)?/gi) || []) as [string, FractionUnit]

    return [parseFloat(value), unit] as const
}

Fraction.prototype.valueOf = function Fraction_prototype_valueOf(this: Quantity, unit: FractionUnit = null) {
    if (this.unit === unit) {
        return this.value
    }
    if (this.unit === '%') {
        return this.value / 100
    }
    return this.value * 100
}

Fraction.sanitize = function Fraction_sanitize(value: number, unit: FractionUnit) {
    const max = unit === '%' ? 100 : 1
    if (unit === '%') {
        return Math.round(Math.min(Math.max(value, 0), 100))
    }
    return Math.round(Math.min(Math.max(value, 0), 1) * 100) / 100
}

Fraction.units = function Fraction_units() {
    return ['%', null] as const
}

const colorFnNotationParser = /^((?:rgba?)|(?:hsla?)|(?:hwb))\(([^, ]+)(?:(?: *, *)|(?: +))([^, ]+)(?:(?: *, *)|(?: +))([^, ]+)\)$/

const colorHexNotationParser = /^#([\da-f]{2})([\da-f]{2})([\da-f]{2})([\da-f]{2})?$/i

export function parse(str: string) {
    if (str.startsWith('#')) {
        const tokens = colorHexNotationParser.exec(str)
        return parseTokens(tokens, 'hex')
    }
    const tokens = colorFnNotationParser.exec(str)
    return parseTokens(tokens, 'fn')
}

function parseTokens(tokens: RegExpExecArray | null, notation: 'hex' | 'fn') {
    if (tokens && notation === 'hex') {
        const rawValues = (tokens[1] ? tokens.slice(1, 5) : tokens.slice(5, 9)).filter(Boolean).concat('ff')
        const parsedValues = rawValues.map((c) => parseInt(c.padEnd(2, c), 16))
        parsedValues[3] /= 255
        return { colorspace: 'rgb', components: parsedValues.slice(0, 4) }
    }
    if (tokens && notation === 'fn') {
        const colorspace = Colorspace[tokens[1].slice(0, 3) as ColorspaceName]
        const rawValues = tokens.slice(2, 5)
        const parsedValues = rawValues.map((c, i) => (
            colorspace.components[i].measure(c).valueOf()
        )).concat([1])
        return { colorspace: colorspace.name, components: parsedValues.slice(0, 4) }
    }
}

export type ColorspaceName = 'rgb' | 'hsl' | 'hwb' | 'lch' | 'lab' | 'rgb-linear';

export type ComponentName = 'blackness' | 'blue' | 'green' | 'hue' | 'lightness' | 'opponent' | 'red' | 'saturation' | 'whiteness'

export interface Colorspace<T, U, V> {
    get components(): [T, U, V]
    get name(): ColorspaceName
    sanitize(componentValues: [number, number, number]): [number, number, number]
}

function Colorspace<T extends Component<any>, U extends Component<any>, V extends Component<any>>(name: ColorspaceName, components: [T, U, V, number?]): Colorspace<T, U, V> {
    const colorspace = Object.assign(
        Object.create(Colorspace.prototype),
        {
            get components() {
                return components
            },
            get name() {
                return name
            },
        }
    )

    Object.defineProperty(Colorspace, name, {
        get () {
            return colorspace
        }
    })

    return colorspace
}

Colorspace.prototype.sanitize = function Colorspace_prototype_sanitize<T extends Component<any>, U extends Component<any>, V extends Component<any>>(this: Colorspace<T, U, V>, componentValues: [number, number, number]) {
    return componentValues.map((c, i) => c && this.components[i].measure(c).value)
}

export type Component<T extends typeof Angle | typeof Intensity | typeof Fraction> = {
    readonly measure: T
    readonly name: ComponentName
}

function Component<T extends typeof Angle | typeof Intensity | typeof LinearIntensity | typeof Fraction>(name: ComponentName, measure: () => T) {
    return Object.freeze(
        {
            get measure() {
                return measure()
            },
            get name() {
                return name
            }
        }
    )
}

export const blackness = Component('blackness', () => Fraction)
export const blue = Component('blue', () => Intensity)
export const green = Component('green', () => Intensity)
export const hue = Component('hue', () => Angle)
export const lightness = Component('lightness', () => Fraction)
export const opponent = Component('opponent', () => LinearIntensity)
export const red = Component('red', () => Intensity)
export const saturation = Component('saturation', () => Fraction)
export const whiteness = Component('whiteness', () => Fraction)

export function convert(color: Color, toColorspace: ColorspaceName) {
    const [t, u, v, a] = formulas[color.colorspace][toColorspace](color)
    return Color.create(toColorspace, Colorspace[toColorspace].sanitize([t, u, v]).concat([a]))
}

export const hsl = Colorspace('hsl', [hue, saturation, lightness])

export const hwb = Colorspace('hwb', [hue, whiteness, blackness])

export const lab = Colorspace('lab', [lightness, opponent, opponent])

export const rgb = Colorspace('rgb', [red, green, blue])

const RGB_LINEAR_FROM_XYZ = [
	[  3.2409699419045226,  -1.537383177570094,   -0.4986107602930034  ],
	[ -0.9692436362808796,   1.8759675015077202,   0.04155505740717559 ],
	[  0.05563007969699366, -0.20397695888897652,  1.0569715142428786  ]
]

const RGB_LINEAR_TO_XYZ = [
	[ 0.41239079926595934, 0.357584339383878,   0.1804807884018343  ],
	[ 0.21263900587151027, 0.715168678767756,   0.07219231536073371 ],
	[ 0.01933081871559182, 0.11919477979462598, 0.9505321522496607  ]
]

const formulas = {
    hsl: {
        hsl: (color: Color) => color,
        hwb: (color: Color) => {
            const [h, s, l, a] = color.components
            const v = l + s * Math.min(l, 1 - l)
            const S = v == 0 ? 0 : 2 * (1 - l / v)
            const w = v * (1 - S)
            const b = 1 - v
            return [h, w, b, a]
        },
        rgb: (color: Color) => {
            const [h, s, l] = color.normals
            if (s === 0) {
                return Array(3).fill(l * 255).concat([color.alpha])
            }
            function hue2rgb(p, q, t) {
                if(t < 0) t += 1
                if(t > 1) t -= 1
                if(t < 1/6) return p + (q - p) * 6 * t
                if(t < 1/2) return q
                if(t < 2/3) return p + (q - p) * (2/3 - t) * 6
                return p
            }
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s
            const p = 2 * l - q
            const r = hue2rgb(p, q, h + 1/3) * 255
            const g = hue2rgb(p, q, h) * 255
            const b = hue2rgb(p, q, h - 1/3) * 255
            return [r, g, b, color.alpha]
        }
    },
    hwb: {
        hsl: (color: Color) => {
            const [h, w, b, a] = color.components
            const S = 1 - w / (1 - b)
            const v = 1 - b
            const l = v * (1 - S / 2)
            const s =
                l === 0 || l === 1
                    ? 0
                    : (v - l) / Math.min(l, 1 - l)
            return [h, s, l, a]
        },
        hwb: (color: Color) => color,
        rgb: (color: Color) => {
            const [h, w, b] = color.normals
            const v = 1 - b
            if (h === undefined) {
                return Array(3).fill(v * 255).concat([color.alpha])
            }
            const H = h * 6
            const i = Math.floor(H)
            const d = H - i
            const f = i & 1 ? 1 - d : d
            const n = w + f * (v - w)
            const a = color.alpha
            const components =
                i === 6 || i === 0 ? [v, n, w] :
                i === 1 ? [n, v, w] :
                i == 2 ? [w, v, n] :
                i === 3 ? [w, n, v] :
                i === 4 ? [n, w, v] : [v, w, n]
            return components.map((c) => c * 255).concat([a])
        }
    },
    lab: {
        rgb: (color: Color) => {
            const [l, a, b] = color.components
            let y = (l * 116 + 16) / 116
            let x = a / 500 + y
            let z = y - b / 200
            
            x = 0.95047 * ((x * x * x > 0.008856) ? x * x * x : (x - 16/116) / 7.787);
            y = 1.00000 * ((y * y * y > 0.008856) ? y * y * y : (y - 16/116) / 7.787);
            z = 1.08883 * ((z * z * z > 0.008856) ? z * z * z : (z - 16/116) / 7.787);
            
            let r = x *  3.2406 + y * -1.5372 + z * -0.4986;
            let g = x * -0.9689 + y *  1.8758 + z *  0.0415;
            let B = x *  0.0557 + y * -0.2040 + z *  1.0570;
            
            r = (r > 0.0031308) ? (1.055 * Math.pow(r, 1/2.4) - 0.055) : 12.92 * r;
            g = (g > 0.0031308) ? (1.055 * Math.pow(g, 1/2.4) - 0.055) : 12.92 * g;
            B = (B > 0.0031308) ? (1.055 * Math.pow(b, 1/2.4) - 0.055) : 12.92 * B;
            
            return [Math.max(0, Math.min(1, r)) * 255, 
                    Math.max(0, Math.min(1, g)) * 255, 
                    Math.max(0, Math.min(1, B)) * 255]
        }
    },
    rgb: {
        hsl: (color: Color) => {
            const normals = color.normals
            const [R, G, B] = normals
            const M = Math.max(...normals)
            const m = Math.min(...normals)
            const C = M - m
            const hPrime =
                C === 0 ? 0 :
                M === R ? ((G - B) / C) % 6 :
                M === G ? ((B - R) / C) + 2 : ((R - G) / C) + 4
            const h = 60 * hPrime
            const l = (M + m) / 2
            const s = C && C / (1 - Math.abs(2 * l - 1))
            return [h, s, l, color.alpha]
        },
        hwb: (color: Color) => {
            const normals = color.normals
            const [R, G, B] = normals
            const M = Math.max(...normals)
            const m = Math.min(...normals)
            const C = M - m
            const hPrime =
                C === 0 ? undefined :
                M === R ? ((G - B) / C) % 6 :
                M === G ? ((B - R) / C) + 2 : ((R - G) / C) + 4
            const h = hPrime === undefined ? undefined : 60 * hPrime
            const b = 1 - M
            const w = m
            return [h, w, b, color.alpha]
        },
        lab: (color: Color) => {
            return toColorspace(
                    'rgb',
                    'lab',
                    color.components.slice(0, 3) as Coords
                ).concat([color.alpha])
            // const [r, g, b, a] = formulas.rgb["rgb-linear"](color)
            
            // let x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
            // let y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.00000;
            // let z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;
            
            // x = (x > 0.008856) ? Math.pow(x, 1/3) : (7.787 * x) + 16/116;
            // y = (y > 0.008856) ? Math.pow(y, 1/3) : (7.787 * y) + 16/116;
            // z = (z > 0.008856) ? Math.pow(z, 1/3) : (7.787 * z) + 16/116;
            
            // return [y - 16/116, 500 * (x - y), 200 * (y - z)]
            // return [(116 * y) - 16, 500 * (x - y), 200 * (y - z)]
        },
        rgb: (color: Color) => color
    }
}


export type Color = {
    alpha: number
    colorspace: ColorspaceName
    components: [number, number, number, number]
    mix: (other: Color, amount: number, colorspace?: ColorspaceName) => Color
    normals: number[]
    _cdiff?: number
    _cmax?: number
    _cmin?: number
}

const ColorProto = Object.freeze({
    get alpha() {
        return this.components[3]
    },
    get blackness() {
        return this.colorspace === 'hwb'
            ? this.components[0]
            : undefined
    },
    get blue() {
        return this.colorspace === 'rgb'
            ? this.components[2]
            : undefined
    },
    get green() {
        return this.colorspace === 'rgb'
            ? this.components[1]
            : undefined
    },
    get hue() {
        return this.colorspace === 'hsl' || this.colorspace === 'hwb'
            ? this.components[0]
            : undefined
    },
    get lightness() {
        return this.colorspace === 'hsl'
            ? this.components[2]
            : undefined
    },
    get max() {
        if (!this.__cc.cVx) {
            this.__cc.cVx = Math.max(...this.components)
        }
        return this.__cc.cVx
    },
    get min() {
        if (!this.__cc.cVn) {
            this.__cc.cVn = Math.min(...this.components)
        }
        return this.__cc.cVn
    },
    get red() {
        return this.colorspace === 'rgb'
            ? this.components[0]
            : undefined
    },
    get saturation() {
        return this.colorspace === 'hsl'
            ? this.components[1]
            : undefined
    },
    get whiteness() {
        return this.colorspace === 'hwb'
            ? this.components[1]
            : undefined
    },
    darken(this: Color, amount: number) {
        const { components } = convert(this, 'hsl')
        components[2] = Fraction.sanitize(1 - amount, null)
        const darkened = Color.create('hsl', components)
        return convert(darkened, this.colorspace)
    },
    lighten(this: Color, amount: number) {
        const { components } = convert(this, 'hsl')
        components[2] = Fraction.sanitize(amount, null)
        const lightened = Color.create('hsl', components)
        return convert(lightened, this.colorspace)
    },
    mix(this: Color, other: Color, amount: number, colorspace: ColorspaceName = 'lab') {
        const a = convert(this, colorspace)
        const b = convert(other, colorspace)
        const _amount = Fraction.sanitize(amount, null)
        const interpComponents = a.components.map((c, i) => c * (1 - _amount) + b.components[i] * _amount)
        const result = Color.create(colorspace, interpComponents)
        return convert(result, this.colorspace)

    },
    negative(this: Color) {
        const { components } = convert(this, 'hsl')
        components[0] = Angle.sanitize(components[0] - 180, 'deg')
        const negative = Color.create('hsl', components)
        return convert(negative, this.colorspace)
    },
    saturate(this: Color, amount: number) {
        const { components } = convert(this, 'hsl')
        components[1] = Fraction.sanitize(amount, null)
        const saturated = Color.create('hsl', components)
        return convert(saturated, this.colorspace)
    }
})

export function Color(cssColor: string): Color {
    const parsed = parse(cssColor)
    if (parsed) {
        return Color.create(parsed.colorspace, parsed.components)
    }
    throw new SyntaxError(`Invalid color syntax: "${cssColor}". Colorpsace not recognized.`)
}

Color.create = function Color_create(colorspace: ColorspaceName, components: (number | undefined)[]) {
    const _cache = {}
    return Object.assign(Object.create(ColorProto), {
        get __cc() {
            return _cache
        },
        get colorspace() {
            return colorspace
        },
        get components() {
            return components
        },
        get normals() {
            if (colorspace === 'rgb') {
                return (components as number[]).slice(0, 3).map((c) => c / 255)
            } else if (colorspace === 'hsl' || colorspace === 'hwb') {
                return [components[0] !== undefined ? components[0] / 360 : undefined, ...components.slice(1, 3)]
            } else {
                // TODO
                return components
            }
        }
    })
}
