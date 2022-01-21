import {rndmRng} from '../utils/helpers.js';

export const canvas=document.getElementById("canvas1"); 
export const canvas2=document.getElementById("canvas2");      

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas2.width = window.innerWidth;
canvas2.height = window.innerHeight;

export let ctx=canvas.getContext("2d");
export let ctx2=canvas2.getContext("2d");
export let w = window.innerWidth;
export let h = window.innerHeight;

export const setDashedLines = () => {
    let lineDash=rndmRng(5,1);
    let lineSpace=rndmRng(6,3);

    ctx.lineWidth=rndmRng(5,1);
    ctx.setLineDash([lineDash,lineSpace]);

    ctx2.lineWidth=rndmRng(5,1);
    ctx2.setLineDash([lineDash,lineSpace]);

    return [lineDash,lineSpace]
}

export function resetCanvas(flip) {
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas2.width = window.innerWidth;
    canvas2.height = window.innerHeight;
    ctx= (flip === true) ? canvas.getContext("2d") : canvas2.getContext("2d");
    ctx.clearRect(0,0,w,h);
        ctx.shadowColor = "#000"
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;  
        ctx.setLineDash([]);
        ctx.lineWidth = 0;
    if (flip === true) {
        canvas2.classList.add("hide");
        canvas2.classList.remove("show");
        canvas.classList.add("show");
        canvas.classList.remove("hide");
    } else {
        canvas2.classList.add("show");
        canvas2.classList.remove("hide");
        canvas.classList.add("hide");
        canvas.classList.remove("show");
    }  
}