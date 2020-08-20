const shader = (x, y) => {
    let radius = .2 ** 2;
    let r2 = .19 ** 2;
    let current = len(x,y);
    let v = smoothstep(radius, radius + .001, current);
    return [v + smoothstep(r2 + .001, r2, current),v,v];
}

const len = (x, y) => x ** 2 + y ** 2;

const smoothstep = (lower, upper,val) => {
    let x = clamp((val - lower) / (upper - lower), 0, 1);
    return x * x * (3 - 2 * x);
}

const clamp = (val, lower, upper) => {
    return Math.min(Math.max(val,lower),upper)
}