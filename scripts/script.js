const can = document.getElementById("can");
const ctx = can.getContext("2d");
let size = 500;
let idata;
let count = 0;
const resize = () => {
    can.width = window.innerWidth;
    can.height = window.innerHeight;
    size = Math.min(can.width, can.height);
}
window.onresize = resize();
let divisions, divisionSize, ds, coords;
const setup = () => {
    ctx.clearRect(0, 0, can.width, can.height);

    divisions = size**.5;
    divisionSize = size / divisions;
    ds = Math.ceil(divisionSize);
    setcoords();
}
const setcoords = () => {
    coords = [];
    for (let x = 0; x < divisions; ++x)
        for (let y = 0; y < divisions; ++y)
            coords.push([x, y]);
    for (let i = 0; i < coords.length; ++i) {
        let temp = coords[i];
        let rand = ~~(Math.random() * coords.length);
        coords[i] = coords[rand];
        coords[rand] = temp;
    }
}
const setColor = (arr, index, func,x,y) => {
    // let actual = offset + index / 4;
    const res = func((x / size), 1 - ~~y / size);
    res[0] = Math.max(Math.min(res[0] * 255, 255), 0);
    res[1] = Math.max(Math.min(res[1] * 255, 255), 0);
    res[2] = Math.max(Math.min(res[2] * 255, 255), 0);
    if (!count) {
        arr[index] = res[0]
        arr[index + 1] = res[1];
        arr[index + 2] = res[2];
        arr[index + 3] = 255;
    } else {
        arr[index] = (arr[index]*(count-1) + res[0]) / count;
        arr[index + 1] = (arr[index+1]*(count-1) + res[1]) / count;
        arr[index + 2] = (arr[index+2]*(count-1) + res[2]) / count;
        arr[index + 3] = 255;
    }
}

let getChunk = (divisionSize, x, y) =>  ctx.getImageData(can.width / 2 - size / 2 + divisionSize*x, can.height / 2 - size / 2 + divisionSize *y, divisionSize,divisionSize);
let putChunk = (divisionSize, x, y,data) => {
    ctx.putImageData(data, can.width / 2 - size / 2 + divisionSize * x, can.height / 2 - size / 2 + divisionSize * y);
}
//so I can stop through console
let stop = false;
const draw = () => {
    let func = () => {
        if (!coords.length) { console.log(++count); setcoords(); draw();}
        let [x, y] = coords.pop();
        let idata = getChunk(ds, x, y);
        for (let i = 0; i < idata.data.length; i += 4) {
            setColor(idata.data, i, shader, x * ds + (i / 4) % ds, y * ds + (i / 4) / ds);
            if (stop) return;
        }
        putChunk(ds, x, y, idata);
        setTimeout(()=>func(),0)
    }
    setTimeout(() => func(0, 0), 0);
}
resize();
setup();
draw();
