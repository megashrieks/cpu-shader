let color = [];
let ob = [];
let alpha = [];
let lights = [];
let materials = [];
let makeSphere = (v, col, radius, a = .65) => {
    materials.push(1);
    alpha.push(a);
    color.push(col);
    ob.push(vv => len(vv[0] - v[0], vv[1] - v[1], vv[2] - v[2]) - radius);
}
let abs = Math.abs;
let max = Math.max;
let min = Math.min;
let makePlane = (side,axis,direction, c) => {
    materials.push(2);
    alpha.push(1);
    color.push(c);
    ob.push(vv => direction*vv[axis] + side);
}
let makeLight = (pos,color,radius=1) => {
    lights.push(pos);
    makeSphere(pos, color, radius, 1);
    materials[materials.length - 1] = 3;
}
let makeBox = (b,pos,col) => {
    color.push(col);
    alpha.push(1);
    materials.push(4);
    ob.push(vv => {
        let q = [abs(vv[0]+pos[0]) - b, abs(vv[1]+pos[1]) - b, abs(vv[2]+pos[2]) - b];
        let t = min(max(q[0], max(q[1], q[2])), 0);
        return len(
            max(q[0], 0),
            max(q[1], 0),
            max(q[2], 0)
        )+t;
    });
}
let e = .01;
makePlane(3, 1, 1, [.8, .8, .8]);
makePlane(3, 1, -1,[.8, .8, .8]);
makePlane(3, 0,  1,[0, .8, 0]);
makePlane(3, 0, -1,[.8, 0, 0]);
makePlane(5, 2, -1, [.8, .8, .8]);
makePlane(8, 2, 1, [.3,.3,.3]);
makeSphere([-1.5, -2, 2], [0, 1, 1], 1,1);
makeSphere([0, -2, 1], [1, 1, 0], 1,1);
// makeLight([-2, 1, 2], [1, 1, 1], .3);
makeLight([2, 2, 2], [1,1,1],.3);
makeBox(.5,[-2,2,0],[1,1,1]);


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
        // else if (mind < 0.01) return [d, color[index], index];
    }
    return [res,color[index],index];
}


function rayCast(pos, dir,depth) {
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
        if (d > 100) break;
    }
    if (minv < .01) {
        let reflectedColor = co;
        let normal = getnormal(c, ob[index]);
        if (depth > 0 ) {
            const times = 1;
            let ref = [0, 0, 0];
            let offset = [pos[0] + (d - e) * dir[0], pos[1] + (d - e) * dir[1], pos[2] + (d - e) * dir[2]];
            let strength = 0//.15;
            for (let i = 0; i < times; ++i){
                let nn = [...normal];
                nn[0] += strength * Math.random();
                nn[1] += strength * Math.random();
                nn[2] += strength * Math.random(); 
                let [__, rr,_] = rayCast(offset, nn, depth - 1);
                ref[0] += rr[0];
                ref[1] += rr[1];
                ref[2] += rr[2];
            }
            ref[0] /= times;
            ref[1] /= times;
            ref[2] /= times;
            reflectedColor = ref;
        }
        let materialColor = [
            co[0] * alpha[index] + (1 - alpha[index]) * reflectedColor[0],
            co[1] * alpha[index] + (1 - alpha[index]) * reflectedColor[1],
            co[2] * alpha[index] + (1 - alpha[index]) * reflectedColor[2],
        ];
        if (depth > 0 && materials[index] != 3) {
            let specStrength = .25;
            let diffuse = 0;
            let diffuseColor = [0, 0, 0];
            let specular = 0;
            let specularColor = [0, 0, 0];
            let ambient = 0.1;
            let shade = 0;
            let point = [pos[0] + (d - e) * dir[0], pos[1] + (d - e) * dir[1], pos[2] + (d - e) * dir[2]];
            let viewDir = mulscalar(dir, -1);
            let total = 150;
            let strength = .13;
            for (let i in lights) {
                for (let j = 0; j < total; ++j) {
                    let dx = Math.random() * strength - strength;
                    let dy = Math.random() * strength - strength;
                    let dz = Math.random() * strength - strength;
                    let lightDirection = normalize([-point[0] + lights[i][0], -point[1] + lights[i][1], -point[2] + lights[i][2]]);
                    lightDirection = normalize(addvector(lightDirection, [dx, dy, dz]));
                    let [_, lightColor, mat] = shadow(point, lightDirection);//rayCast(point, lightDirection, 0);
                    if (mat == -1 || materials[mat] == 3) {
                        let currentDiffuse = min(max(dot(lightDirection, normal), 0), 1)/total;
                        diffuse += currentDiffuse;
                        diffuseColor = addvector(diffuseColor, mulscalar(lightColor, currentDiffuse))
                        let reflectDir = reflect(mulscalar(lightDirection, -1), normal);
                        let currentSpecular = (max(dot(viewDir, reflectDir), 0) ** 32) * specStrength / total;
                        specular += currentSpecular;
                        specularColor = addvector(specularColor, mulscalar(lightColor, currentSpecular));
                    } else shade += _;
                }
            }
            let ambientColor = mulscalar(materialColor, ambient);
            let totalLight = addvector(ambientColor, addvector(diffuseColor, specularColor));
            materialColor = mulvector(materialColor, totalLight);
        }
        return [d, materialColor,index];
    }
    let closest = mulscalar(color[index], ob[index](c));
    return [d, res,-1];
}

const shader = (x, y) => {
    // return 1;
    let v = [x-.5, y-.5, 1]
    let [t,c] = rayCast([0,0, -7], normalize(v),1);
    t = 1/(1+t*.1)
    t = 1;
    const gamma = 1/2.2;
    // return [t,t,t];
    return [(c[0] * t) ** gamma, (c[1] * t) ** gamma, (c[2] * t) ** gamma];
}
// let dir = [-2]

console.log(shadow)