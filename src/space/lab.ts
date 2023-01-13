import { Coords, LinearCoord, scaleEach } from './coords'
import { Vec3 } from './vec3'
import { XYZ_D65 } from './xyz-d65'

const ε = 216/24389
const ε3 = 24/116
const κ = 24389/27

export const LAB = Object.freeze({
    base: XYZ_D65,
    id: 'lab',
    name: 'Lab',
    coords: [
        LinearCoord('l-star', [0, 100]),
        LinearCoord('a-star', [-125, 125]),
        LinearCoord('b-star', [-125, 125])
    ],
    fromBase (coords: Coords) {
		const f = coords
            .map((c, i) => c / XYZ_D65.white[i])
            .map(c => c > ε ? Math.cbrt(c) : (κ * c + 16) / 116)

		return [
			116 * f[1] - 16,
			500 * (f[0] - f[1]),
			200 * (f[1] - f[2])
		]
	},
    toBase: (coords: Coords) => {
		const f1 = (coords[0] + 16) / 116
		const f0 = coords[1] / 500 + f1
		const f2 = f1 - coords[2] / 200
		const [x, y, z] = [
			f0 > ε3 ? Math.pow(f0, 3) : (116 * f0 - 16) / κ,
			coords[0] > 8 ?  Math.pow((coords[0] + 16) / 116, 3) : coords[0] / κ,
			f2 > ε3 ? Math.pow(f2, 3) : (116 * f2 - 16) / κ
		].map((c, i) => c / XYZ_D65.white[i])

		return [x, y, z]
	},
})