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
//import './utils/favicons.js';
import './styles/style.css';
//import favicon from './assets/favicons/favicon.ico';

//require.context('./assets/favicons', true, /^\.\//);
/** 
const myIcon = new Image();

myIcon.src = favicon;

console.log(`myIcon.src: ${myIcon.src}`)

document.createElement('link');
link.type = 'image/png';
link.rel = 'shortcut icon';
link.href = 'myIcon.src';
document.getElementsByTagName('head')[0].appendChild(link);
*/
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

function loadArt(newCall) {
    resetCanvas(flip);
    (isNaN(newCall)) ? calls[call].f.call() : calls[newCall].f.call();
    flip= (flip===true) ? false : true;
}

function handleActiveButton(button) {
    var actives = document.getElementsByClassName("active");
    while (actives.length)
        actives[0].classList.remove('active');

    buttons[call].classList.add("active"); 
}

function incrementCall() {
    call = (++call >= calls.length) ? 0 : call++
    loadArt(call)
    handleActiveButton(buttons[call]);
}

function setCall(e, i) {
    e.preventDefault();
    call = i;
    loadArt(call)
    handleActiveButton(e.target);
}

function randomCall() {
    call = Math.round(rndmRng(calls.length-1,0));
    loadArt(call)
    handleActiveButton(buttons[call]);
}


document.getElementById("again").addEventListener("click", loadArt); 
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
    document.getElementById("controls").classList.add("loaded");
}

