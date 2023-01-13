import { Coords } from './coords'
import { sRGB } from './srgb';

export const HSL = Object.freeze({
    base: sRGB,
    id: 'hsl',
    name: 'HSL',
    fromBase (values: Coords) {
        const [R, G, B] = values
        const M = Math.max(...values)
        const m = Math.min(...values)
        const C = M - m
        const hPrime =
            C === 0 ? 0 :
            M === R ? ((G - B) / C) % 6 :
            M === G ? ((B - R) / C) + 2 : ((R - G) / C) + 4
        const h = 60 * hPrime
        const l = (M + m) / 2
        const s = C && C / (1 - Math.abs(2 * l - 1))
        return [h, s, l]
	},
    toBase: (values: Coords) => {
        const [h, s, l] = values
        if (s === 0) {
            return Array(3).fill(l)
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
        const r = hue2rgb(p, q, h + 1/3)
        const g = hue2rgb(p, q, h)
        const b = hue2rgb(p, q, h - 1/3)
        return [r, g, b]
	},
})