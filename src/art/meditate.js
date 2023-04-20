/* eslint-disable indent */
import { ctx, h, w, setDashedLines } from '../utils/canvas'
import { rndmRng, shuffle, coinflip } from '../utils/helpers'

let p1 = {}
let p2 = {}
let sunColors = {}
let meteors = []
let stripes = []
let dashArray = [0, 0]
const red = {
  drips: '#9F1A14',
  meteor: '132, 68, 34',
  main: {
    grd: ['#Ffdfd8', '#E3D8D1', '#dfccc0'],
    sun: '#DA2E20',
    bursts: ['227, 216, 209', '218, 46, 32'],
  },
}
const blue = {
  drips: '#141A9f',
  meteor: '34, 68, 132',
  main: {
    grd: ['#d8dfff', '#d1D8e3', '#c0ccdf'],
    sun: '#202Eda',
    bursts: ['209, 216, 227', '32, 46, 218'],
  },
}

function drawSpeck(x, y) {
  ctx.beginPath()
  ctx.moveTo(Math.round(x), Math.round(y))
  ctx.lineTo(Math.round(x + rndmRng(5, 1)), Math.round(y + rndmRng(5, 1)))
  ctx.stroke()
}

function dirt() {
  const spots = Math.round((h * w) / 1300)
  ctx.strokeStyle = '#161211'
  for (let s = spots; s--; ) {
    drawSpeck(rndmRng(w, 0), rndmRng(h, p1.y))
    drawSpeck(rndmRng(w, 0), rndmRng(p1.y * 1.2, p1.y))
  }
}

function bursts(x, y, size, color) {
  for (let i = 0; i < size * 1.8; i++) {
    ctx.beginPath()
    ctx.strokeStyle = `rgba(${color}, ${rndmRng(1, 0.5)})`
    ctx.lineWidth = rndmRng(5, 1)
    const modX = rndmRng(2, 1)
    const modY = rndmRng(2, 1)
    const dotX = Math.round(rndmRng(x + size / modX, x - size / modX))
    const dotY = Math.round(rndmRng(y + size / modY, y - size / modY))
    ctx.moveTo(dotX, dotY)
    ctx.lineTo(dotX + rndmRng(-1, -5), dotY + rndmRng(-1, -5))
    ctx.stroke()
  }
}

function splatterPoints(ox, oy, layers) {
  setDashedLines()
  for (let m = 1; m <= layers; m++) {
    let x = ox + rndmRng(10 * m, 5 * m)
    let y = oy + rndmRng(-5 * m, -10 * m)
    drawSpeck(x, y)

    x = ox + rndmRng(-5 * m, -10 * m)
    y = oy + rndmRng(-5 * m, -10 * m)
    drawSpeck(x, y)

    x = ox + rndmRng(-5 * m, -10 * m)
    y = oy + rndmRng(10 * m, 5 * m)
    drawSpeck(x, y)

    x = ox + rndmRng(10 * m, 5 * m)
    y = oy + rndmRng(10 * m, 5 * m)
    drawSpeck(x, y)
  }
}

function curvedLine(newX, newY, endX, splat) {
  let counter = 0
  let x = newX
  const startX = newX
  const height = rndmRng(20, 5)
  let increase = ((90 / 180) * Math.PI) / rndmRng(1.8, 1)
  const startY = newY
  let y = startY
  let splatter = Math.round(rndmRng(2, 1))

  for (let i = startX; i <= endX; i += dashArray[0] + dashArray[1]) {
    dashArray = setDashedLines()
    ctx.beginPath()
    ctx.moveTo(x, y)
    increase = ((90 / 180) * Math.PI) / rndmRng(6, 4)
    x = i + dashArray[0] + dashArray[1]
    y = startY - Math.sin(counter) * height
    counter += increase
    ctx.lineTo(x, y)
    ctx.stroke()
    splatter = Math.round(rndmRng(2, 0))
    if (splat) splatterPoints(x, y, splatter)
  }
}

function points(x, y, r) {
  const edge = w > h ? w / 1.8 : h / 1.8
  const lines = Math.round(r / rndmRng(12, 8))

  for (let i = 0; i < lines; i++) {
    ctx.strokeStyle = `rgba(93, 78, 68, ${rndmRng(0.2, 0.1)})`
    setDashedLines()
    const x1 = Math.round(x + r * Math.cos((2 * Math.PI * i) / lines))
    const y1 = Math.round(y + r * Math.sin((2 * Math.PI * i) / lines))
    const x2 = Math.round(
      x + edge * rndmRng(1, 0.4) * Math.cos((2 * Math.PI * i) / lines),
    )
    const y2 = Math.round(
      y + edge * rndmRng(1, 0.4) * Math.sin((2 * Math.PI * i) / lines),
    )

    const curvedLineArgs =
      p1.x < w * 0.5 ? [x1, y1, x2, true] : [x2, y1, x1, true]

    curvedLine(...curvedLineArgs)
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
  }
}

function drips() {
  let count = 0
  let x = rndmRng(30, -30)
  const step = Math.round(rndmRng(w * 0.06, w * 0.03))
  let short = Math.round(h * rndmRng(0.49, 0.1))
  let mod = 1

  const vary = coinflip(true, false)
  const color = coinflip(red.drips, blue.drips)
  ctx.strokeStyle = color

  while (x < w) {
    setDashedLines()
    ctx.strokeStyle = vary ? coinflip(red.drips, blue.drips) : color
    ctx.fillStyle = ctx.strokeStyle
    ctx.lineWidth = Math.round(rndmRng(4, 2))
    ctx.beginPath()
    ctx.moveTo(x, 0)
    const height = count % 2 === 0 ? h : short
    ctx.lineTo(x, height)
    ctx.stroke()
    if (count % 2 !== 0) {
      ctx.beginPath()
      ctx.arc(x, short, rndmRng(8, 3), 0, Math.PI * 2)
      ctx.fill()
    }
    if (count % 2 === 0 && Math.random() > 0.3) {
      const rings = Math.round(rndmRng(10, 1))
      const y = rndmRng(h * 0.5, 0)
      ctx.strokeStyle = '#161211'
      ctx.fillStyle = '#E3D8D1'
      for (let i = rings; i--; ) {
        if (Math.random() > 0.4) setDashedLines()
        ctx.lineWidth = Math.round(rndmRng(7, 3))
        ctx.beginPath()
        ctx.arc(
          Math.round(x + rndmRng(h * 0.03, -h * 0.03)),
          Math.round(y + rndmRng(h * 0.04, -h * 0.04)),
          Math.round(rndmRng(h * 0.015, h * 0.007)),
          0,
          2 * Math.PI,
        )
        ctx.stroke()
        if (Math.random() > 0.5) ctx.fill()
      }
    }
    x += step
    count++
    short += Math.round(rndmRng(h * 0.05, h * 0.005) * mod)
    if (short > h * 0.55) mod = -1
    if (short < h * 0.05) mod = 1
  }
}

function drawMeteor(m) {
  ctx.fillStyle = '#E3D8D1'
  points(m.x, m.y, m.r)
  ctx.beginPath()
  ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2)
  ctx.fill()
  let reach = rndmRng(4, 0)
  const vary = coinflip(true, false)
  const color = coinflip(red.meteor, blue.meteor)
  ctx.strokeStyle = `rgba(${color}, ${rndmRng(1, 0.5)})`
  for (let j = 1.5; j > 0.5; j -= 0.05) {
    // eslint-disable-next-line no-unused-expressions
    vary
      ? (ctx.strokeStyle = `rgba(${coinflip(
          red.meteor,
          blue.meteor,
        )}, ${rndmRng(1, 0.5)})`)
      : `rgba(${color}, ${rndmRng(1, 0.5)})`
    const newX = Math.round(m.r * Math.cos(Math.PI * j) + m.x)
    const newY = Math.round(m.r * Math.sin(Math.PI * j) + m.y)
    const endX = Math.round(m.r * Math.cos(Math.PI * (j + reach * 0.05)) + m.x)

    ctx.beginPath()
    curvedLine(newX, newY, endX, false)
    reach += rndmRng(2.3, 1.7)
  }
}

function drawStalk(x, y, nh, set) {
  ctx.shadowOffsetX = set
  ctx.lineWidth = Math.round(rndmRng(10, 6))
  ctx.beginPath()
  ctx.moveTo(x, y)
  ctx.lineTo(x + rndmRng(20, -20), y + nh)
  ctx.stroke()
  ctx.shadowOffsetX = 0
  ctx.lineWidth = Math.round(rndmRng(17, 10))
  ctx.beginPath()
  ctx.moveTo(x, y)
  ctx.lineTo(x, y + nh / rndmRng(6, 1.5))
  ctx.stroke()
  ctx.lineWidth = Math.round(rndmRng(11, 7))
  ctx.beginPath()
  ctx.moveTo(x, y + nh)
  ctx.lineTo(x, y + nh - nh / rndmRng(15, 10))
  ctx.stroke()
}

function createFields(x, stalks, mod) {
  let { y } = p1
  let height = rndmRng(30, 5)
  const maxHeight = rndmRng(h * 0.5, h * 0.36)
  const minHeight = rndmRng(h * 0.35, h * 0.21)
  let oldHeight = 0
  let newHeight = Math.round(rndmRng(height * 1.21, height * 1.09))
  let grow = true
  let count = 0

  ctx.strokeStyle = '#21110F'
  ctx.shadowColor = '#FFF'

  for (let i = stalks; i--; ) {
    drawStalk(Math.round(x), Math.round(y), newHeight, -3 * mod)
    // eslint-disable-next-line no-param-reassign
    x -= rndmRng(8, -1) * mod
    oldHeight = height
    height = newHeight

    if (height > maxHeight && grow === true) {
      grow = false
      count = Math.round(rndmRng(100, 15))
      height = maxHeight
    } else if (height < minHeight && grow === false) {
      grow = true
      count = Math.round(rndmRng(100, 15))
      height = minHeight
    } else if (height < minHeight && grow === true) height *= 1.04

    if (count > 0) {
      newHeight = rndmRng(oldHeight * 1.03, oldHeight * 0.97)
      count--
    } else {
      newHeight =
        grow === false
          ? rndmRng(height * 1.005, height * 0.98)
          : rndmRng(height * 1.05, height * 0.995)
    }

    y -= Math.round((newHeight - oldHeight) / 3)
  }
}

function drawStripe(s) {
  ctx.beginPath()
  ctx.moveTo(s[0].x, s[0].y)
  ctx.lineTo(s[1].x, s[1].y)

  setDashedLines()
  ctx.lineWidth = rndmRng(20, 10)
  ctx.strokeStyle = coinflip(
    `rgba(14, 43, 118, ${rndmRng(1, 0.4)})`,
    `rgba(151, 17, 17, ${rndmRng(1, 0.4)})`,
  )
  ctx.stroke()
}

function createStripes() {
  const cols = Math.round(rndmRng(w * 0.4, w * 0.2) / 80)
  const rows = Math.round(rndmRng(h * 0.4, h * 0.2) / 60)
  const { x } = p2
  const y = Math.round(p2.y + h * 0.05)

  for (let i = cols; i--; ) {
    stripes.push([
      { x: x + i * rndmRng(40, 25), y: 0 },
      { x: x + i * rndmRng(40, 25), y: h },
    ])
  }
  for (let i = rows; i--; ) {
    stripes.push([
      { x: 0, y: y + i * rndmRng(40, 25) },
      { x: w, y: y + i * rndmRng(40, 25) },
    ])
  }
}

function createMeteors(n) {
  for (let i = n; i--; ) {
    const x = rndmRng(w, 0)
    const y = Math.round(rndmRng(h * 0.5, 0))
    const r = Math.round(rndmRng(h * 0.16, h * 0.07))
    meteors.push({ x, y, r })
  }
}

function generateNoise() {
  const squares = Math.round(Math.round((h * w) / (h * 0.09 * (w * 0.09))))
  let x
  let y = 0
  let n = Math.floor(rndmRng(256, 51))
  let count = 1

  ctx.fillStyle =
    sunColors.sun === '#DA2E20'
      ? `rgba(${n}, ${n - 25},${n - 50}, 0.${Math.round(rndmRng(2, 1))}`
      : `rgba(${n - 50}, ${n - 25},${n}, 0.${Math.round(rndmRng(2, 1))}`
  ctx.filter = `brightness(${Math.round(count)}) saturate(${Math.round(
    count / 2,
  )})`

  for (y = h; y > -squares; y -= squares) {
    for (x = 0; x < w; x += squares) {
      if (Math.random() > 0.7) {
        count += squares * 0.0005
        n = Math.floor(rndmRng(256, 51))
        if (Math.random() > 0.5) {
          ctx.fillStyle =
            sunColors.sun === '#DA2E20'
              ? `rgba(${n}, ${n - 25},${n - 50}, 0.${Math.round(rndmRng(2, 1))}`
              : `rgba(${n - 50}, ${n - 25},${n}, 0.${Math.round(rndmRng(2, 1))}`
        }
        if (Math.random() > 0.7) {
          ctx.filter = `brightness(${Math.round(count)}) saturate(${Math.round(
            count / 2,
          )})`
        }
        ctx.fillRect(Math.round(x), Math.round(y), squares, squares)
      }
    }
  }
  ctx.filter = 'none'
}

export default function loadMeditations() {
  // eslint-disable-next-line no-unused-expressions, no-sequences, no-extra-semi
  ;(meteors = []), (stripes = [])

  p1 = {
    x: Math.round(rndmRng(w * 0.6, w * 0.3)),
    y: Math.round(rndmRng(h * 0.6, h * 0.7)),
  }
  p2 =
    p1.x < w * 0.5
      ? {
          x: Math.round(rndmRng(w * 0.63, w * 0.75)),
          y: Math.round(rndmRng(h * 0.65, h * 0.77)),
        }
      : {
          x: Math.round(rndmRng(w * -0.02, w * 0.15)),
          y: Math.round(rndmRng(h * 0.65, h * 0.77)),
        }

  sunColors = coinflip(red.main, blue.main)

  // sky
  let grd = ctx.createRadialGradient(
    p1.x,
    p1.y,
    Math.round(h * rndmRng(0.4, 0.01)),
    p1.x,
    p1.y,
    Math.round(h * rndmRng(0.99, 0.96)),
  )
  grd.addColorStop(rndmRng(0.4, 0), sunColors.grd[0])
  grd.addColorStop(rndmRng(0.9, 0.6), sunColors.grd[1])
  grd.addColorStop(1, sunColors.grd[2])
  ctx.fillStyle = grd
  ctx.fillRect(0, 0, w, p1.y)

  // arrays of meteors
  const avgSize = Math.round(((h / 2) * w) / 75000)
  createMeteors(Math.round(rndmRng(avgSize * 0.33, avgSize * 0.15)))
  meteors = shuffle(meteors)
  const threePartIndex = Math.ceil(meteors.length / 3)
  const meteors3 = meteors.splice(-threePartIndex)
  const meteors2 = meteors.splice(-threePartIndex)
  const meteors1 = meteors

  meteors1.forEach((m) => {
    drawMeteor(m)
  })

  drips()

  meteors2.forEach((m) => {
    drawMeteor(m)
  })

  // sun
  ctx.fillStyle = sunColors.sun
  const size = Math.round(rndmRng(h * 0.34, h * 0.19))
  ctx.beginPath()
  ctx.arc(
    Math.round(p1.x * 1.05),
    Math.round(p1.y * 0.85),
    size,
    0,
    Math.PI * 2,
  )
  ctx.fill()
  bursts(p1.x * 1.05, p1.y * 0.85, size, sunColors.bursts[0])

  // ground
  grd = ctx.createRadialGradient(
    p1.x,
    p1.y,
    h * rndmRng(0.4, 0.01),
    p1.x,
    p1.y,
    h * rndmRng(0.99, 0.6),
  )
  grd.addColorStop(rndmRng(0.25, 0), sunColors.grd[0])
  grd.addColorStop(rndmRng(0.4, 0.7), sunColors.grd[1])
  grd.addColorStop(rndmRng(1, 0.85), sunColors.grd[2])
  ctx.fillStyle = grd
  ctx.fillRect(0, p1.y, w, Math.round(h * 0.4))
  dirt()
  ctx.fillStyle = '#DA2E20'
  bursts(p1.x * 1.2, p1.y * 1.16, Math.round(size / 2), sunColors.bursts[1])

  // stripe arrays
  createStripes()
  stripes = shuffle(stripes)
  const middleIndex = Math.ceil(stripes.length / 2)
  const stripes1 = stripes.slice().splice(0, middleIndex)
  const stripes2 = stripes.slice().splice(-middleIndex)

  stripes1.forEach((s) => {
    drawStripe(s)
  })

  generateNoise()

  meteors3.forEach((m) => {
    drawMeteor(m)
  })

  // left field
  createFields(p1.x * 0.99, Math.round(p1.x * 0.99), 1)
  // right field
  createFields(p1.x * 1.01, Math.round(w - p1.x * 1.01), -1)

  bursts(p1.x * 1.05, p1.y * 1.05, size / 4, sunColors.bursts[1])

  stripes2.forEach((s) => {
    drawStripe(s)
  })
}
