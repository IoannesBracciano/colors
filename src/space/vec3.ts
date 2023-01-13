export type TransformMatrix = [
    [number, number, number],
    [number, number, number],
    [number, number, number]
]

export type Vec3 = {
    readonly 0: number
    readonly 1: number
    readonly 2: number
    readonly length: 3
    map(mapFn: (x: number) => number): Vec3
    scale(factor: number): Vec3
    transform(matrix: TransformMatrix): Vec3
}

export function Vec3(x: number, y: number, z: number): Vec3 {
    return Object.assign(
        Object.create(Vec3.prototype),
        {
            get 0() {
                return x
            },
            get 1() {
                return y
            },
            get 2() {
                return z
            },
            get length() {
                return 3
            }
        }
    )
}


Vec3.prototype.map = function Vec3_map(this: Vec3, mapFn: (x: number) => number): Vec3 {
    const [x, y, z] = Array.from(this).map(mapFn)
    return Vec3(x, y, z)
}

Vec3.prototype.scale = function Vec3_scale(this: Vec3, factor: number): Vec3 {
    const [x, y, z] = Array.from(this).map((c) => factor * c)
    return Vec3(x, y, z)
}

Vec3.prototype.scaleEach = function Vec3_scale(this: Vec3, factors: [number, number, number]): Vec3 {
    const [x, y, z] = Array.from(this).map((c, i) => factors[i] * c)
    return Vec3(x, y, z)
}

Vec3.prototype.transform = function Vec3_transform(this: Vec3, matrix: TransformMatrix) {
    const [x, y, z] = matrix.map((row) =>
        row.reduce((sum, el, i) => sum + el * this[i], 0)
    )
    return Vec3(x, y, z)
}
