import {ctx,h,w} from '../utils/canvas.js';
import {rndmRng} from '../utils/helpers.js';

let t = h*rndmRng(.75,.5);
let sunX = 0;
let sunW = 0;

function sunset() { 
    let gradient = ctx.createLinearGradient(w*rndmRng(.53,.5),t*rndmRng(.2,.1), w*rndmRng(.5,.47),t*rndmRng(1,.8));
    
    gradient.addColorStop(0, '#30497A');
    gradient.addColorStop(rndmRng(.3,.05), '#38778F');
    gradient.addColorStop(rndmRng(.6,.35), '#3A8B9E');
    gradient.addColorStop(rndmRng(.95,.65), '#42B7B3');
    gradient.addColorStop(1, '#41CFC1');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, t);
}

function sun() {
    sunX = rndmRng(w*.75,w*.25);
    sunW = rndmRng(w*.15,w*.05);
    let gradient = ctx.createLinearGradient(w*.5,rndmRng(t*.8,t*.4), w*.5,t);
    gradient.addColorStop(0, '#FDD1B8');
    gradient.addColorStop(1, '#FFE8B8');
    ctx.beginPath();
    ctx.arc(sunX, t, sunW, 0, Math.PI * 2, true);
    ctx.fillStyle = gradient;
    ctx.fill();
}

function cloudWisps(loops) { 
    for (let i = loops; i--;) {
        let x = rndmRng(w,-100);
        let y = rndmRng(10,-100);
        let line = 100; 
        let increase = true;

        while (y<t) {
            ctx.lineWidth = rndmRng(4,1);
            ctx.moveTo(x,y);
            ctx.lineTo(x+line,y);

            if (y < t*rndmRng(.35,.15)) { 
                ctx.strokeStyle = `rgba(164, 86, 107, ${rndmRng(.2,.1)})`;
            } else if (y < t*rndmRng(.6,.4)) { 
                ctx.strokeStyle = `rgba(174, 111, 116, ${rndmRng(.2,.1)})`;
            } else if (y < t*rndmRng(.85,.65)) { 
                ctx.strokeStyle = `rgba(207, 160, 119, ${rndmRng(.2,.1)})`;
            } else { 
                ctx.strokeStyle = `rgba(237, 210, 135, ${rndmRng(.2,.1)})`;
            }

            if (x < -line*2 || x > w-line/4 || line < 20) {
                x = rndmRng(w,-100);
                line = 100;
                increase = true;
            }

            if (line > w*.33 && increase === true) {
                increase = false;
            }

            ctx.stroke();
            ctx.beginPath(); 
            line = (increase === true) ? line + rndmRng(100,1) : line - rndmRng(100,1);
            x = x + rndmRng(line/3,-line/3);
            y+=rndmRng(4,2)
        }
    }
}

function ocean() {
    let gradient = ctx.createLinearGradient(w*.5,t, w*.5,h);       
        gradient.addColorStop(0, 'rgba(64, 167, 186, 1)');
        gradient.addColorStop(rndmRng(.02,.07), 'rgba(73, 206, 187, 1)');
        gradient.addColorStop(rndmRng(.12,.08), 'rgba(59, 162, 181, 1)');
        gradient.addColorStop(rndmRng(.17,.13), 'rgba(68, 201, 182, 1)');
        gradient.addColorStop(rndmRng(.29,.19), 'rgba(54, 157, 176, 1)');
        gradient.addColorStop(rndmRng(.39,.31), 'rgba(63, 196, 177, 1)');
        gradient.addColorStop(rndmRng(.49,.41), 'rgba(49, 152, 171, 1)');
        gradient.addColorStop(rndmRng(.59,.51), 'rgba(58, 191, 172, 1)');
        gradient.addColorStop(rndmRng(.79,.61), 'rgba(44, 147, 166, 1)');
        gradient.addColorStop(rndmRng(.95,.81), 'rgba(53, 186, 167, 1)');
        gradient.addColorStop(1, 'rgba(39, 142, 161, 1)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, t, w, h);
}

function waves() {
    let wvs = t;

    while(wvs < h) {
        ctx.fillStyle = `rgba(${rndmRng(30,100)}, ${rndmRng(215,145)}, ${rndmRng(225,185)}, ${rndmRng(.4,.15)})`;
        ctx.beginPath();
        let counter = 0, x=-100;

        let height = rndmRng(12,4);
        let increase = 90/180*Math.PI / rndmRng(25,8);
        let y=wvs;
        
        for(let i=0; i<=w+100; i+=10){
            x = i;
            y =  wvs - Math.sin(counter) * height;
            counter += increase;
            ctx.lineTo(x,y);
        }
        
        height = rndmRng(12,4);
        increase = 90/180*Math.PI / rndmRng(25,8);
        y+= 100;

        for(let i=w+100; i>=-100; i-=10){
            x = i;
            y =  wvs - Math.sin(counter) * height + 10;
            counter += increase;
            ctx.lineTo(x,y);
        }

        ctx.lineTo(x,y-height);
        ctx.closePath();
        ctx.fill();

        wvs+=16;
    }
}

function sunReflection() {
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#FDF7AD";
    let chunk = rndmRng(100,30);
    let count = 0;
    let increment = 0;
    let m = 2;            
    let y = t;
    let x = sunX-sunW
    ctx.beginPath();
    ctx.moveTo(x,y);

    while (y<h) {
        var gradient = ctx.createLinearGradient(sunX,y,sunX,y+chunk);
        ctx.fillStyle = gradient;
        gradient.addColorStop(0, `rgba(253, 247, 173, ${m-1.2})`);
        gradient.addColorStop(.5, `rgba(252, 231, 186, ${m-1.2})`);
        gradient.addColorStop(1, `rgba(253, 247, 173, ${m-1.2})`);
        
        while (count < chunk) {
            increment = rndmRng(5,16);
            y+=increment;
            count+=increment;
            ctx.lineTo(x-rndmRng(sunW*m,sunW/2),y);
            increment = rndmRng(5,16);
            y+=increment;
            count+=increment;
            ctx.lineTo(x+rndmRng(sunW*m,sunW/2),y);
            x-=5;
        }

        x = sunX+sunW;

        while (count > 0+increment) {
            increment = rndmRng(5,16);
            y-=increment;
            count-=increment;
            ctx.lineTo(x+rndmRng(sunW*m,sunW/2),y);
            increment = rndmRng(5,16);
            y-=increment;
            count-=increment;
            ctx.lineTo(x-rndmRng(sunW*m,sunW/2),y);
            x+=5;
        }

        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        y+=chunk;
        x = sunX-sunW
        ctx.moveTo(x,y);
        chunk = rndmRng(100,30);
        count = 0
        m -= .1;
    }
}

export function loadSunset() {
    t = h*rndmRng(.75,.5);

    sunset();
    sun();
    cloudWisps(16);
    ocean();
    waves();
    sunReflection();
}