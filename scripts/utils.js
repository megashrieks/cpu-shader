
let abs = Math.abs;
let max = Math.max;
let min = Math.min;
let sin = Math.sin;
let cos = Math.cos;

const len = (a, b, c) => Math.sqrt(a ** 2 + b ** 2 + c ** 2);

const smoothstep = (lower, upper, val) => {
    let x = clamp((val - lower) / (upper - lower), 0, 1);
    return x * x * (3 - 2 * x);
}
const dot = (v1, v2) => v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2];
const cross = (v1, v2) => [
    v1[1] * v2[2] - v1[2] * v2[1],
    v1[2] * v2[0] - v1[0] * v2[2],
    v1[0] * v2[1] - v1[1] * v2[0]
]

const mulvector = (v1, v2) => [v1[0] * v2[0] , v1[1] * v2[1] , v1[2] * v2[2]];
const mulscalar = (v, s) => [v[0] * s, v[1] * s, v[2] * s];
const addscalar = (v, s) => [v[0] + s, v[1] + s, v[2] + s];
const addvector = (v1, v2) => [v1[0] + v2[0], v1[1] + v2[1], v1[2] + v2[2]];
const vmax = (v, m) => [Math.max(v[0], m), Math.max(v[1], m), Math.max(v[2], m)];
const clamp = (val, lower, upper) => {
    return Math.min(Math.max(val, lower), upper)
}

const reflect = (I, N) => {
    return addvector(I, mulscalar(N, -2 * dot(N, I)));
}

const normalize = v => {
    let l = len(...v)
    return [v[0] / l, v[1] / l, v[2] / l];
}

const getnormal = (v, sdf) => {
    let x1 = [v[0] + e, v[1], v[2]];
    let x2 = [v[0] - e, v[1], v[2]];

    let y1 = [v[0], v[1] + e, v[2]];
    let y2 = [v[0], v[1] - e, v[2]];

    let z1 = [v[0], v[1], v[2] + e];
    let z2 = [v[0], v[1], v[2] - e];
    return normalize([
        sdf(x1) - sdf(x2),
        sdf(y1) - sdf(y2),
        sdf(z1) - sdf(z2),
    ]);
}


function hem(r1, r2, normal) {
    let theta = 2 * Math.PI * r1;
    let phi = Math.acos(2 * r2 - 1);
    let costheta = Math.cos(theta);
    let sintheta = Math.sin(theta);
    let cosphi = Math.cos(phi);
    let sinphi = Math.sin(phi);
    let dir = [costheta * sinphi, sintheta * sinphi, cosphi];
    if (dot(dir, normal) <= 0) {
        dir = mulscalar(dir, -1);
    }
    return dir;
}
function boxRand(strength,normal) {
    return normalize(addvector(normalize([
        Math.random() * strength * 2 - strength,
        Math.random() * strength * 2 - strength,
        Math.random() * strength * 2 - strength
    ]),normal));
    
}