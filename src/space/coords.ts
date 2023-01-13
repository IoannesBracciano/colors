export type Coords = [number, number, number]

export type TransformMatrix = [
    [number, number, number],
    [number, number, number],
    [number, number, number]
]

function Coord(name: string, range: [number?, number?] | undefined, accessor: string, polar: boolean) {
    if (typeof name !== 'string' || name.length === 0) {
        throw Error('Invalid coordinate name')
    }
    const [min = -Infinity, max = Infinity] = (range || []).map(Number)
    return Object.freeze({
        accessor,
        name,
        polar,
        range: [min, max]
    })
}

export function LinearCoord(name: string, range?: [number?, number?], accessor?: string) {
    return Coord(name, range, accessor ? `${accessor}` : name[0], false)
}

export function PolarCoord(name: string, range?: [number?, number?], accessor?: string) {
    return Coord(name, range, accessor ? `${accessor}` : name[0], true)
}

export function scale(coords: Coords, factor: number) {
    return coords.map((c) => factor * c) as Coords
}

export function scaleEach(coords: Coords, factors: Coords) {
    return coords.map((c, i) => factors[i] * c) as Coords
}

export function transform(coords: Coords, matrix: TransformMatrix) {
    return matrix.map((row) =>
        row.reduce((sum, el, i) => sum + el * coords[i], 0)
    ) as Coords
}
