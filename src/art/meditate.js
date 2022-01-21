import {ctx,h,w,setDashedLines} from '../utils/canvas.js';
import {rndmRng, shuffle, coinflip} from '../utils/helpers.js';

let p1 = {}, p2 = {};
let meteors = [], stripes = [];
let dashArray = [0,0]

function drawSpeck(x,y) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x+rndmRng(5,1),y+rndmRng(5,1));
    ctx.stroke(); 
}

function dirt() {
    let spots = Math.round((h*w) / 1200);
    ctx.strokeStyle = "#161211";
    for (let s=spots; s--;) {  
        setDashedLines();
        drawSpeck(rndmRng(w,0),rndmRng(h,p1.y));
        drawSpeck(rndmRng(w,0),rndmRng(p1.y*1.2,p1.y));
    }
}

function bursts(x,y,size,color) {
    for (let i=0; i < size*1.9; i++) { 
        ctx.beginPath();
        ctx.strokeStyle = `rgba(${color}, ${rndmRng(1,.5)})`;
        ctx.lineWidth=rndmRng(5,1);
        let modX= rndmRng(2,1);
        let modY= rndmRng(2,1);
        let dotX=rndmRng(x+size/modX,x-size/modX);
        let dotY=rndmRng(y+size/modY,y-size/modY)
        ctx.moveTo(dotX, dotY);
        ctx.lineTo(dotX+rndmRng(-1,-5),dotY+rndmRng(-1,-5));
        ctx.stroke();
    }
}

function splatterPoints(ox,oy,layers) {
    for (let m=1; m<=layers; m++) {
        setDashedLines() 

        let x=ox+rndmRng(10*m,5*m);
        let y=oy+rndmRng(-5*m,-10*m);
        drawSpeck(x,y)

        x=ox+rndmRng(-5*m,-10*m);
        y=oy+rndmRng(-5*m,-10*m);
        drawSpeck(x,y)

        x=ox+rndmRng(-5*m,-10*m);
        y=oy+rndmRng(10*m,5*m);
        drawSpeck(x,y)

        x=ox+rndmRng(10*m,5*m);
        y=oy+rndmRng(10*m,5*m);
        drawSpeck(x,y)
    }
}

function points(x,y,r) {
    let edge = (w>h) ? w/2 : h/2;
    let lines = Math.round(r/rndmRng(13,10));
    
    for(let i = 0; i < lines; i++) {
        ctx.strokeStyle = `rgba(93, 78, 68, ${rndmRng(.2,.1)})`;
        setDashedLines();
        let x1 = x + r * Math.cos(2 * Math.PI * i / lines);
        let y1 = y + r * Math.sin(2 * Math.PI * i / lines);  
        let x2 = x + (edge*rndmRng(1,.4)) * Math.cos(2 * Math.PI * i / lines);
        let y2 = y + (edge*rndmRng(1,.4)) * Math.sin(2 * Math.PI * i / lines);   
        
        (p1.x < w*.5) ? curvedLine(x1,y1,x2,true) : curvedLine(x2,y1,x1,true);
        ctx.beginPath();
        ctx.moveTo(x1,y1);
        ctx.strokeStyle = `rgba(93, 78, 68, ${rndmRng(.2,.1)})`;
        ctx.lineTo(x2,y2);
        ctx.stroke();
    }
}

function curvedLine(newX,newY,endX,splat) {
    let counter = 0; 
    let x = newX;
    let startX = newX;
    let height = rndmRng(20,5);
    let increase = 90/180*Math.PI / rndmRng(1.9,1);
    let startY = newY;
    let y=startY;
    let splatter = Math.round(rndmRng(2,1));

    for(let i=startX; i<=endX; i+=dashArray[0]+dashArray[1]){
        dashArray = setDashedLines();
        ctx.beginPath();
        ctx.moveTo(x,y);
        let increase = 90/180*Math.PI / rndmRng(6,4);
        x = i + dashArray[0]+dashArray[1];
        y = startY - Math.sin(counter) * height;
        counter += increase;
        ctx.lineTo(x,y);
        ctx.stroke();
        splatter = Math.round(rndmRng(2,1));
        if (splat) splatterPoints(x,y,splatter);
    }
}

function drips() {
    let count = 0; 
    let x = rndmRng(30,-30);
    let step = rndmRng(w*.06,w*.03);
    let short = h*rndmRng(.49,.1);
    let mod = 1;

    while (x<w) {
        setDashedLines();
        ctx.strokeStyle="#9F1A14";
        ctx.fillStyle="#9F1A14";
        ctx.lineWidth=Math.round(rndmRng(4,2))
        ctx.beginPath();  
        ctx.moveTo(x,0);
        (count%2===0)?ctx.lineTo(x,h):ctx.lineTo(x,short);
        ctx.stroke();
        if (count%2!==0) {ctx.beginPath(); ctx.arc(x,short,rndmRng(8,3),0, Math.PI*2);ctx.fill();};
        if (count%2==0 && Math.random()>.3) {
            let rings = Math.round(rndmRng(10,1))
            let y = rndmRng(h*.5,0);
            ctx.strokeStyle="#161211";
            ctx.fillStyle="#E3D8D1";
            for (let i =rings; i--;) {
                setDashedLines();
                ctx.lineWidth=Math.round(rndmRng(7,3))
                ctx.beginPath();
                ctx.arc(x+rndmRng(h*.03,-h*.03),y+rndmRng(h*.04,-h*.04),rndmRng(h*.015,h*.007),0,2*Math.PI);
                ctx.stroke()
                if (Math.random()>.5) ctx.fill();
            }
        }
        x+=step;
        count++;
        short+=rndmRng(h*.05,h*.005)*mod
        if (short>h*.55) mod = -1;
        if (short<h*.05) mod = 1;
    }
}

function drawMeteor(m) {
    ctx.fillStyle="#E3D8D1";
    points(m.x,m.y,m.r);
    ctx.beginPath();
    ctx.arc(m.x,m.y,m.r,0,Math.PI*2)
    ctx.fill();
    let reach = rndmRng(4,0);
    for (let j=1.475; j >.25; j-=0.025) {
        ctx.strokeStyle = `rgba(34, 68, 132, ${rndmRng(1,.5)})`;
        let newX = m.r * Math.cos(Math.PI*j) + m.x
        let newY = m.r * Math.sin(Math.PI*j) + m.y
        let endX = m.r * Math.cos(Math.PI*(j+(reach*.025))) + m.x

        ctx.beginPath(); 
        curvedLine(newX,newY,endX,false) ;
        reach+=rndmRng(2.3,1.7);
    }
}

function drawStalk(x,y,nh,set) {
    ctx.shadowOffsetX = set;
    ctx.lineWidth = Math.round(rndmRng(4,3));
    ctx.beginPath(); 
    ctx.moveTo(x,y);
    ctx.lineTo(x+rndmRng(20,-20),y+nh)
    ctx.stroke();
    ctx.shadowOffsetX = 0;
    ctx.lineWidth = Math.round(rndmRng(9,6));
    ctx.beginPath(); 
    ctx.moveTo(x,y);
    ctx.lineTo(x,y+(nh/rndmRng(6,1.5)))
    ctx.stroke();
    ctx.lineWidth = Math.round(rndmRng(5,3));
    ctx.beginPath(); 
    ctx.moveTo(x,y+nh);
    ctx.lineTo(x,y+nh-(nh/rndmRng(15,10)))
    ctx.stroke();
}

function createFields(x,stalks,mod) {
    let y = p1.y;
    let height = rndmRng(30,5);
    let maxHeight = rndmRng(h*.55,h*.35);
    let minHeight = rndmRng(h*.34,h*.25);
    let oldHeight = 0;
    let newHeight = rndmRng(height*1.2,height*1.1);
    let grow = true;
    let count = 0;

    ctx.strokeStyle="#21110F";
    ctx.shadowColor = "#FFF";
    
    for (let i =stalks; i--;) {
        drawStalk(x,y,newHeight,-3*mod)
        x-=rndmRng(4,-1)*mod;
        oldHeight = height;
        height = newHeight

        if (height > maxHeight && grow === true) {
            grow=false;
            count = Math.round(rndmRng(300,75));
            height = maxHeight;
        } else if (height < minHeight && grow === false) {
            grow=true;
            count = Math.round(rndmRng(300,75));
            height = minHeight;
        } else if (height < minHeight && grow === true) height*=1.02;

        if (count > 0) { 
            newHeight = rndmRng(oldHeight*1.02,oldHeight*.98);
            count--; 
        } else {
            newHeight = (grow === false) ? rndmRng(height*1.005,height*.99) : rndmRng(height*1.01,height*.995);
        }

        y-= (newHeight - oldHeight) / 3;
    }
}

function drawStripe(s) {
    ctx.beginPath();
    ctx.moveTo(s[0].x,s[0].y);
    ctx.lineTo(s[1].x,s[1].y);
    
    setDashedLines();
    ctx.lineWidth=rndmRng(20,10);
    ctx.strokeStyle=coinflip(`rgba(14, 43, 118, ${rndmRng(1,.4)})`,`rgba(151, 17, 17, ${rndmRng(1,.4)})`);
    ctx.stroke();
}

function createStripes() {
    let cols = Math.round(rndmRng(w*.4,w*.2)/80);
    let rows = Math.round(rndmRng(h*.4,h*.2)/60);
    let x = p2.x
    let y = p2.y + h*.05

    for (let i=cols; i--;) {
        stripes.push([{x:x+i*rndmRng(40,25),y:0},{x:x+i*rndmRng(40,25),y:h}])
    }
    for (let i=rows; i--;) {
        stripes.push([{x:0,y:y+i*rndmRng(40,25)},{x:w,y:y+i*rndmRng(40,25)}])
    }
}

function createMeteors(n) {
    for (let i=n; n--;) {
        let x =rndmRng(w,0);
        let y = rndmRng(h*.5,0);
        let r = rndmRng(h*.15,h*.05);
        meteors.push({x,y,r})
    }
}

function generateNoise() {
    let squares = Math.round((h*w)/((h*.2)*(w*.2)));
    let x, y, number = 0;
    let count = 1;
    for ( y = h; y > -squares; y-=squares ) {
        for ( x = 0; x < w; x+=squares ) {
            if (Math.random()>.7) {
                count+= squares * .0002
                number = Math.floor( rndmRng(256,51) );
                ctx.fillStyle = `rgba(${number}, ${number-25},${number-50}, 0.${Math.round(rndmRng(2,1))}`;
                ctx.filter = `brightness(${Math.round(count)}) saturate(${Math.round(count/2)})`;
                ctx.fillRect(x, y, squares, squares);
            }
        }
    }
    ctx.filter = `none`;
}

export function loadMeditations() {
    meteors = [], stripes = [];

    p1 = {x:rndmRng(w*.6,w*.3),y:rndmRng(h*.6,h*.7)}
    p2 = (p1.x < w*.5) ? {x:rndmRng(w*.63,w*.75),y:rndmRng(h*.65,h*.77)} 
        : {x:rndmRng(w*-.02,w*.15),y:rndmRng(h*.65,h*.77)}

    //sky
    let grd = ctx.createRadialGradient(p1.x, p1.y, h*rndmRng(.4,.01), p1.x, p1.y, h*rndmRng(.99,.96));
        grd.addColorStop(rndmRng(.4,0), "#Ffdfd8");
        grd.addColorStop(rndmRng(.9,.6), "#E3D8D1");
        grd.addColorStop(1, "#dfccc0");
    ctx.fillStyle = grd;
    ctx.fillRect(0,0,w,p1.y);

    //arrays of meteors
    let avgSize = Math.round(((h/2)*w)/75000);
    createMeteors(Math.round(rndmRng(avgSize*.3, avgSize*.09)));
    meteors = shuffle(meteors);
    const threePartIndex = Math.ceil(meteors.length / 3);
    const meteors3 = meteors.splice(-threePartIndex);
    const meteors2 = meteors.splice(-threePartIndex);
    const meteors1 = meteors;  

    meteors1.forEach(m => {
        drawMeteor(m);
    })

    drips();

    meteors2.forEach(m => {
        drawMeteor(m);
    }) 

    //sun
    ctx.fillStyle="#DA2E20";
    let size= rndmRng(h*.34,h*.19);
    ctx.beginPath();
    ctx.arc(p1.x*1.05,p1.y*.85,size, 0, Math.PI*2);
    ctx.fill();
    bursts(p1.x*1.05,p1.y*.85,size,'227, 216, 209');

    //ground
    grd = ctx.createRadialGradient(p1.x, p1.y, h*rndmRng(.4,.01), p1.x, p1.y, h*rndmRng(.99,.6));
    grd.addColorStop(rndmRng(.25,0), "#Ffdfd8");
    grd.addColorStop(rndmRng(.4,.7), "#E3D8D1");
    grd.addColorStop(rndmRng(1,.85), "#dfccc0");
    ctx.fillStyle = grd;
    ctx.fillRect(0,p1.y,w, h*.4);
    dirt();
    ctx.fillStyle="#DA2E20";
    bursts(p1.x*1.05,p1.y*1.05,size/4,'218, 46, 32');
    bursts(p1.x*1.2,p1.y*1.16,size/2,'218, 46, 32');

    //stripe arrays
    createStripes();
    stripes = shuffle(stripes);
    const middleIndex = Math.ceil(stripes.length / 2);
    const stripes1 = stripes.slice().splice(0, middleIndex);   
    const stripes2 = stripes.slice().splice(-middleIndex);

    stripes1.forEach(s => {
        drawStripe(s);
    })

    generateNoise(); 

    meteors3.forEach(m => {
        drawMeteor(m);
    }) 

    //left field
    createFields(p1.x*.99,Math.round(p1.x*.99),1);
    //right field
    createFields(p1.x*1.01,Math.round(w-p1.x*1.01),-1);

    stripes2.forEach(s => {
        drawStripe(s);
    })
}