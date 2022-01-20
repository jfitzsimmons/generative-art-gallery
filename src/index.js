import {loadCosmos} from './art/randomcosmos.js'
import {loadMeditations} from './art/meditate.js'
import {loadSyntheosis} from './art/syntheosis.js'
import {loadTrees} from './art/autumnTrees.js'
import {loadDabs} from './art/paintDabs.js'
import {loadCity} from './art/pixelCity.js'
import {loadMountain} from './art/mountainFog.js'
import {loadSunset} from './art/oceanSunset.js'
import {loadWorld} from './art/reclaimedWorld.js'
import {resetCanvas} from './utils/canvas.js'
import {rndmRng} from './utils/helpers.js'
import './styles/style.css';

const calls = [
    {f:loadMeditations, name:'meditations'},
    {f:loadCosmos, name:'cosmos'},
    {f:loadSyntheosis, name: 'syntheosis'},
    {f:loadDabs, name: 'paint_dabs'},
    {f:loadCity, name: 'pixel_city'},
    {f:loadTrees, name: 'autumn_trees'},
    {f:loadMountain, name: 'mountain_fog'},
    {f:loadSunset, name: 'ocean_sunset'},
    {f:loadWorld, name: 'reclaimed_world'},
];
let call=0;
let buttons = [];
let flip = true;
const againBtn = document.getElementById("again");
const titleEl = document.getElementById("title");
const controlsEl = document.getElementById("controls");

function loadArt(e,newCall) {
    if(e && e.stopPropagation) e.stopPropagation(); 
    resetCanvas(flip);
    (isNaN(newCall)) ? calls[call].f.call() : calls[newCall].f.call();
    flip= (flip===true) ? false : true;
}

function handleActiveButton(button) {
    const actives = document.getElementsByClassName("active");
    while (actives.length)
        actives[0].classList.remove('active');

    buttons[call].classList.add("active"); 
}

function incrementCall(e) {
    if(e && e.stopPropagation) e.stopPropagation(); 
    call = (++call >= calls.length) ? 0 : call++
    loadArt(call)
    handleActiveButton(buttons[call]);
}

function setCall(e, i) {
    if(e && e.stopPropagation) e.stopPropagation(); 
    e.preventDefault();
    call = i;
    loadArt(call)
    handleActiveButton(e.target);
}

function randomCall(e) {
    if(e && e.stopPropagation) e.stopPropagation(); 
    call = Math.round(rndmRng(calls.length-1+.499,-.499));
    loadArt(call)
    handleActiveButton(buttons[call]);
}

function showControls() {
    const actives = document.getElementsByTagName("button");
    if (againBtn.classList.contains('show')) {
        againBtn.classList.remove('show');
        titleEl.classList.remove('show');
        controlsEl.classList.remove('hundred');
        
        for (let i = actives.length-1; i--;) {
            actives[i].classList.remove('show');
        }
    } else {
        againBtn.classList.add('show');
        titleEl.classList.add('show');
        controlsEl.classList.add('hundred');
        
        for (let i = actives.length-1; i--;) {
            actives[i].classList.add('show');
        }
    }
}

document.getElementById("view").addEventListener("click", showControls);
againBtn.addEventListener("click", loadArt); 
document.getElementById("another").addEventListener("click", incrementCall);
document.getElementById("random").addEventListener("click", randomCall); 
loadArt(call);

calls.forEach((c,i) => {
        const element = document.createElement("button");
        element.appendChild(document.createTextNode(c.name));
        element.addEventListener("click", (e) => setCall(e, i));
        element.classList.add("menu__button");
        if (i===0) element.classList.add("active");
        const menu = document.getElementById("menu");
        menu.appendChild(element);
        buttons.push(element);
})

window.onload = function() {
    controlsEl.classList.add("loaded");
}

