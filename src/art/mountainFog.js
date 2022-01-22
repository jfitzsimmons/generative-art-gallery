import {ctx,h,w} from '../utils/canvas.js'
import { rndmRng } from '../utils/helpers.js';

let hmod = 0.4;
let baseHue = 0;
let mtnColors = [], fogColors = [];

function createFog(i) {
    let lingrad = ctx.createLinearGradient(w,(h*hmod),w,h);
    lingrad.addColorStop(0, fogColors[i][0]);
    lingrad.addColorStop(1, fogColors[i][1]);
    ctx.fillStyle=lingrad;
    var x = 0;
    var y =  h*(hmod+0.12);
    ctx.moveTo(0,y);
    while (x < w) {
        let prevX = x;
        x = cragX(x);
        y = cragY(y);
        ctx.arc(x,y,x-prevX,0,Math.PI,true);
    }
    endPath(ctx,w,h);
}

function createMtn(i) {
    let lingrad = ctx.createLinearGradient(0,h*(hmod+(0.09)),w*.5,h*1.1);
    lingrad.addColorStop(0, mtnColors[i][0]);
    lingrad.addColorStop(1, mtnColors[i][1]);
    ctx.fillStyle=lingrad;
    let x = 0;
    let y = h*hmod;
    ctx.moveTo(0,y);

    while (x < w) {
        x = cragX(x);
        y = cragY(y);
        ctx.lineTo(x,y);
    }
    endPath(ctx,w,h);
}

function endPath(ctx,w,h) {
    ctx.lineTo(w,h);
    ctx.lineTo(0,h);
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
}

function cragY(py) {
    return py + (Math.floor(Math.random() * 24) + -12); 
}
function cragX(px) {
    return px + (Math.floor(Math.random() * 10) + 1); 
}

export function loadMountain() {
    baseHue = Math.round(rndmRng(360,0));
    mtnColors = [
        [`hsla(${baseHue-40}, 19%, 76%, 1)`,
        `hsla(${baseHue-40}, 43%, 89%, 1)`],
        [`hsla(${baseHue-21}, 13%, 57%, 1)`,
        `hsla(${baseHue-25}, 17%, 70%, 1)`],
        [`hsla(${baseHue-12}, 14%, 46%, 1)`,
        `hsla(${baseHue-12}, 16%, 59%, 1)`],
        [`hsla(${baseHue-13}, 25%, 29%, 1)`,
        `hsla(${baseHue-13}, 17%, 42%, 1)`],
        [`hsla(${baseHue-16}, 37%, 20%, 1)`,
        `hsla(${baseHue-14}, 22%, 32%, 1)`],
        [`hsla(${baseHue-13}, 82%, 11%, 1)`,
        `hsla(${baseHue-13}, 37%, 24%, 1)`]
    ];
    fogColors = [
        [`hsla(${baseHue-210}, 100%, 100%, 0.1)`,
        `hsla(${baseHue-210}, 100%, 100%, 0.2)`],
        [`hsla(${baseHue-12}, 16%, 75%, 0.1)`,
        `hsla(${baseHue}, 100%, 98%, 0.1)`],
        [`hsla(${baseHue-14}, 17%, 75%, 0.1)`,
        `hsla(${baseHue-30}, 33%, 94%, 0.1)`],
        [`hsla(${baseHue-15}, 22%, 75%, 0.05)`,
        `hsla(${baseHue-30}, 25%, 92%, 0.05)`],
        [`hsla(${baseHue-12}, 37%, 75%, 0.05)`,
        `hsla(${baseHue-210}, 100%, 100%, 0.05)`]
    ]
    hmod = 0.4;
    ctx.fillStyle="#FEF9EB";
    ctx.fillRect(0,0,w,h);
    
    for (let i = 0; i < 6; i++) {
        createMtn(i);
        (i<5) && createFog(i);
        hmod += 0.1;
    }
}