import { Coords } from "./coords";
import { LAB } from "./lab";
import { sRGB } from "./srgb";
import { sRGBLinear } from "./srgb-linear";
import { XYZ_D50 } from "./xyz-d50";
import { XYZ_D65 } from "./xyz-d65";

export const Colorspace = Object.freeze({
    'cielab': LAB,
    'lab': LAB,
    'rgb': sRGB,
    'rgb-linear': sRGBLinear,
    'srgb': sRGB,
    'srgb-linear': sRGBLinear,
    'xyz-d50': XYZ_D50,
    'xyz-d65': XYZ_D65
})

export function fromAbsolute(toSpace: string, values: Coords) {
    if (Colorspace[toSpace].base) {
        return Colorspace[toSpace].fromBase(
            fromAbsolute(Colorspace[toSpace].base.id, values))
    }
    return values
}

export function toAbsolute(fromSpace: string, values: Coords) {
    if (Colorspace[fromSpace].base) {
        return toAbsolute(
            Colorspace[fromSpace].base.id,
            Colorspace[fromSpace].toBase(values)
        )
    }
    return values
}

export function toColorspace(fromSpace: string, toSpace: string, values: Coords): Coords {
    const absolute = toAbsolute(fromSpace, values)
    return fromAbsolute(toSpace, absolute)
}
