const can = document.getElementById("can");
const ctx = can.getContext("2d");
let size = {
    x: 500,
    y: 500
};
let idata;
let count = 0;
const resize = () => {
    can.width = window.innerWidth;
    can.height = window.innerHeight;
}
window.onresize = resize();
let divisions, divisionSize, ds, coords;
//enums
//rendering order
const MIDDLE_OUT = 1;
const RANDOM = 2;
const TOP_TO_BOTTOM = 3;
const RENDER_ORDER = MIDDLE_OUT;

const setup = () => {
    size = {
        x: can.width,
        y: can.height
    }
    // size.x = size.y = Math.min(can.width, can.height)
    ctx.clearRect(0, 0, can.width, can.height);
    divisions = { x: 20, y: 20 }//{ x: size.x ** .5, y: size.y ** .5 };
    divisions.x = divisions.y = size.x ** .5
    divisionSize = {
        x: size.x / divisions.x,
        y: size.y / divisions.y
    };
    ds = {
        x: Math.ceil(divisionSize.x),
        y: Math.ceil(divisionSize.y)
    }
    setcoords();
}
const setcoords = () => {
    coords = [];
    for (let y = 0; y < divisions.y; ++y)
        for (let x = 0; x < divisions.x; ++x)
            coords.push([x, y]);
    switch (RENDER_ORDER) {
        case MIDDLE_OUT:
            let tempcoords = [];
            for (let i = 0; coords.length; ++i) {
                let tlen = Math.min(5, Math.ceil(coords.length / 2));
                tempcoords.push(...coords.splice(coords.length / 2 - tlen, tlen * 2));
            }
            coords = tempcoords.reverse();
            break;
        case RANDOM:
            for (let i = 0; i < coords.length; ++i) {
                let temp = coords[i];
                let rand = ~~(Math.random() * coords.length);
                coords[i] = coords[rand];
                coords[rand] = temp;
            }
            break;
        case TOP_TO_BOTTOM:
            coords = coords.reverse();
        default:
    }
}
const setColor = (arr, index, func, x, y) => {
    // let actual = offset + index / 4;
    const res = func(x / size.x, 1 - ~~y / size.y);
    res[0] = Math.max(Math.min(res[0] * 255, 255), 0);
    res[1] = Math.max(Math.min(res[1] * 255, 255), 0);
    res[2] = Math.max(Math.min(res[2] * 255, 255), 0);
    if (!count) {
        arr[index] = res[0]
        arr[index + 1] = res[1];
        arr[index + 2] = res[2];
        arr[index + 3] = 255;
    } else {
        arr[index] = (arr[index] * (count - 1) + res[0]) / count;
        arr[index + 1] = (arr[index + 1] * (count - 1) + res[1]) / count;
        arr[index + 2] = (arr[index + 2] * (count - 1) + res[2]) / count;
        arr[index + 3] = 255;
    }
}

let getChunk = (divisionSize, x, y) => ctx.getImageData(can.width / 2 - size.x / 2 + divisionSize.x * x, can.height / 2 - size.y / 2 + divisionSize.y * y, divisionSize.x, divisionSize.y);
let putChunk = (divisionSize, x, y, data) => {
    ctx.putImageData(data, can.width / 2 - size.x / 2 + divisionSize.x * x, can.height / 2 - size.y / 2 + divisionSize.y * y);
}
//so I can stop through console
let stop = false;
const draw = () => {
    let func = () => {
        if (!coords.length) { console.log(++count); stop = true; setcoords(); draw(); }
        let [x, y] = coords.pop();
        let idata = getChunk(ds, x, y);
        for (let i = 0; i < idata.data.length; i += 4) {
            setColor(idata.data, i, shader, x * ds.x + (i / 4) % ds.x, y * ds.y + (i / 4) / ds.y);
            if (stop) return;
        }
        putChunk(ds, x, y, idata);
        setTimeout(() => func(), 0)
    }
    setTimeout(() => func(0, 0), 0);
}
resize();
setup();
draw();
