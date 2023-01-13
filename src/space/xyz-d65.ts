import { LinearCoord } from './coords'

export const XYZ_D65 = Object.freeze({
    base: null,
    id: 'xyz-d65',
    name: 'XYZ D65',
    coords: [
        LinearCoord('x'),
        LinearCoord('y'),
        LinearCoord('z')
    ],
    white: [0.3127 / 0.3290, 1.00000, (1.0 - 0.3127 - 0.3290) / 0.3290]
})