import { loadCosmos } from './art/randomcosmos'
import loadMeditations from './art/meditate'
import { loadSyntheosis } from './art/syntheosis'
import loadTrees from './art/autumnTrees'
import loadDabs from './art/paintDabs'
import { loadCity } from './art/pixelCity'
import loadMountain from './art/mountainFog'
import loadSunset from './art/oceanSunset'
import { loadWorld } from './art/reclaimedWorld'
import { resetCanvas, canvas } from './utils/canvas'
import { rndmRng, debounce } from './utils/helpers'
import './assets/styles/style.css'

const calls = [
  { f: loadMeditations, name: 'meditations' },
  { f: loadCosmos, name: 'cosmos' },
  { f: loadSyntheosis, name: 'syntheosis' },
  { f: loadDabs, name: 'paint_dabs' },
  { f: loadCity, name: 'pixel_city' },
  { f: loadTrees, name: 'autumn_trees' },
  { f: loadMountain, name: 'mountain_fog' },
  { f: loadSunset, name: 'ocean_sunset' },
  { f: loadWorld, name: 'reclaimed_world' },
]
let currentCall = 0
let intervalID = -1
const buttons = []
let timeouts = []
const againBtn = document.getElementById('again')
const pinBtn = document.getElementById('pin')
const shuffleBtn = document.getElementById('shuffle')
const titleEl = document.getElementById('title')
const controlsEl = document.getElementById('controls')
const canvasImg = document.getElementById('canvasImg')

function crossFade() {
  canvasImg.classList.add('hide')
  canvasImg.classList.remove('show')
  if (timeouts.length > 0) timeouts.forEach((to) => clearTimeout(to))
  timeouts = []
  timeouts.push(
    setTimeout(() => {
      canvas.toBlob(
        (blob) => {
          const url = URL.createObjectURL(blob)
          canvasImg.src = url
        },
        'image/jpeg',
        0.99,
      )
    }, 700),
  )
  setTimeout(() => {
    canvasImg.classList.remove('hide')
    canvasImg.classList.add('show')
  }, 900)
}

const loadArt = debounce((e, newCall) => {
  const call = Number.isNaN(parseInt(newCall, 10)) ? currentCall : newCall
  resetCanvas()
  calls[call].f.call()
  crossFade()
}, 800)

function loadArtClick(e, newCall) {
  if (e && e.stopPropagation) e.stopPropagation()
  loadArt(newCall)
}

function handleActiveButton(e) {
  if (e && e.target.disabled === true) return
  const actives = document.getElementsByClassName('active')
  while (actives.length) actives[0].classList.remove('active')

  buttons[currentCall].classList.add('active')
}

function setCall(e, i) {
  if (e) e.preventDefault()
  currentCall = i
  handleActiveButton(e)
  loadArtClick(e, currentCall)
}

function randomCall(e) {
  currentCall = Math.round(rndmRng(calls.length - 1 + 0.499, -0.499))
  setCall(e, currentCall)
}

function showControls(e) {
  if (e && e.stopPropagation) e.stopPropagation()

  const actives = document.getElementsByTagName('button')

  if (againBtn.classList.contains('show')) {
    againBtn.classList.remove('show')
    titleEl.classList.remove('show')
    pinBtn.classList.remove('pinned')
    pinBtn.childNodes[0].innerHTML =
      'PIN<br /><span class="symbol">&#9906;</span>'
    controlsEl.classList.remove('hundred')

    for (let i = actives.length - 1; i--; ) {
      actives[i].classList.remove('show')
    }
  } else {
    againBtn.classList.add('show')
    titleEl.classList.add('show')
    controlsEl.classList.add('hundred')
    pinBtn.classList.add('pinned')
    pinBtn.childNodes[0].innerHTML =
      'UNPIN<br /><span class="symbol">&#9906;</span>'

    for (let i = actives.length - 1; i--; ) {
      actives[i].classList.add('show')
    }
  }
}

function shuffleArt(e) {
  if (e && e.stopPropagation) e.stopPropagation()
  if (intervalID > -1) {
    clearInterval(intervalID)
    intervalID = -1
    shuffleBtn.classList.remove('glow')
    shuffleBtn.innerHTML = 'SHUFFLE<span class="symbol">&#10542;</span>'
  } else {
    shuffleBtn.classList.add('glow')
    shuffleBtn.innerHTML = 'STOP<span class="symbol">&#10539;</span>'
    intervalID = setInterval(randomCall, 15000)
  }
}

pinBtn.addEventListener('click', showControls)
document.getElementById('view').addEventListener('click', showControls)
document.getElementById('another').addEventListener('click', (e) => {
  const call = ++currentCall >= calls.length ? 0 : currentCall++
  return setCall(e, call)
})
document
  .getElementById('random')
  .addEventListener('click', (e) => randomCall(e))
shuffleBtn.addEventListener('click', shuffleArt)
againBtn.addEventListener('click', loadArtClick)

loadArt(currentCall)

calls.forEach((c, i) => {
  const element = document.createElement('button')
  element.appendChild(document.createTextNode(c.name))
  element.addEventListener('click', (e) => setCall(e, i))
  element.classList.add('menu__button')
  if (i === 0) element.classList.add('active')
  const menu = document.getElementById('menu')
  menu.appendChild(element)
  buttons.push(element)
})

window.onload = function () {
  controlsEl.classList.add('loaded')
}

window.addEventListener('resize', loadArt)
