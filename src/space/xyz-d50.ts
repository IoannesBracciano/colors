import { Coords, LinearCoord, transform, TransformMatrix } from './coords'
import { XYZ_D65 } from './xyz-d65'

const FROM_XYZ_D65: TransformMatrix = [
    [  1.0479298208405488,    0.022946793341019088,  -0.05019222954313557 ],
    [  0.029627815688159344,  0.990434484573249,     -0.01707382502938514 ],
    [ -0.009243058152591178,  0.015055144896577895,   0.7518742899580008  ]
]

const TO_XYZ_D65: TransformMatrix = [
    [  0.9554734527042182,   -0.023098536874261423,  0.0632593086610217   ],
    [ -0.028369706963208136,  1.0099954580058226,    0.021041398966943008 ],
    [  0.012314001688319899, -0.020507696433477912,  1.3303659366080753   ]
]

export const XYZ_D50 = Object.freeze({
    base: XYZ_D65,
    id: 'xyz-d50',
    name: 'XYZ D50',
    coords: [
        LinearCoord('x'),
        LinearCoord('y'),
        LinearCoord('z')
    ],
    white: [0.3457 / 0.3585, 1.00000, (1.0 - 0.3457 - 0.3585) / 0.3585],
    fromBase: (coords: Coords) => transform(coords, FROM_XYZ_D65),
    toBase: (coords: Coords) => transform(coords, TO_XYZ_D65)
})
