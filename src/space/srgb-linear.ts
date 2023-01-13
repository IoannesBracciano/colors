import { Coords, LinearCoord, transform, TransformMatrix } from './coords'
import { Vec3 } from './vec3'
import { XYZ_D65 } from './xyz-d65'

const FROM_XYZ: TransformMatrix = [
	[  3.2409699419045226,  -1.537383177570094,   -0.4986107602930034  ],
	[ -0.9692436362808796,   1.8759675015077202,   0.04155505740717559 ],
	[  0.05563007969699366, -0.20397695888897652,  1.0569715142428786  ]
]

const TO_XYZ: TransformMatrix = [
	[ 0.41239079926595934, 0.357584339383878,   0.1804807884018343  ],
	[ 0.21263900587151027, 0.715168678767756,   0.07219231536073371 ],
	[ 0.01933081871559182, 0.11919477979462598, 0.9505321522496607  ]
]

export const sRGBLinear = Object.freeze({
    base: XYZ_D65,
    coords: [
        LinearCoord('red', [0, 1]),
        LinearCoord('green', [0, 1]),
        LinearCoord('blue', [0, 1])
    ],
    id: 'srgb-linear',
    name: 'Linear sRGB',
    fromBase: (coords: Coords) => transform(coords, FROM_XYZ),
    toBase: (coords: Coords) => transform(coords, TO_XYZ)
})