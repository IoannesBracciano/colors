import { Coords } from './coords'
import { HSL } from './hsl';

export const HWB = Object.freeze({
    base: HSL,
    id: 'hwb',
    name: 'HWB',
    fromBase (values: Coords) {
        const [h, s, l] = values
        const v = l + s * Math.min(l, 1 - l)
        const S = v == 0 ? 0 : 2 * (1 - l / v)
        const w = v * (1 - S)
        const b = 1 - v
        return [h, w, b]
	},
    toBase: (values: Coords) => {
        const [h, w, b] = values
        const S = 1 - w / (1 - b)
        const v = 1 - b
        const l = v * (1 - S / 2)
        const s =
            l === 0 || l === 1
                ? 0
                : (v - l) / Math.min(l, 1 - l)
        return [h, s, l]
	},
})