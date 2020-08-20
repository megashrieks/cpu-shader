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

const setup = () => {
    ctx.clearRect(0, 0, can.width, can.height);
    idata = ctx.getImageData(can.width / 2 - size / 2, can.height / 2 - size / 2, size, size);
}
const setColor = (arr, index, func) => {
    let actual = index / 4;
    const res = func((~~(actual / size) - size/2)/size, ((actual % size)-size/2)/size);
    arr[index] = Math.max(Math.min(res[0]*255,255),0);
    arr[index + 1] = Math.max(Math.min(res[1] * 255, 255), 0);
    arr[index + 2] = Math.max(Math.min(res[2] * 255, 255), 0);
    arr[index + 3] = 255;
}

const draw = () => {
    for (let i = 0; i < idata.data.length; i += 4){
        setColor(idata.data, i, shader);
    }
    console.log(idata.data.length / size, (idata.data.length-1)%size);
    ctx.putImageData(idata, can.width / 2 - size / 2, can.height / 2 - size / 2);
    // ctx.strokeStyle = "rgb(150,150,150)";
    // ctx.lineWidth = 3;
    // ctx.strokeRect(can.width / 2 - size / 2 - 1, can.height / 2 - size / 2 - 1, size + 2, size + 2);
}
resize();
setup();
draw();
