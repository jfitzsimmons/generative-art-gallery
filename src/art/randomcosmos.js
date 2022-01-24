import {ctx,h,w,setDashedLines} from '../utils/canvas.js'
import {rndmRng,coinflip,shuffle} from '../utils/helpers.js';

let dashes = [0,0];
let gradientArray = ['360, 0%','204, 100%','260, 31%','340, 89%','179, 79%'];

function pickGradient(i) {
    let gradients=shuffle(gradientArray);

    return  `hsla(${gradients[i]},${Math.round(rndmRng(99,60))}%, ${rndmRng(1,.5)})`;
}

function drawSpeck(x,y) {
    ctx.moveTo(x, y);
    ctx.lineTo(x+rndmRng(5,1),y+rndmRng(5,1));
    ctx.stroke();
    ctx.beginPath();
}

function backgroundGradients(layers) {
    for (let i=layers; i--;) {
        let outR = rndmRng(w*.4, w*.1);
        let outX = rndmRng(w+w*.1, 0-w*.1);
        let outY = rndmRng(h+h*.1, 0-h*.1);
        let inR = rndmRng(outR*.3, outR*.01);

        let grd = ctx.createRadialGradient(outX, outY, inR, outX, outY, outR);
        grd.addColorStop(0, `rgba(${rndmRng(80, 54)}, ${rndmRng(40, 10)}, 
                        ${rndmRng(43,17)}, ${rndmRng(0.9, 0.5)})`);
        grd.addColorStop(1, `rgba(${rndmRng(80, 54)}, ${rndmRng(40, 10)}, 
                        ${rndmRng(43,17)}, 0)`);

        ctx.fillStyle = grd;
        ctx.fillRect(outX-outR, outY-outR, outR*2, outR*2);
    }
}

function randomSpots() {
    let spots = Math.round((h*w) / 21000);
    for (let s=spots; s--;) {          
        let x = rndmRng(w,0);
        let y = rndmRng(h,0);

        ctx.beginPath();
        ctx.strokeStyle = pickGradient(0);
        ctx.lineWidth=rndmRng(5,1);

        drawSpeck(x,y);
    }
}

function bursts(bursts) {
    for (let b=0; b<bursts; b++) {
        let gradients=shuffle(gradientArray);
        let x = rndmRng(w,0);
        let y = rndmRng(h,0);
        let size = Math.round(rndmRng(h*.29, h*.08));
        let g = 0;
        setDashedLines();

        for (let i=0; i < size; i++) { 
            if (i < size/40) { 
                g = 0;
            } else if (i < size/13) { 
                g = 1;
            } else if (i < size/6) { 
                g = 2;
            } else { 
                g = 3;
            }
            ctx.beginPath();
            ctx.strokeStyle = `hsla(${gradients[g]},${Math.round(rndmRng(99,60))}%, ${rndmRng(1,.5)})`;
            ctx.lineWidth=rndmRng(5,1);
            let modX= rndmRng(2.5,1.5);
            let modY= rndmRng(2.5,1.5);
            let dotX=rndmRng(x+size/modX,x-size/modX);
            let dotY=rndmRng(y+size/modY,y-size/modY)
            ctx.moveTo(dotX, dotY);
            ctx.lineTo(dotX+rndmRng(-1,-5),dotY+rndmRng(-1,-5));
            ctx.stroke();
        }
    }
}

function splatterPoints(ox,oy,layers) {
    for (let m=1; m<=layers; m++) {
        ctx.strokeStyle = `hsla(204, 100%, ${48+Math.round(rndmRng(51,0))}%, ${rndmRng(1,.5)})`;
        ctx.lineWidth=rndmRng(5,1);
        let x=ox+rndmRng(10*m,5*m);
        let y=oy+rndmRng(-5*m,-10*m);
        drawSpeck(x,y)

        ctx.strokeStyle = `hsla(260, 31%, ${70+Math.round(rndmRng(29,0))}%, ${rndmRng(1,.5)})`;
        ctx.lineWidth=rndmRng(5,1);
        x=ox+rndmRng(-5*m,-10*m);
        y=oy+rndmRng(-5*m,-10*m);
        drawSpeck(x,y)

        ctx.strokeStyle = `hsla(340, 89%, ${74+Math.round(rndmRng(25,0))}%, ${rndmRng(1,.5)})`;
        ctx.lineWidth=rndmRng(5,1);
        x=ox+rndmRng(-5*m,-10*m);
        y=oy+rndmRng(10*m,5*m);
        drawSpeck(x,y)

        ctx.strokeStyle = `hsla(179, 79%, ${74+Math.round(rndmRng(25,0))}%, ${rndmRng(1,.5)})`;
        ctx.lineWidth=rndmRng(5,1);
        x=ox+rndmRng(10*m,5*m);
        y=oy+rndmRng(10*m,5*m);
        drawSpeck(x,y)
    }
}

function curvedLine() {
    let counter = 0, x=0;
    let startX = rndmRng(-500,0);
    let height = rndmRng(350,40);
    let startY = rndmRng(500,-200);
    let y=startY;
    let splatter = Math.round(rndmRng(8,1));

    for(let i=startX; i<=w+100; i+=dashes[0]+dashes[1]){
        ctx.strokeStyle = `rgba(254, 254, 254, ${rndmRng(1,.1)})`;
        dashes = setDashedLines();
        ctx.moveTo(x,y);
        let increase = 90/180*Math.PI / rndmRng(30,15);
        x = i + dashes[0]+dashes[1];
        y = startY+i/2 - Math.sin(counter) * height;
        counter += increase;
        ctx.lineTo(x,y);
        ctx.stroke();
        splatter = Math.round(rndmRng(14,1));
        splatterPoints(x,y,splatter);
    }
}

function circleShading(x,y,size) {
    let gradients=shuffle(gradientArray);
    let startAngle = Math.floor(rndmRng(2 * Math.PI,0));
    let endAngle = startAngle+1;
    let increment = rndmRng(6,3.3);
    let layers = Math.round(size/28);

    for (let i=0; i<layers; i++) {
        ctx.strokeStyle = `hsla(${gradients[0]},${Math.round(rndmRng(99,60))}%, ${rndmRng(1-(i*.05),.9-(i*.05))})`;
        ctx.beginPath();
        endAngle = ((startAngle-i/30)+increment > 2 * Math.PI) ? ((startAngle-i/30)+increment)-2 * Math.PI : (startAngle-i/30)+increment;
        ctx.arc(x, y, size-(i/2)*10, startAngle+i/rndmRng(30,20), endAngle);
        ctx.stroke();
        increment -= rndmRng(increment*.03,increment*.001)+(layers/10*.01);
    }
}

function createArc(x,y,size) {
    let start = 0;
    let end = rndmRng(2 * Math.PI,start+.2);
    
    while (start < 2 * Math.PI) {
        ctx.strokeStyle = pickGradient(0);
        setDashedLines();
        ctx.beginPath();
        ctx.arc(x, y, size, start, end);
        ctx.stroke();
        start = end;
        end = rndmRng(2 * Math.PI,start+.2);
    }
}

function createHalfArc(x,y,size) {
    let direction=coinflip(true,false);
    ctx.strokeStyle = pickGradient(0);
    setDashedLines();
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI, direction);
    ctx.stroke();
}

function circles(n) {
    for (let i=n; i--;) {
        let x = rndmRng(w,0);
        let y = rndmRng(h,0);
        let size = Math.round(rndmRng(h*.3, h*.09));
        let rings = Math.round(rndmRng(5,2))
        for (let c=1; c<=rings; c++) {
            createArc(x,y,size)
            if (Math.random() > .5) circleShading(x,y,size);
            size = size*rndmRng(1.6, 1.2);
        }
    }
}

function mainCircle() {
    let x=0;
    let y=rndmRng(h*.66,h*.33);

    while (x<w) {
        ctx.beginPath();
        ctx.moveTo(x,y);
        ctx.strokeStyle = pickGradient(0);
        setDashedLines();
        x+=rndmRng(w*.3,w*.05);    
        ctx.lineTo(x, y);
        ctx.stroke();
    }

    x=w/2;
    ctx.beginPath();
    ctx.moveTo(x,y);
    let size = Math.round(rndmRng(h*.3, h*.09));

    while (size < h) {
        (coinflip(true,false)) ? createHalfArc(x,y,size) : createArc(x,y,size);
        if (Math.random() > .5) circleShading(x,y,size);
        size = size*rndmRng(1.8, 1.4);
    }
}

function points() {
    let x = rndmRng(w,0);
    let y = rndmRng(h,0);
    let size = Math.round(rndmRng(h*.3, h*.09));
    let edge = (w>h) ? w : h;
    let rings = Math.round(rndmRng(3,1));

    let lines = Math.round(rndmRng(21,8));
    for(var i = 0; i < lines; i++) {
        ctx.strokeStyle = pickGradient(0);
        setDashedLines();
        let x1 = x + size * Math.cos(2 * Math.PI * i / lines);
        let y1 = y + size * Math.sin(2 * Math.PI * i / lines);  
        let x2 = x + edge * Math.cos(2 * Math.PI * i / lines);
        let y2 = y + edge * Math.sin(2 * Math.PI * i / lines);   
        ctx.beginPath();
        ctx.moveTo(x1,y1);
        ctx.lineTo(x2,y2);
        ctx.stroke();
    }

    for (let c=1; c<=rings; c++) {
        size = size*rndmRng(2.2, 1.8);
        createArc(x,y,size)
        if (Math.random() > .5) circleShading(x,y,size);       
    }
}

export function loadCosmos() {
    let bgSpots = Math.round(rndmRng(6,2));
    let burstAmount = Math.round(((h/2)*(w/2)) / 90000);
    let circleAmount = (burstAmount <= 1) ? 1 : Math.round(rndmRng(burstAmount-1,1));

    ctx.fillStyle = "#180D0E";
    ctx.fillRect(0,0,w,h);

    backgroundGradients(bgSpots);
    randomSpots();
    points();
    bursts(Math.ceil(burstAmount/2));
    circles(Math.floor(circleAmount/2));
    curvedLine(); 
    randomSpots();
    bursts(Math.floor(burstAmount/2));
    circles(Math.ceil(circleAmount/2));
    points();
    mainCircle();
}