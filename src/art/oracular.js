import {ctx,h,w,setDashedLines} from '../utils/canvas.js';
import {rndmRng, shuffle, coinflip} from '../utils/helpers.js';
//TESTJPF TODO _ yu need a js source map, prettier, eslint?
let p1 = {}, p2 = {}, sunColors = {};
let circles = [], stripes = [];
let dashArray = [0,0];
let red = {
    drips: "#9F1A14",
    meteor: `132, 68, 34`,
    main: {
        grd: [
            "#Ffdfd8",
            "#E3D8D1",
            "#dfccc0",
        ],
        sun: "#DA2E20",
        bursts: [
            '227, 216, 209',
            '218, 46, 32'
        ],
    }
};
let blue = {
    drips: "#141A9f",
    meteor: `34, 68, 132`,
    main: {
        grd: [
            "#d8dfff",
            "#d1D8e3",
            "#c0ccdf",
        ],
        sun: "#202Eda",
        bursts: [
            '209, 216, 227',
            '32, 46, 218'
        ],
    }
};

function drawCircle(m) {
   /**
    * make 4 circles.  each with it's own transparent to 
    * unique color radial gradients
    * each outer circle for each gradient will be m.r(width of entire Circle
    * testjpf)
    */
//create locations and size of all 4 first (quadrants)
//(m.x*.9)(m.x-m.r/2)*1.1
//100 //50
    let xTopLeft = Math.round(rndmRng(m.x*.9,(m.x-m.r/2)));
    let yTopLeft = Math.round(rndmRng(m.y*.9,(m.y-m.r/2)*1.1));
    let rTopLeft = Math.round(rndmRng(m.r/6,m.r/14));
    console.log(`m.x: ${m.x} | m.y: ${m.y} | ${m.r} m.r`)
    console.log(`xTopLeft: ${xTopLeft} | yTopLeft: ${yTopLeft} | ${rTopLeft} rTopLeft`)

    var gradient = ctx.createRadialGradient(xTopLeft,yTopLeft,rTopLeft, m.x,m.y,m.r);

    // Add three color stops
    gradient.addColorStop(0,  '#f00f');
    gradient.addColorStop(1, '#00f2');
   
    //ctx.fillStyle="#E3D8D1";
// Set the fill style and draw a rectangle
ctx.fillStyle = gradient;
    //points(m.x,m.y,m.r);
    ctx.beginPath();
    ctx.arc(m.x,m.y,m.r,0,Math.PI*2)
    ctx.fill();
}

function createCircles(n) {
    for (let i=n; n--;) {
        let x = Math.round(rndmRng(w,0));
        let y = Math.round(rndmRng(h*.5,0));
        let r = Math.round(rndmRng(h*.19,h*.09));
        circles.push({x,y,r})
    }
}

export function loadOracular() {
    circles = []

    p1 = {x:Math.round(rndmRng(w*.6,w*.3)),y:Math.round(rndmRng(h*.6,h*.7))}
    p2 = (p1.x < w*.5) ? {x:Math.round(rndmRng(w*.63,w*.75)),y:Math.round(rndmRng(h*.65,h*.77))} 
        : {x:Math.round(rndmRng(w*-.02,w*.15)),y:Math.round(rndmRng(h*.65,h*.77))}

    sunColors = coinflip(red.main,blue.main);

    //sky
    /** 
    let grd = ctx.createRadialGradient(p1.x, p1.y, Math.round(h*rndmRng(.4,.01)), p1.x, p1.y, Math.round(h*rndmRng(.99,.96)));
        grd.addColorStop(rndmRng(.4,0), sunColors.grd[0]);
        grd.addColorStop(rndmRng(.9,.6), sunColors.grd[1]);
        grd.addColorStop(1, sunColors.grd[2]);
    ctx.fillStyle = grd;
    ctx.fillRect(0,0,w,p1.y);
    */

    //arrays of circles
    let avgSize = Math.round(((h/2)*w)/75000);
    createCircles(Math.round(rndmRng(avgSize*.33, avgSize*.15)));
    circles = shuffle(circles);
    const threePartIndex = Math.ceil(circles.length / 3);
    const circles3 = circles.splice(-threePartIndex);
    const circles2 = circles.splice(-threePartIndex);
    const circles1 = circles;  

    circles1.forEach(m => {
        drawCircle(m);
    })
    circles2.forEach(m => {
        drawCircle(m);
    }) 

    //sun
    ctx.fillStyle=sunColors.sun;
    let size= Math.round(rndmRng(h*.34,h*.19));
    ctx.beginPath();
    ctx.arc(Math.round(p1.x*1.05),Math.round(p1.y*.85),size, 0, Math.PI*2);
    ctx.fill();

    circles3.forEach(m => {
        drawCircle(m);
    }) 
}