import {loadArt} from './art/randomcosmos.js'
import {load} from './art/meditate.js'
import {loadSyntheosis} from './art/syntheosis.js'
import {loadTrees} from './art/autumnTrees.js'
import {loadDabs} from './art/paintDabs.js'
import {loadCity} from './art/pixelCity.js'
import {loadMountain} from './art/mountainFog.js'
import {loadSunset} from './art/oceanSunset.js'
import {loadWorld} from './art/reclaimedWorld.js'

import './styles/style.css';

const calls = [
    {f:load, name:'meditations'},
    {f:loadArt, name:'cosmos'},
    {f:loadSyntheosis, name: 'syntheosis'},
    {f:loadDabs, name: 'paint_dabs'},
    {f:loadCity, name: 'pixel_city'},
    {f:loadTrees, name: 'autumn_trees'},
    {f:loadMountain, name: 'mountain_fog'},
    {f:loadSunset, name: 'ocean_sunset'},
    {f:loadWorld, name: 'reclaimed_world'},
];

let call=0;
let buttons = []

function setAgainListener(oldCall,newCall) {
    document.getElementById("again").removeEventListener("click", calls[oldCall].f); 
    document.getElementById("again").addEventListener("click", calls[newCall].f);
}

function handleActiveButton(button) {
    var actives = document.getElementsByClassName("active");
    while (actives.length)
        actives[0].classList.remove('active');

    buttons[call].classList.add("active"); 
}

function incrementCall() {
    let oldCall = call
    call = (++call >= calls.length) ? 0 : call++
    calls[call].f.call();
    
    setAgainListener(oldCall,call);
    handleActiveButton(buttons[call]);
}

function setCall(e, i) {
    e.preventDefault();

    let oldCall = call
    call = i;
    calls[call].f.call();

    setAgainListener(oldCall,call);
    handleActiveButton(e.target);
}


document.getElementById("again").addEventListener("click", calls[call].f); 
document.getElementById("another").addEventListener("click", incrementCall);
calls[call].f.call();

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
