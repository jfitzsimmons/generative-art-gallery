import {ctx,h,w} from '../utils/canvas.js';
import {rndmRng,shuffle} from '../utils/helpers.js';

let dabR = w*.02
let x = 0, y = 0, count = 0;
let hues = [], sats = [], lits = [], dabArr = [];

function dabDraw(x,y) {
    let inY = Math.round(y + rndmRng(0, dabR*-1));
    let dabH = rndmRng(h*.35,h*.2) ;
    let hue = Math.round(rndmRng(hues[1],hues[0]));
    let sat = Math.round(rndmRng(sats[1],sats[0]));
    let lit = Math.round(rndmRng(lits[1],lits[0]));
    let satS = (sat-60 < 0) ? 0 : sat-60;
    let litS = (lit-60 < 0) ? 0 : lit-60;
    let dabRS = Math.round(dabR * rndmRng(1.07,1.03));

    ctx.beginPath();
    let gradient = ctx.createLinearGradient(x,inY,x,inY+dabH);
    gradient.addColorStop(0, `hsla(60, 60%, 2%, .5)`);
    gradient.addColorStop(.2, `hsla(${hue}, ${satS}%, ${litS}%, 0)`);

    ctx.arc(Math.round(x), Math.round(inY), dabRS, 0, Math.PI, true);
    ctx.lineTo(Math.round(x-dabR*.95),Math.round(inY+dabH*.9));
    ctx.lineTo(Math.round(x+dabR*.95),Math.round(inY+dabH*.9));
    ctx.lineTo(Math.round(x+dabRS),inY);
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

    ctx.arc(Math.round(x+(source.x/5)), Math.round(inY+(source.y/3)), dabRS, 0, Math.PI, true);
    ctx.lineTo(Math.round(x-dabR*.95),Math.round(inY+dabH*.9));
    ctx.lineTo(Math.round(x+dabR*.95),Math.round(inY+dabH*.9));
    ctx.lineTo(Math.round(x+(source.x/5)+dabRS),inY);
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
    gradient.addColorStop(0, `hsla(60, 60%, ${98-(100-lit)*.2}%, ${source.b})`);
    gradient.addColorStop(.5, `hsla(60, 60%, 98%, ${rndmRng(.1,.01)})`);
    gradient.addColorStop(.9, `hsla(60, 60%, 98%, 0)`);

    ctx.shadowColor="hsla(60, 40%, 15%, 0.4)";
    ctx.shadowBlur=9;
    ctx.shadowOffsetX = source.x/3;
    ctx.shadowOffsety = source.y/2;

    ctx.fillStyle = gradient;
    ctx.fillRect(x-dabR, inY-dabR, Math.round(dabR*2), Math.round(dabR*2));

    ctx.shadowBlur=0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsety = 0;
}

export function loadDabs() {
    const spread = rndmRng(.4,.1);
    dabArr = [];
    x = Math.round(rndmRng(-1, dabR*-2));
    y = Math.round(rndmRng(dabR, dabR*-3));
    hues = [Math.round(rndmRng(360,0)),Math.round(rndmRng(360,0))].sort();
    sats = [Math.round(rndmRng(100,10)),Math.round(rndmRng(100,10))].sort();
    lits = [Math.round(rndmRng(90,10)),Math.round(rndmRng(90,10))].sort();
    count=0;

    ctx.fillStyle=`hsla(${Math.round((hues[0]+hues[1])/2)}, ${100-(100-Math.round((sats[0]+sats[1])/2))}%, ${100-(100-Math.round((lits[0]+lits[1])/2))}%, 1)`;
    ctx.fillRect(0,0,w,h);

    while (y<h+dabR) {
        let tempDabArr =[];
        while (x<w+dabR) {
            dabR = Math.round(rndmRng(w*.023,w*.017))
            tempDabArr.push({x,y});
            x+= Math.round(rndmRng(dabR*(2+spread), dabR*(2-spread)));
        }
        dabArr.push.apply(dabArr, shuffle(tempDabArr));
        count++;
        x = (count % 2 === 0) ? 0 : 0-dabR;
        y+=Math.round(dabR*2.1);
    }

    dabArr.forEach((d) => {
        dabDraw(Math.round(d.x),d.y);
    })
}