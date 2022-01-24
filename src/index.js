import {loadCosmos} from './art/randomcosmos.js'
import {loadMeditations} from './art/meditate.js'
import {loadSyntheosis} from './art/syntheosis.js'
import {loadTrees} from './art/autumnTrees.js'
import {loadDabs} from './art/paintDabs.js'
import {loadCity} from './art/pixelCity.js'
import {loadMountain} from './art/mountainFog.js'
import {loadSunset} from './art/oceanSunset.js'
import {loadWorld} from './art/reclaimedWorld.js'
import {resetCanvas, canvas} from './utils/canvas.js'
import {rndmRng, debounce} from './utils/helpers.js'
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
let call=0, intervalID=-1;
let buttons = [], timeouts = [];
const againBtn = document.getElementById("again");
const pinBtn = document.getElementById("pin");
const shuffleBtn = document.getElementById("shuffle");
const titleEl = document.getElementById("title");
const controlsEl = document.getElementById("controls");
const reloadArt = debounce(function() {loadArt(call)},500);
const canvasImg = document.getElementById("canvasImg");

function crossFade() {
    canvasImg.classList.add("hide");
    canvasImg.classList.remove("show");
    if(timeouts.length > 0)timeouts.forEach(to => clearTimeout(to));
    timeouts=[];
    timeouts.push(
        setTimeout(function(){
            canvas.toBlob(function(blob) {
                let url = URL.createObjectURL(blob);
                canvasImg.src = url;
            },'image/jpeg', 0.99);     
        }, 800)
    );
    setTimeout(function(){
        canvasImg.classList.remove("hide"); 
        canvasImg.classList.add("show");
    }, 1000)
}

const loadArt = debounce(function(e,newCall) {
    if(e && e.stopPropagation) e.stopPropagation();
    
    resetCanvas();
    (isNaN(newCall)) ? calls[call].f.call() : calls[newCall].f.call();
    crossFade(); 
},800);

function handleActiveButton(e) {
    if (e && e.target.disabled == true) return;
    const actives = document.getElementsByClassName("active");
    while (actives.length)
        actives[0].classList.remove('active');

    buttons[call].classList.add("active"); 
}

function incrementCall(e) {
    if(e && e.stopPropagation) e.stopPropagation(); 
    call = (++call >= calls.length) ? 0 : call++
    handleActiveButton(e);
    loadArt(e,call);
}

function setCall(e, i) {
    if(e && e.stopPropagation) e.stopPropagation(); 
    e.preventDefault();
    call = i;
    handleActiveButton(e);
    loadArt(e,call)
}

function randomCall(e) {
    if(e && e.stopPropagation) e.stopPropagation(); 
    call = Math.round(rndmRng(calls.length-1+.499,-.499));
    handleActiveButton(e);
    loadArt(e,call)
}

function showControls(e) {
    if(e && e.stopPropagation) e.stopPropagation(); 
    const actives = document.getElementsByTagName("button");

    if (againBtn.classList.contains('show')) {
        againBtn.classList.remove('show');
        titleEl.classList.remove('show');
        pinBtn.classList.remove('pinned');
        pinBtn.childNodes[0].innerHTML='PIN<br /><span class="symbol">&#9906;</span>';
        controlsEl.classList.remove('hundred');
        
        for (let i = actives.length-1; i--;) {
            actives[i].classList.remove('show');
        }
    } else {
        againBtn.classList.add('show');
        titleEl.classList.add('show');
        controlsEl.classList.add('hundred');
        pinBtn.classList.add('pinned');
        pinBtn.childNodes[0].innerHTML='UNPIN<br /><span class="symbol">&#9906;</span>';
        
        for (let i = actives.length-1; i--;) {
            actives[i].classList.add('show');
        }
    }
}

function shuffleArt(e) {
    if(e && e.stopPropagation) e.stopPropagation(); 
    if (intervalID > -1) {
        clearInterval(intervalID);
        intervalID = -1;
        shuffleBtn.classList.remove('glow'); 
        shuffleBtn.innerHTML='SHUFFLE<span class="symbol">&#10542;</span>'
    } else {
        shuffleBtn.classList.add('glow');
        shuffleBtn.innerHTML='STOP<span class="symbol">&#10539;</span>'
        intervalID = setInterval(randomCall, 15000);
    };
}

againBtn.addEventListener("click", loadArt); 
pinBtn.addEventListener("click", showControls);
document.getElementById("view").addEventListener("click", showControls);
document.getElementById("another").addEventListener("click", incrementCall);
document.getElementById("random").addEventListener("click", randomCall); 
shuffleBtn.addEventListener("click", shuffleArt);
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

window.addEventListener('resize', reloadArt);