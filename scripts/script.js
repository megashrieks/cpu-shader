const can = document.getElementById("can");
const ctx = can.getContext("2d");
let size = 500;
let idata;
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
    coords = [];
    for (let x = 0; x < divisions; ++x)
        for (let y = 0; y < divisions; ++y)
            coords.push([x, y]);
    for (let i = 0; i < coords.length; ++i){
        let temp = coords[i];
        let rand = ~~(Math.random() * coords.length);
        coords[i] = coords[rand];
        coords[rand] = temp;
    }
}
const setColor = (arr, index, func,x,y) => {
    // let actual = offset + index / 4;
    const res = func((x / size), 1-~~y / size);
    arr[index] = Math.max(Math.min(res[0]*255,255),0);
    arr[index + 1] = Math.max(Math.min(res[1] * 255, 255), 0);
    arr[index + 2] = Math.max(Math.min(res[2] * 255, 255), 0);
    arr[index + 3] = 255;
}

let getChunk = (divisionSize, x, y) => {
    return ctx.getImageData(can.width / 2 - size / 2 + divisionSize*x, can.height / 2 - size / 2 + divisionSize *y, divisionSize,divisionSize);
}
let putChunk = (divisionSize, x, y,data) => {
    ctx.putImageData(data, can.width / 2 - size / 2 + divisionSize * x, can.height / 2 - size / 2 + divisionSize * y);
}
//so I can stop through console
let stop = false;
const draw = async () => {
    let func = () => {
        if (!coords.length) return;
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
