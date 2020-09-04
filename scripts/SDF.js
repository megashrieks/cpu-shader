let makePlane = (side, axis, direction, c) => {
    materials.push(2);
    alpha.push(1);
    color.push(c);
    ob.push(vv => direction * vv[axis] + side);
}
let makeLight = (pos, color, radius = 1, sdf) => {
    lights.push(pos);
    if (!sdf)
        makeSphere(pos, color, radius, 1);
    else sdf();
    materials[materials.length - 1] = 3;
    alpha[alpha.length - 1] = 1;
}
let makeBox = (b, pos, col, theta = 0, alp = .9) => {
    color.push(col);
    alpha.push(alp);
    materials.push(4);
    let ct = Math.cos(theta);
    let st = Math.sin(theta);
    ob.push(vv => {
        vv = [vv[0] - pos[0], vv[1] - pos[1], vv[2] - pos[2]];
        let pp = [...vv];
        pp[0] = vv[0] * ct + vv[2] * st;
        pp[2] = -vv[0] * st + vv[2] * ct;
        vv = [pp[0] + pos[0], pp[1] + pos[1], pp[2] + pos[2]]
        let q = [abs(vv[0] - pos[0]) - b[0], abs(vv[1] - pos[1]) - b[1], abs(vv[2] - pos[2]) - b[2]];
        // let q = [pp[0] - b[0], pp[1] - b[1], pp[2] - b[2]];
        let t = min(max(q[0], max(q[1], q[2])), 0);
        return len(
            max(q[0], 0),
            max(q[1], 0),
            max(q[2], 0)
        ) + t;
    });
}

let makeSphere = (v, col, radius, a = .65) => {
    materials.push(1);
    alpha.push(a);
    color.push(col);
    ob.push(vv => len(vv[0] - v[0], vv[1] - v[1], vv[2] - v[2]) - radius);
}