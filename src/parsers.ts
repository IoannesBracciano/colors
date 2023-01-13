export type UnitAngle = 'deg' | 'grad' | 'rad' | 'turn'

export const ComponentValue = function (str: string, type: 'Angle' | 'Fraction' | 'Intensity') {
    if (typeof str !== 'string') {
        return null
    }
    const results = Parsers[type].exec(str)
    if (!results) {
        return null
    }
    return results
}

export const Coord = Object.freeze({
    inUnits(fraction: number, unit: 'deg' | 'grad' | 'rad' | 'turn') {
        return `${Unit[unit].inCircle * fraction}${Unit[unit].id}`
    }
})

export const Degree = Object.freeze({
    inCircle: 360,
    id: 'deg',
    name: 'degree',
    to: Object.freeze({
        grad: 1 / 0.9,
        rad: Math.PI / 180,
        turn: 1 / 360 
    })
})

export const Unit = Object.freeze({
    'deg': Degree
})

const Parsers = Object.freeze({
    Angle: /(?:(\d*\.\d*)|(\d+(\.\d*)?)|(\d+))(deg|grad|rad|turn)?/,
    Coordinate: /(?:(\d*\.\d*)|(\d+(\.\d*)?)|(\d+))(deg|grad|rad|turn|%)?/,
    ColorFnNotation: /^((?:rgba?)|(?:hsla?)|(?:hwb))\((.*)\)$/,
    ColorHexNotation: /^#(.*)$/i,
    Fraction: /(?:(\d+)(%)|(\d*\.\d*)|(\d+(\.\d*)?)|(\d+))/,
    Intensity: /(?:(\d+)(%)|(\d+))/
})
