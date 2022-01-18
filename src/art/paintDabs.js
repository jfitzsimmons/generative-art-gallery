import {canvas,ctx,h,w,resetCanvas} from '../utils/canvas.js';
import {rndmRng,shuffle} from '../utils/helpers.js';

let dabR = w*.02
let x = rndmRng(-1, dabR*-1);
let y = rndmRng(-1, dabR*-1);
let hues = [Math.round(rndmRng(360,0)),Math.round(rndmRng(360,0))].sort();
let sats = [Math.round(rndmRng(100,10)),Math.round(rndmRng(100,10))].sort();
let lits = [Math.round(rndmRng(90,10)),Math.round(rndmRng(90,10))].sort();
let count=0;

function dabDraw(x,y) {
    let inY = y + rndmRng(0, dabR*-1);
    let dabH = rndmRng(h*.3,h*.15) ;
    let hue = Math.round(rndmRng(hues[1],hues[0]));
    let sat = Math.round(rndmRng(sats[1],sats[0]));
    let lit = Math.round(rndmRng(lits[1],lits[0]));
    let satS = (sat-60 < 0) ? 0 : sat-60;
    let litS = (lit-60 < 0) ? 0 : lit-60;
    let dabRS = dabR * rndmRng(1.07,1.03);

    ctx.beginPath();
    let gradient = ctx.createLinearGradient(x,inY,x,inY+dabH);
    gradient.addColorStop(0, `hsla(60, 60%, 2%, .5)`);
    gradient.addColorStop(.2, `hsla(${hue}, ${satS}%, ${litS}%, 0)`);

    ctx.arc(x, inY, dabRS, 0, Math.PI, true);
    ctx.lineTo(x-dabR*.95,inY+dabH*.9);
    ctx.lineTo(x+dabR*.95,inY+dabH*.9);
    ctx.lineTo(x+dabRS,inY);
    ctx.fillStyle = gradient;
    ctx.fill();

    let source = {
        x: rndmRng(dabR*.65,dabR*-.65),
        y: rndmRng(dabR*.35,dabR*-.35),
        b: rndmRng(.4,.1),
    }

    ctx.beginPath();
    gradient = ctx.createLinearGradient(x,inY,x,inY+dabH);
    gradient.addColorStop(0, `hsla(60, 60%, 2%, ${.41-source.b})`);
    gradient.addColorStop(.3, `hsla(${hue}, ${satS}%, ${litS}%, 0)`);

    ctx.arc(x+(source.x/5), inY+(source.y/3), dabRS, 0, Math.PI, true);
    ctx.lineTo(x-dabR*.95,inY+dabH*.9);
    ctx.lineTo(x+dabR*.95,inY+dabH*.9);
    ctx.lineTo(x+(source.x/5)+dabRS,inY);
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.beginPath();
    gradient = ctx.createLinearGradient(x,inY,x,inY+dabH);
    gradient.addColorStop(.4, `hsla(${hue}, ${sat}%, ${lit}%, 1)`);
    gradient.addColorStop(1, `hsla(${hue}, ${sat}%, ${lit}%, 0)`);

    ctx.arc(x, inY, dabR, 0, Math.PI, true);
    ctx.lineTo(x-dabR,inY+dabH);
    ctx.lineTo(x+dabR,inY+dabH);
    ctx.lineTo(x+dabR,inY);
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.beginPath();
    gradient = ctx.createRadialGradient(x+source.x, inY+source.y, dabR/rndmRng(21,9), x, inY, dabR*.9)
    gradient.addColorStop(0, `hsla(60, 60%, 98%, ${source.b})`);
    gradient.addColorStop(.5, `hsla(60, 60%, 98%, ${rndmRng(.1,.01)})`);
    gradient.addColorStop(.9, `hsla(60, 60%, 98%, 0)`);

    ctx.fillStyle = gradient;
    ctx.fillRect(x-dabR, inY-dabR, dabR*2, dabR*2);
}

let dabArr = [];

export function loadDabs() {
    resetCanvas();

    dabArr = [];
    x = rndmRng(-1, dabR*-1);
    y = rndmRng(-1, dabR*-1);
    hues = [Math.round(rndmRng(360,0)),Math.round(rndmRng(360,0))].sort();
    sats = [Math.round(rndmRng(100,10)),Math.round(rndmRng(100,10))].sort();
    lits = [Math.round(rndmRng(90,10)),Math.round(rndmRng(90,10))].sort();
    count=0;

    while (y<h+dabR) {
        let tempDabArr =[];
        while (x<w+dabR) {
            tempDabArr.push({x,y});
            x+= rndmRng(dabR*2.2, dabR*1.8);
        }
        dabArr.push.apply(dabArr, shuffle(tempDabArr));
        count++;
        x = (count % 2 === 0) ? 0 : 0-dabR;
        y+=dabR*2;
    }

    dabArr.forEach((d) => {
        dabDraw(d.x,d.y);
    })

    canvas.style.transform = (Math.random() > .5) ? "rotate(180deg)" : "rotate(360deg)"
}

