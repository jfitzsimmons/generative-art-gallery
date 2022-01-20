import {ctx,h,w} from '../utils/canvas.js';
import {rndmRng, shuffle, flatten} from '../utils/helpers.js';

const fallColors = [354,29,53,65,35]
let btmW=0,
    topW=0,
    offset=0,
    stumpH=0,
    branchH = 0;
let treeCenter = {};
let branchLayer=[], treePoints=[], stumps=[];

function buildBranch(start, layer) {
    let temp = (layer===0) ? 1 : layer;
    for (let i = 2; i--;) {
        let newBranchH = rndmRng(branchH*1.2,branchH*.8);
        let newX = Math.round(Math.cos(rndmRng(80,35)*Math.PI/180) * newBranchH);
        let newY = Math.round(Math.sin(newBranchH*Math.PI/180) * newBranchH);
        let flip = (i===1) ? -1 : 1;
        let adjust = Math.abs(((start.x+(newX*flip)/3) - treeCenter.x)/temp);
        let bc = {
            x: (i === 1) ? start.x-topW/4 : start.x+topW/4,
            y: start.y,
        };
        let tc = {
            x: (i === 1) ? start.x-topW/4-newX : start.x+topW/4+newX,
            y: start.y-newY+adjust,
        };
        let angle = Math.atan2(bc.y - tc.y, bc.x - tc.x) * 180 / Math.PI;

        treePoints.push( {
            layer,
            tl: {
                x: tc.x- ((topW/4) * Math.cos((-90+angle)* Math.PI / 180)),
                y: tc.y- ((topW/4) * Math.sin((-90+angle)* Math.PI / 180)),
            },
            tr: {
                x: tc.x- ((topW/4) * Math.cos((90+angle)* Math.PI / 180)),
                y: tc.y- ((topW/4) * Math.sin((90+angle)* Math.PI / 180)),
            },
            tc,
            bl: {
                x: bc.x- ((btmW/4) * Math.cos((-90+angle)* Math.PI / 180)),
                y: bc.y- ((btmW/4) * Math.sin((-90+angle)* Math.PI / 180)),
            },
            br: {
                x: bc.x- ((btmW/4) * Math.cos((90+angle)* Math.PI / 180)),
                y: bc.y- ((btmW/4) * Math.sin((90+angle)* Math.PI / 180)),
            },
            bc,
            topW,
        } );
    }   
}

function drawLeaves(x,y,c,l,s,a,r) {
    let amount = a;
    for (let i = amount; i--;) {
        ctx.beginPath();
        let size = Math.round(rndmRng(14-(s.layer+l/2.2), 8-(s.layer+l/2.2)));
        ctx.arc(rndmRng(x+r, x-r), rndmRng(y+25, y-25), size, 0, Math.PI * 2); 
        ctx.fillStyle=`hsla(${(Math.random() > s.colorChange) ? Math.round(rndmRng(s.fallColor+5, s.fallColor-5)) : 125}, 
            ${rndmRng(60, 30)}%, ${rndmRng(c+5, c-5)}%, .9)`;
        ctx.fill();
    }
}

function drawBranch(b,i,s) {
    const found = treePoints.find(e => Math.abs(e.tc.x-b.bc.x) === b.topW/4);
    let baseColor = (found) ? found.baseColor : 20 +(s.layer*2);    
    baseColor *= .6+(Math.sqrt(b.layer)*.4)+(Math.sqrt(s.layer)*.04);
    let order = Math.pow(2, b.layer+1);
    let min = i-(order*1.4)
    min = (min < 0) ? Math.sqrt(Math.abs(min)) * -1 : Math.sqrt(min);
    baseColor -= Math.round(min)*2;
    if (baseColor< 5) baseColor=5;
    if (baseColor> 95) baseColor=95;

    ctx.fillStyle=`hsla(348, 7%, ${baseColor}%, 1)`;
    ctx.beginPath();
    ctx.moveTo(b.bl.x,b.bl.y);
    ctx.lineTo(b.br.x,b.br.y);
    ctx.lineTo(b.tr.x,b.tr.y);
    ctx.lineTo(b.tl.x,b.tl.y);
    ctx.lineTo(b.bl.x,b.bl.y);
    ctx.fill();

    let xBox = Math.round((b.bc.x + b.tc.x)/2);
    let yBox = Math.round((b.bc.y + b.tc.y)/2);

    let amount = Math.round(rndmRng(s.sparse[1],s.sparse[0]));
    drawLeaves(xBox,yBox,baseColor,b.layer,s,amount,25);

    return baseColor;
}

function drawBackground() {
    let gradient = ctx.createLinearGradient(w/2,h,w/2,0);
    gradient.addColorStop(0, `rgba(54,19,5,1)`);
    gradient.addColorStop(1, `rgba(169,102,30,1)`);

    ctx.fillStyle=gradient;
    ctx.fillRect(0,0,w,h);

    gradient = ctx.createLinearGradient(w,0,0,h);
    gradient.addColorStop(0, `rgba(255,250,190,.6)`);
    gradient.addColorStop(.6, `rgba(210,180,115,.1)`);
    gradient.addColorStop(1, `rgba(160,100,35,0.3)`);

    ctx.fillStyle=gradient;
    ctx.fillRect(0,0,w,h);
}

export function loadTrees() {
    let y = h+h*.1
    stumps = [];
    let sLayer = 0;

    drawBackground();

    while (y > h*.2) {
        let x = rndmRng(60,-300)* (1-sLayer*.05);

        while (x < w) { 
            y -= rndmRng(h*.075, h*-.055)* (1-sLayer*.035);
            stumps.push({
                x,
                y,
                layer:sLayer,
                sparse: [rndmRng(11,0),rndmRng(11,0)].sort(),
                fallColor: fallColors[Math.round(rndmRng(fallColors.length-1, 0))],
                colorChange: Math.random(),
            })
            x += rndmRng(700, 300)* (1-sLayer*.12);
        }

        y -= rndmRng(h*.24, h*.16)* (1-sLayer*.1);
        sLayer++;      
    }

    stumps.sort(function(a, b) {return parseFloat(a.y) - parseFloat(b.y)})

    // Shadows
    ctx.beginPath();
    ctx.moveTo(0,stumps[0].y-50);
    sLayer = stumps[0].layer;
    ctx.fillStyle="rgba(10,10,0,.1)";

    stumps.forEach((s,i) => {
        if (i%2===0) {
            if (s.layer !== sLayer) {
                sLayer--;
                ctx.lineTo(w+200,s.y-50);
                ctx.lineTo(w+200,h+200);
                ctx.lineTo(-200,h+200);
                ctx.lineTo(0,0);
                ctx.fill();
                ctx.beginPath();
                ctx.moveTo(0,s.y)
            }
            ctx.lineTo(s.x,s.y-50);
        }
    })

    branchLayer = [];
    treePoints = [];

    stumps.forEach((s,i) => {
        btmW = rndmRng(62,52) * (1-s.layer*.1);
        topW = btmW*(5/6);
        offset = (btmW-topW) / 2;
        stumpH = rndmRng(160,140)* (1-s.layer*.07);
        branchH = stumpH/2;
        let amount = 24-Math.round(rndmRng(s.sparse[1],s.sparse[0]))*2;

        ctx.shadowColor = `hsla(56, 95%, ${90*((s.layer/2+1)*.28)}%, .2)`;
        ctx.shadowBlur = 20-(s.layer*2);
        ctx.shadowOffsetY = 0-s.layer;
        ctx.shadowOffsetX = s.layer;
        ctx.save();

        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowOffsetX = 0;

        let tempColor =  s.colorChange;
        s.colorChange = .1;
        drawLeaves(s.x,s.y-rndmRng(h*.01,0),18 +(s.layer*4),0,s,Math.round(amount/1.5),300);
        
        ctx.restore();

        var grd = ctx.createLinearGradient(s.x, s.y, s.x, s.y-stumpH);
            grd.addColorStop(0, `hsla(348, 7%, ${15 +(s.layer*2)}%, 0)`);
            grd.addColorStop(.3, `hsla(348, 7%, ${15 +(s.layer*2)}%, .9)`);
        
        ctx.fillStyle=grd;
        ctx.beginPath();
        ctx.moveTo(s.x,s.y);
        ctx.lineTo(s.x+btmW, s.y);
        ctx.lineTo(s.x+offset+topW,s.y-stumpH);
        ctx.lineTo(s.x+offset,s.y-stumpH);
        ctx.lineTo(s.x,s.y);
        ctx.fill();
        ctx.save();
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowOffsetX = 0;

        drawLeaves(s.x+10,s.y+rndmRng(h*.01,0),16+(s.layer*4),0,s,Math.round(amount/1.5),300);
        s.colorChange = tempColor;
        
        ctx.restore();

        treeCenter = {
            x: s.x+topW/2+offset,
            y: s.y-stumpH,
        }

        buildBranch(treeCenter, 0);
        branchLayer.push(treePoints);
        
        let halt = Math.floor(Math.sqrt(topW))-1;
        let copy = branchLayer;

        for (let j=0; j < halt; j++) {
            btmW /= 2;
            topW /= 2;
            offset = (btmW-topW) / 2;
            treePoints = [];

            copy[j].forEach((l) => {
                buildBranch(l.tc,j+1);
            })

            branchLayer.push(shuffle(treePoints));
        }

        treePoints = flatten(branchLayer);
        branchLayer = [];

        treePoints.forEach((branch,k) => 
            branch["baseColor"] = drawBranch(branch,k,s)
        )

        treePoints = [];
    });
}

    