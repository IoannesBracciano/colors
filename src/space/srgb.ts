import { Coords, LinearCoord } from './coords'
import { sRGBLinear } from './srgb-linear'

export const sRGB = Object.freeze({
    base: sRGBLinear,
    id: 'srgb',
    name: 'sRGB',
    coords: [
        LinearCoord('red', [0, 1]),
        LinearCoord('green', [0, 1]),
        LinearCoord('blue', [0, 1])
    ],
    fromBase: (coords: Coords) => coords.map((c) => {
        const sign = c < 0 ? -1 : 1
        const absc = Math.abs(c)

        if (absc > 0.0031308) {
            return sign * (1.055 * (absc ** (1 / 2.4)) - 0.055)
        }

        return 12.92 * c
    }),
    toBase: (coords: Coords) => coords
        .map((c) => +c || 0)
        .map((c) => c > 0.04045
            ? Math.pow((c + 0.055) / 1.055, 2.4)
            : c / 12.92
        ),
})
