const can = document.getElementById("can");
const ctx = can.getContext("2d");
let size = {
    x: 500,
    y: 500
};

let divisions, divisionSize, ds, coords;

let idata;
let stop = false;
let count = 1;
//enums
//rendering order
const MIDDLE_OUT = 1;
const RANDOM = 2;
const TOP_TO_BOTTOM = 3;
const BOTTOM_TO_TOP = 4;
const RENDER_ORDER = BOTTOM_TO_TOP;

//lighting
const PHONG = true;
const EMISSIVE = true;

let e = .005;