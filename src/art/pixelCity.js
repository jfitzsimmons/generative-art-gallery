import {ctx,h,w} from '../utils/canvas.js';
import {rndmRng,coinflip,shuffle,randomProperty} from '../utils/helpers.js';

const rowHeight = 10;
let buildingRowH = [[[23,15],[19,10],[15,5]]
                    ,[[29,21],[25,16],[21,13]]
                    ,[[35,27],[31,22],[27,17]]];
let startHue = 0, buildingRows = 0;
const baseHue = (diff) =>  {
    let hue = (startHue+diff < 0) ? 360 + (startHue+diff) : startHue+diff;
    return (hue > 80 && hue < 135) ? (135 - hue < 27) ? hue+= 27 : hue -=27 : hue;
}
let buildingRowC = [], sunsetColors = [], oceanColors = [], layers =[], buildings = [];

ctx.lineWidth = rowHeight;
ctx.strokeStyle = '#550000'; 

function randomDimension(max, min) {
    let rnd = Math.floor(Math.random() * (max - min) + min);
    return (rnd % 2 === 0) ? ++rnd * (rowHeight) : rnd * (rowHeight);
}

function windowPane(x,y,colors,unlit) {
    if (Math.random() < unlit) { 
        //unlit window
        ctx.strokeStyle = colors[3];
        ctx.lineTo(x,y);
        ctx.stroke();
        ctx.moveTo(x,y);
    } else {
        ctx.strokeStyle = colors[0];
        ctx.lineTo(x-5,y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x-5,y);
        ctx.strokeStyle = colors[1];
        ctx.lineTo(x,y);
        ctx.stroke();
        ctx.moveTo(x,y);
    } 
}

function windowlessRowAwning(d,x,y,r) {
    ctx.strokeStyle = buildingRowC[r][1];
    ctx.lineTo(d +((-1)*rowHeight)+x,h-y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(d +((-1)*rowHeight)+x,h-y);
    ctx.strokeStyle = buildingRowC[r][2];
    ctx.lineTo(d+x,h-y);
    ctx.stroke();
}

function windowlessRow(d,x,y,color) {
    ctx.strokeStyle = color;
    ctx.lineTo(d+x,h-y);
    ctx.stroke();
}

function windowRowDraw(x,y) {
    ctx.lineTo(x,y);
    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();
    ctx.moveTo(x,y);
}

function windowRow(d,x,y,r) {
    for (let j=1; j<=d/rowHeight; j++) {
        (j % 2 !== 0) ? ctx.strokeStyle = buildingRowC[r][1] 
            : windowPane(j*rowHeight+x,h-y,[buildingRowC[r][3],buildingRowC[r][4],,buildingRowC[r][0]],.25);
        windowRowDraw(j*rowHeight+x,h-y);
    }
}

function allWindowRow(d,x,y,r) {
    for (let j=1; j<=(d/rowHeight)-1; j++) {
        (j === 1) ? ctx.strokeStyle = buildingRowC[r][3]
            : windowPane(j*rowHeight+x,h-y,[buildingRowC[r][4],buildingRowC[r][4],,buildingRowC[r][0]],.07);
        windowRowDraw(j*rowHeight+x,h-y);
    }
}

function windowRow2(d,x,y,r) {
    for (let j=1; j<=d/rowHeight; j++) {
        (j % 2 === 0) ? windowPane(j*rowHeight+x,h-y,[buildingRowC[r][1],buildingRowC[r][3],,buildingRowC[r][0]],.25) 
            : ctx.strokeStyle = buildingRowC[r][0];
        windowRowDraw(j*rowHeight+x,h-y);
    }
}

function allWindowRow2(d,x,y,r) {
    for (let j=1; j<=d/rowHeight; j++) {
        (j === 2) ? ctx.strokeStyle = buildingRowC[r][1] 
            : windowPane(j*rowHeight+x,h-y,[buildingRowC[r][3],buildingRowC[r][3],,buildingRowC[r][0]],.07);
        windowRowDraw(j*rowHeight+x,h-y);
    }
}

function draw(l) {
    for (let i=0; i<=l.height/rowHeight; i++) {
        let y = i*rowHeight + l.y;
        ctx.beginPath(); 
        ctx.moveTo(l.x,h-(y));
        l.style(i,l,y);
    }
};

function drawStyle1(i,l,y) {
    (i % 2 === 0) 
        ? windowRow(    l.width, l.x, y, l.row) 
        : windowlessRow(l.width, l.x, y, buildingRowC[l.row][1]);
}

function drawStyle2(i,l,y) {
    (i===l.height/rowHeight) 
        ? windowlessRow(l.width, l.x, y, buildingRowC[l.row][1]) 
        : windowRow(    l.width, l.x, y, l.row);
}

function drawStyle3(i,l,y) {
    (i % 2 === 0) 
        ? allWindowRow(       l.width, l.x, y, l.row) 
        : windowlessRowAwning(l.width, l.x, y, l.row);
}

function drawStyleSide1(i,l,y) {
    (i % 2 === 0) 
        ? windowRow2(    l.width, l.x, y, l.row) 
        : windowlessRow(l.width, l.x, y, buildingRowC[l.row][0]);
}

function drawStyleSide2(i,l,y) {
    (i!==l.height/rowHeight) 
        ? windowRow2(    l.width, l.x, y, l.row) 
        : windowlessRow(l.width, l.x, y, buildingRowC[l.row][0]);
}

function drawStyleSide3(i,l,y) {
    (i % 2 === 0) 
        ? allWindowRow2(l.width, l.x, y, l.row) 
        : windowlessRow(l.width, l.x, y, buildingRowC[l.row][0]);
}

function addSide(w) {
    if (w < 120) { 
        return 30;
    } else if (w < 170) { 
        return 50;
    } else { 
        return 70;
    }
}

let drawFronts = {
    1: drawStyle1,
    2: drawStyle2,
    3: drawStyle3,
    4: drawStyle1,
    5: drawStyle2,
}

let drawSides = {
    1: drawStyleSide1,
    2: drawStyleSide2,
    3: drawStyleSide3,
    4: drawStyleSide1,
    5: drawStyleSide2,
}

let levelCreate = function (hd,w,x,y,st) {
    let ht = randomDimension(hd[0], hd[1]);
    let style = randomProperty(drawSides);
    let side = addSide(w);
    
    addLayer(ht, side, x-side, y, style, buildingRows);

    let temp = randomProperty(drawFronts)
    style = (style === drawStyleSide3  && temp !== drawStyle3) ? drawStyle3 : temp;

    addLayer(ht, w, x, y, style, buildingRows);

    return {ht, w, side, x, y}
};

function addTower(l) {
    let width = randomDimension(3,1);
    let height = randomDimension(12,5);
    let x = l.x+l.width/2 - rndmRng(60,20);
    let towerX = x+rndmRng(width, rowHeight*2);

    ctx.beginPath(); 
    ctx.strokeStyle = buildingRowC[l.row][0];
    ctx.moveTo(x,h-l.y-l.height-rowHeight);
    ctx.lineTo(x+rowHeight,h-l.y-l.height-rowHeight);
    ctx.stroke();
    ctx.beginPath(); 
    ctx.strokeStyle = buildingRowC[l.row][1];
    ctx.moveTo(x+rowHeight,h-l.y-l.height-rowHeight);
    ctx.lineTo(x+rowHeight+width,h-l.y-l.height-rowHeight);
    ctx.stroke();
    ctx.beginPath(); 
    ctx.strokeStyle = buildingRowC[l.row][2];
    ctx.moveTo(x+rowHeight+width,h-l.y-l.height-rowHeight);
    ctx.lineTo(x+rowHeight*2+width,h-l.y-l.height-rowHeight);
    ctx.stroke();

    ctx.lineWidth = rowHeight/2;
    ctx.beginPath(); 
    ctx.strokeStyle = buildingRowC[l.row][1];
    ctx.moveTo(towerX,h-l.y-l.height-rowHeight-5);
    ctx.lineTo(towerX,h-l.y-l.height-rowHeight-height);
    ctx.stroke();
    ctx.beginPath(); 
    ctx.strokeStyle = buildingRowC[l.row][0];
    ctx.moveTo(towerX,h-l.y-l.height-rowHeight-height);
    ctx.lineTo(towerX,h-l.y-l.height-rowHeight*2-height);
    ctx.stroke();
    ctx.lineWidth = rowHeight;
}

function addBuilding(s,row) {
    layers = [];
    let buildingWidth = randomDimension(20, 9);
    let lvl = 0;
    let x = s-buildingWidth;
    startingX = s-buildingWidth;

    let priorLevel = levelCreate(buildingRowH[buildingRows][0],buildingWidth,x,0);
    if (priorLevel.side===70 && priorLevel.ht<buildingRowH[buildingRows][0][0] * 8.9) {
        let width = coinflip(130,150);
        priorLevel = levelCreate(buildingRowH[buildingRows][1],width,(priorLevel.w-width)/2+priorLevel.x-10+Math.floor(Math.random() * (15 - -20) + (-20)),priorLevel.y + priorLevel.ht+rowHeight);
    }
    
    if (priorLevel.side===50 && priorLevel.ht<buildingRowH[buildingRows][0][0] * 8.8) {
        let width = coinflip(90,110);
        priorLevel = levelCreate(buildingRowH[buildingRows][2],width,(priorLevel.w-width)/2+priorLevel.x-10+Math.floor(Math.random() * (15 - -20) + (-20)),priorLevel.y + priorLevel.ht+rowHeight);  
    }

    addLayer(priorLevel.ht, priorLevel.w, priorLevel.x, priorLevel.y,addTower,buildingRows);

    let b = building(s,buildingWidth,row,layers); 
    buildings.push(b);  
}

let layer = (height, width, x, y, style, row) => ({
    height,
    width,
    x,
    y,
    style,
    row,
});

function addLayer(height, width, x, y, style, row){    
    let l = layer(height, width, x, y, style, row); 
    layers.push(l);
}

let building = (start, width, row, layers) => ({
    start,
    width,
    row,
    layers,
});

function sunset() {
    let y = 0;
    let height = h*.0;
    let solids = [0,2,4,6,8,10];
    let sizeLottery = shuffle(solids);

    for (let i=0; i<=10; i++) {
        if (i === sizeLottery[0]) { height = h*.05 }
        else if (i === sizeLottery[1]) { height = h*.3 }
        else {height = h*.1}
        if (i % 2 === 0) {
            ctx.fillStyle = sunsetColors[i/2];
            ctx.rect(0, y, w, height);
            ctx.fill();
            ctx.beginPath();
            y+=height;
        } else {
            ctx.fillStyle = sunsetColors[Math.round(i/2)];
            ctx.rect(0, y, w, h*.005);
            ctx.fill();
            ctx.beginPath();
            y+=h*.005;

            ctx.fillStyle = sunsetColors[Math.round(i/2)-1];
            ctx.rect(0, y, w, h*.015);
            ctx.fill();
            ctx.beginPath();
            y+=h*.015;
            
            ctx.fillStyle = sunsetColors[Math.round(i/2)];
            ctx.rect(0, y, w, h*.005);
            ctx.fill();
            ctx.beginPath();
            y+=h*.005;

            ctx.fillStyle = sunsetColors[Math.round(i/2)-1];
            ctx.rect(0, y, w, h*.005);
            ctx.fill();
            ctx.beginPath();
            y+=h*.005;

            ctx.fillStyle = sunsetColors[Math.round(i/2)];
            ctx.rect(0, y, w, h*.015);
            ctx.fill();
            ctx.beginPath();
            y+=h*.015;

            ctx.fillStyle = sunsetColors[Math.round(i/2)-1];
            ctx.rect(0, y, w, h*.005);
            ctx.fill();
            ctx.beginPath();
            y+=h*.005;
        }
    }
}

function star1(x,y) {
    ctx.strokeStyle = buildingRowC[2][4];
    ctx.moveTo(x,y);
    ctx.lineTo(x+rowHeight/2,y);
    ctx.stroke();
    ctx.beginPath(); 
}

function star2(x,y) {
    ctx.strokeStyle = buildingRowC[1][4];
    ctx.moveTo(x,y);
    ctx.lineTo(x+rowHeight/2,y);
    ctx.stroke();
    ctx.beginPath(); 
}

function star3(x,y) {
    ctx.strokeStyle = buildingRowC[1][4];
    ctx.moveTo(x-rowHeight/2*2,y);
    ctx.lineTo(x+rowHeight/2*2,y);
    ctx.stroke();
    ctx.beginPath(); 
    ctx.moveTo(x,y-rowHeight/2*2);
    ctx.lineTo(x,y+rowHeight/2*2);
    ctx.stroke();
    ctx.beginPath(); 
    
    ctx.moveTo(x-rowHeight/2,y-rowHeight/2);
    ctx.lineTo(x+rowHeight/2,y-rowHeight/2);
    ctx.stroke();
    ctx.beginPath(); 
    ctx.moveTo(x-rowHeight/2,y+rowHeight/2);
    ctx.lineTo(x+rowHeight/2,y+rowHeight/2);
    ctx.stroke();
    ctx.beginPath(); 

    ctx.strokeStyle = buildingRowC[2][4];
    ctx.moveTo(x-rowHeight/2,y);
    ctx.lineTo(x+rowHeight/2,y);
    ctx.stroke();
    ctx.beginPath(); 
    ctx.moveTo(x,y-rowHeight/2);
    ctx.lineTo(x,y+rowHeight/2);
    ctx.stroke();
    ctx.beginPath(); 
}

function star4(x,y) {
    ctx.strokeStyle = buildingRowC[1][4];
    ctx.moveTo(x-rowHeight*9/2,y);
    ctx.lineTo(x+rowHeight*9/2,y);
    ctx.stroke();
    ctx.beginPath(); 
    ctx.moveTo(x,y-rowHeight*9/2);
    ctx.lineTo(x,y+rowHeight*9/2);
    ctx.stroke();
    ctx.beginPath(); 

    ctx.moveTo(x-rowHeight*5/2,y-rowHeight/2);
    ctx.lineTo(x+rowHeight*5/2,y-rowHeight/2);
    ctx.stroke();
    ctx.beginPath(); 
    ctx.moveTo(x-rowHeight*5/2,y+rowHeight/2);
    ctx.lineTo(x+rowHeight*5/2,y+rowHeight/2);
    ctx.stroke();
    ctx.beginPath(); 

    ctx.moveTo(x-rowHeight*2/2,y-rowHeight*2/2);
    ctx.lineTo(x+rowHeight*2/2,y-rowHeight*2/2);
    ctx.stroke();
    ctx.beginPath(); 
    ctx.moveTo(x-rowHeight*2/2,y+rowHeight*2/2);
    ctx.lineTo(x+rowHeight*2/2,y+rowHeight*2/2);
    ctx.stroke();
    ctx.beginPath(); 

    ctx.strokeStyle = buildingRowC[2][4];
    ctx.moveTo(x-rowHeight*5/2,y);
    ctx.lineTo(x+rowHeight*5/2,y);
    ctx.stroke();
    ctx.beginPath(); 
    ctx.moveTo(x,y-rowHeight*5/2);
    ctx.lineTo(x,y+rowHeight*5/2);
    ctx.stroke();
    ctx.beginPath(); 

    ctx.moveTo(x-rowHeight/2,y-rowHeight/2);
    ctx.lineTo(x+rowHeight/2,y-rowHeight/2);
    ctx.stroke();
    ctx.beginPath(); 
    ctx.moveTo(x-rowHeight/2,y+rowHeight/2);
    ctx.lineTo(x+rowHeight/2,y+rowHeight/2);
    ctx.stroke();
    ctx.beginPath(); 
}

let drawStars = {
    1: star1,
    2: star2,
    3: star3,
    4: star4,
}

function stars() {
    ctx.lineWidth = 5;
    let amount = Math.round((w * h) / 40000);

    for (let i=0; i<amount; i++) {
        let x = rndmRng((w - 30), 30);
        let y = rndmRng((h/2 - 30), 30);
        let star = randomProperty(drawStars);
        star(x,y);
    }
    ctx.lineWidth = rowHeight;
}

function oceanLayer(x,y,colors,d) {
    while (x <= w+rowHeight) {
        if (Math.random() < d) { 
            ctx.strokeStyle = colors[0]; 
        } else {
            ctx.strokeStyle = colors[1];
        }

        ctx.lineTo(x,y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x,y); 
        x+=rowHeight; 
    }
    ctx.beginPath();
}

function ocean() {
    let x = Math.floor(w*.7);
    let y = h-20*rowHeight;
    ctx.moveTo(x,y);
    let diff = 1;
    let count = 50;
    let color = 4;

    while (y < h) {
        if (count % 10 === 0) {
            color = count/10 - 1;
            diff = 1;
        }

        oceanLayer(x,y,[oceanColors[color],oceanColors[color-1]],diff);  
        
        x = Math.floor(w*.7);
        y+=rowHeight/2;
        diff -= .125;
        count--;  
    }
}

let startingX = Math.floor(w*.75);
function buildingRow() {
    while (buildingRows >= 0) {
        while (startingX > 0) {
            addBuilding(startingX,buildingRows); 
            startingX -= Math.floor(Math.random() * (100 - 10) + (10));
        }
        startingX = Math.floor(w*.75);
        buildingRows--;
    }
}

export function loadCity() {
    startHue = Math.round(rndmRng(360,0));
    buildingRowC = [
        [
            `hsla(${baseHue(-40)}, 66%, 28%, 1)`,
            `hsla(${baseHue(-23)}, 61%, 40%, 1)`,
            `hsla(${baseHue(-12)}, 58%, 53%, 1)`,
            `hsla(${baseHue(0)}, 76%, 65%, 1)`,
            `hsla(${baseHue(-345)}, 85%, 70%, 1)`
        ],[
            `hsla(${baseHue(-12)}, 58%, 53%, 1)`,
            `hsla(${baseHue(0)}, 76%, 65%, 1)`,
            `hsla(${baseHue(-345)}, 85%, 70%, 1)`,
            `hsla(${baseHue(-345)}, 85%, 70%, 1)`,
            `hsla(${baseHue(-332)}, 100%, 74%, 1)`
        ],[
            `hsla(${baseHue(-332)}, 100%, 74%, 1)`,
            `hsla(${baseHue(-332)}, 100%, 74%, 1)`,
            `hsla(${baseHue(-332)}, 100%, 74%, 1)`,
            `hsla(${baseHue(-307)}, 95%, 77%, 1)`,
            `hsla(${baseHue(-307)}, 95%, 77%, 1)`,
        ]];
    sunsetColors = [
        buildingRowC[0][2],
        buildingRowC[0][3],
        buildingRowC[0][4],
        buildingRowC[1][4],
        `hsla(${baseHue(-325)}, 90%, 77%, 1)`,
        buildingRowC[2][4]
    ]
    oceanColors = [
        buildingRowC[0][1],
        buildingRowC[0][2],
        buildingRowC[0][3],
        buildingRowC[0][4],
        buildingRowC[1][4],
        sunsetColors[4]
    ];
    layers =[], buildings = [];
    buildingRows = 2;

    const gradient = ctx.createLinearGradient(w/2,0,w/2,h);
        gradient.addColorStop(.05, buildingRowC[0][2]);
        gradient.addColorStop(.1, `hsla(${baseHue(-358)}, 78%, 66%, 1)`);
        gradient.addColorStop(.4, `hsla(${baseHue(-358)}, 78%, 66%, 1)`);
        gradient.addColorStop(.45, buildingRowC[0][4]);
        gradient.addColorStop(.55, buildingRowC[0][4]);
        gradient.addColorStop(.6, buildingRowC[1][4]);
        gradient.addColorStop(.7, buildingRowC[1][4]);
        gradient.addColorStop(.75, sunsetColors[4]);
        gradient.addColorStop(.75, sunsetColors[4]);
        gradient.addColorStop(.85, sunsetColors[4]);
        gradient.addColorStop(.9, buildingRowC[2][4]);

    ctx.fillStyle=gradient;
    ctx.fillRect(0,0,w,h);

    sunset();
    stars();
    ocean();

    buildingRow(buildingRows);

    buildings.forEach((building) => {  
        building.layers.forEach((layer) => {
            (layer.style === addTower) ? layer.style(layer) : draw(layer);
        });   
    });
}