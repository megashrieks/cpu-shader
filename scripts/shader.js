let color = [];
let ob = [];
let alpha = [];
let lights = [];
let materials = [];
// noise.seed(Math.random())


function shadow(ro, rd) {
    const K = 2;
    let d = 0;
    let res = 1;
    let index = -1;
    for (let i = 0; i < 50; ++i){
        let c = addvector(ro, mulscalar(rd, d));
        let mind = Infinity;
        for (let j = 0; j < ob.length; ++j){
            let ds = ob[j](c);
            if (ds < mind) {
                mind = ds;
                index = j;
            }
        }
        if (materials[index] == 3) {
            res = min(res, K * mind / d);
        }
        d += mind;
        if (mind < 0.001) return [0, color[index], index];
    }
    return [res,color[index],index];
}

function rayCast(pos, dir, depth) {
    // if(depth == 0) return [0,[0,0,0],Infinity]
    let d = 0;
    let res = [.2, .4, .6];
    let minv, tmin, co,index,c;
    for (let i = 0; i < 100; ++i) {
        minv = Infinity;
        c = [pos[0] + d * dir[0], pos[1] + d * dir[1], pos[2] + d * dir[2]];
        for (let j = 0; j < ob.length; ++j) {
            tmin = ob[j](c);
            if (tmin < minv) {
                minv = tmin;
                index = j;
                co = [...color[j]];
            }
        }
        // if(minv == Infinity) console.log(pos,dir,c,d,minv,tmin)
        d += minv;
        if (d > 20 || minv <= 0.001) break;
    }
    if (minv < .1 && depth != 0) {
        let materialColor = co;
        let normal = getnormal(c, ob[index]);
        // let materialColor = [
        //     co[0] * alpha[index] + (1 - alpha[index]) * reflectedColor[0],
        //     co[1] * alpha[index] + (1 - alpha[index]) * reflectedColor[1],
        //     co[2] * alpha[index] + (1 - alpha[index]) * reflectedColor[2],
        // ];
        if(materials[index] != 3)
            materialColor = calculateLight(pos, d, dir, normal, index,depth);
        return [d, materialColor,index];
    }
    let closest = mulscalar(color[index], ob[index](c));
    return [d, closest,-1];
}

const shader = (x, y) => {
    let v = [x - .5, y - .5, 1];
    v[0] *= size.x / size.y
    let col = [0, 0, 0];
    let times = 1;
    let strength = 200;
    for (let i = 0; i < times; ++i) {
        v[0] += (Math.random() - .5) / strength;
        v[1] += (Math.random() - .5) / strength;
        let [t, c] = rayCast([0, 0, -5], normalize(v), 3);
        col = addvector(col, c);
    }
    col = mulscalar(col, 1 / times);
    c = col;
    // t = 1/(1+t*.1)
    let t = 1;
    const gamma = 1/2.2;
    // return [t,t,t];
    return [(c[0] * t) ** gamma, (c[1] * t) ** gamma, (c[2] * t) ** gamma];
}