/* eslint-disable no-sparse-arrays */
/* eslint-disable indent */
/* eslint-disable no-unused-expressions */
/* eslint-disable prefer-destructuring */
import { ctx, h, w } from '../utils/canvas'
import { rndmRng, coinflip, shuffle, randomProperty } from '../utils/helpers'

// TODO Draw all rows of same style together
// ... for performance reasons

const rowHeight = 10
const buildingRowH = [
  [
    [23, 15],
    [19, 10],
    [15, 5],
  ],
  [
    [29, 21],
    [25, 16],
    [21, 13],
  ],
  [
    [35, 27],
    [31, 22],
    [27, 17],
  ],
]
let startHue = 0
let buildingRows = 0
const baseHue = (diff) => {
  let hue = startHue + diff < 0 ? 360 + (startHue + diff) : startHue + diff
  hue =
    // eslint-disable-next-line no-nested-ternary
    hue > 80 && hue < 135 ? (135 - hue < 27 ? (hue += 27) : (hue -= 27)) : hue
  return hue
}
let buildingRowC = []
let sunsetColors = []
let oceanColors = []
let layers = []
let buildings = []

ctx.lineWidth = rowHeight
ctx.strokeStyle = '#550000'

const layer = (height, width, x, y, style, row) => ({
  height,
  width,
  x,
  y,
  style,
  row,
})

function addLayer(height, width, x, y, style, row) {
  const l = layer(height, width, x, y, style, row)
  layers.push(l)
}

const building = (start, width, row, ls) => ({
  start,
  width,
  row,
  layers: ls,
})

function randomDimension(max, min) {
  let rnd = Math.floor(Math.random() * (max - min) + min)
  return rnd % 2 === 0 ? ++rnd * rowHeight : rnd * rowHeight
}

function windowPane(x, y, colors, unlit) {
  const [litcolor1, litcolor2, unlitcolor] = [...colors]
  if (Math.random() < unlit) {
    // unlit window
    ctx.strokeStyle = unlitcolor
    ctx.lineTo(x, y)
    ctx.stroke()
    ctx.moveTo(x, y)
  } else {
    ctx.strokeStyle = litcolor1
    ctx.lineTo(x - 5, y)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(x - 5, y)
    ctx.strokeStyle = litcolor2
    ctx.lineTo(x, y)
    ctx.stroke()
    ctx.moveTo(x, y)
  }
}

function windowlessRowAwning(d, x, y, r) {
  ctx.strokeStyle = buildingRowC[r][1]
  ctx.lineTo(d + -1 * rowHeight + x, h - y)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(d + -1 * rowHeight + x, h - y)
  ctx.strokeStyle = buildingRowC[r][2]
  ctx.lineTo(d + x, h - y)
  ctx.stroke()
}

function windowlessRow(d, x, y, color) {
  ctx.strokeStyle = color
  ctx.lineTo(d + x, h - y)
  ctx.stroke()
}

function windowRowDraw(x, y) {
  ctx.lineTo(x, y)
  ctx.stroke()
  ctx.closePath()
  ctx.beginPath()
  ctx.moveTo(x, y)
}

function windowRow(d, x, y, r) {
  for (let j = 1; j <= d / rowHeight; j++) {
    j % 2 !== 0
      ? (ctx.strokeStyle = buildingRowC[r][1])
      : windowPane(
          j * rowHeight + x,
          h - y,
          [buildingRowC[r][3], buildingRowC[r][4], buildingRowC[r][0]],
          0.25,
        )
    windowRowDraw(j * rowHeight + x, h - y)
  }
}

function allWindowRow(d, x, y, r) {
  for (let j = 1; j <= d / rowHeight - 1; j++) {
    j === 1
      ? (ctx.strokeStyle = buildingRowC[r][3])
      : windowPane(
          j * rowHeight + x,
          h - y,
          [buildingRowC[r][4], buildingRowC[r][4], buildingRowC[r][0]],
          0.07,
        )
    windowRowDraw(j * rowHeight + x, h - y)
  }
}

function windowRow2(d, x, y, r) {
  for (let j = 1; j <= d / rowHeight; j++) {
    j % 2 === 0
      ? windowPane(
          j * rowHeight + x,
          h - y,
          [buildingRowC[r][1], buildingRowC[r][3], buildingRowC[r][0]],
          0.25,
        )
      : (ctx.strokeStyle = buildingRowC[r][0])
    windowRowDraw(j * rowHeight + x, h - y)
  }
}

function allWindowRow2(d, x, y, r) {
  for (let j = 1; j <= d / rowHeight; j++) {
    j === 2
      ? (ctx.strokeStyle = buildingRowC[r][1])
      : windowPane(
          j * rowHeight + x,
          h - y,
          [buildingRowC[r][3], buildingRowC[r][3], buildingRowC[r][0]],
          0.07,
        )
    windowRowDraw(j * rowHeight + x, h - y)
  }
}

function draw(l) {
  for (let i = 0; i <= l.height / rowHeight; i++) {
    const y = i * rowHeight + l.y
    ctx.beginPath()
    ctx.moveTo(l.x, h - y)
    l.style(i, l, y)
  }
}

function drawStyle1(i, l, y) {
  i % 2 === 0
    ? windowRow(l.width, l.x, y, l.row)
    : windowlessRow(l.width, l.x, y, buildingRowC[l.row][1])
}

function drawStyle2(i, l, y) {
  i === l.height / rowHeight
    ? windowlessRow(l.width, l.x, y, buildingRowC[l.row][1])
    : windowRow(l.width, l.x, y, l.row)
}

function drawStyle3(i, l, y) {
  i % 2 === 0
    ? allWindowRow(l.width, l.x, y, l.row)
    : windowlessRowAwning(l.width, l.x, y, l.row)
}

function drawStyleSide1(i, l, y) {
  i % 2 === 0
    ? windowRow2(l.width, l.x, y, l.row)
    : windowlessRow(l.width, l.x, y, buildingRowC[l.row][0])
}

function drawStyleSide2(i, l, y) {
  i !== l.height / rowHeight
    ? windowRow2(l.width, l.x, y, l.row)
    : windowlessRow(l.width, l.x, y, buildingRowC[l.row][0])
}

function drawStyleSide3(i, l, y) {
  i % 2 === 0
    ? allWindowRow2(l.width, l.x, y, l.row)
    : windowlessRow(l.width, l.x, y, buildingRowC[l.row][0])
}

function addSide(sideWidth) {
  if (sideWidth < 120) {
    return 30
  }
  if (sideWidth < 170) {
    return 50
  }
  return 70
}

const drawFronts = {
  1: drawStyle1,
  2: drawStyle2,
  3: drawStyle3,
  4: drawStyle1,
  5: drawStyle2,
}

const drawSides = {
  1: drawStyleSide1,
  2: drawStyleSide2,
  3: drawStyleSide3,
  4: drawStyleSide1,
  5: drawStyleSide2,
}

const levelCreate = function (hd, w, x, y, st) {
  // testjpf unexpected width behavior
  // global or local scoped only, both break
  const ht = randomDimension(hd[0], hd[1])
  let style = randomProperty(drawSides)
  const side = addSide(w)

  addLayer(ht, side, x - side, y, style, buildingRows)

  const temp = randomProperty(drawFronts)
  style = style === drawStyleSide3 && temp !== drawStyle3 ? drawStyle3 : temp

  addLayer(ht, w, x, y, style, buildingRows)

  return { ht, w, side, x, y }
}

function addTower(l) {
  const width = randomDimension(3, 1)
  const height = randomDimension(12, 5)
  const x = l.x + l.width / 2 - rndmRng(60, 20)
  const towerX = x + rndmRng(width, rowHeight * 2)

  ctx.beginPath()
  ctx.strokeStyle = buildingRowC[l.row][0]
  ctx.moveTo(x, h - l.y - l.height - rowHeight)
  ctx.lineTo(x + rowHeight, h - l.y - l.height - rowHeight)
  ctx.stroke()
  ctx.beginPath()
  ctx.strokeStyle = buildingRowC[l.row][1]
  ctx.moveTo(x + rowHeight, h - l.y - l.height - rowHeight)
  ctx.lineTo(x + rowHeight + width, h - l.y - l.height - rowHeight)
  ctx.stroke()
  ctx.beginPath()
  ctx.strokeStyle = buildingRowC[l.row][2]
  ctx.moveTo(x + rowHeight + width, h - l.y - l.height - rowHeight)
  ctx.lineTo(x + rowHeight * 2 + width, h - l.y - l.height - rowHeight)
  ctx.stroke()

  ctx.lineWidth = rowHeight / 2
  ctx.beginPath()
  ctx.strokeStyle = buildingRowC[l.row][1]
  ctx.moveTo(towerX, h - l.y - l.height - rowHeight - 5)
  ctx.lineTo(towerX, h - l.y - l.height - rowHeight - height)
  ctx.stroke()
  ctx.beginPath()
  ctx.strokeStyle = buildingRowC[l.row][0]
  ctx.moveTo(towerX, h - l.y - l.height - rowHeight - height)
  ctx.lineTo(towerX, h - l.y - l.height - rowHeight * 2 - height)
  ctx.stroke()
  ctx.lineWidth = rowHeight
}

function addBuilding(s, row) {
  layers = []
  const buildingWidth = randomDimension(20, 9)
  const lvl = 0
  const x = s - buildingWidth
  startingX = s - buildingWidth

  let priorLevel = levelCreate(
    buildingRowH[buildingRows][0],
    buildingWidth,
    x,
    0,
  )
  if (
    priorLevel.side === 70 &&
    priorLevel.ht < buildingRowH[buildingRows][0][0] * 8.9
  ) {
    const width = coinflip(130, 150)
    priorLevel = levelCreate(
      buildingRowH[buildingRows][1],
      width,
      (priorLevel.w - width) / 2 +
        priorLevel.x -
        10 +
        Math.floor(Math.random() * (15 - -20) + -20),
      priorLevel.y + priorLevel.ht + rowHeight,
    )
  }

  if (
    priorLevel.side === 50 &&
    priorLevel.ht < buildingRowH[buildingRows][0][0] * 8.8
  ) {
    const width = coinflip(90, 110)
    priorLevel = levelCreate(
      buildingRowH[buildingRows][2],
      width,
      (priorLevel.w - width) / 2 +
        priorLevel.x -
        10 +
        Math.floor(Math.random() * (15 - -20) + -20),
      priorLevel.y + priorLevel.ht + rowHeight,
    )
  }

  addLayer(
    priorLevel.ht,
    priorLevel.w,
    priorLevel.x,
    priorLevel.y,
    addTower,
    buildingRows,
  )

  const b = building(s, buildingWidth, row, layers)
  buildings.push(b)
}

function sunset() {
  let y = 0
  let height = h * 0.0
  const solids = [0, 2, 4, 6, 8, 10]
  const sizeLottery = shuffle(solids)

  for (let i = 0; i <= 10; i++) {
    if (i === sizeLottery[0]) {
      height = h * 0.05
    } else if (i === sizeLottery[1]) {
      height = h * 0.3
    } else {
      height = h * 0.1
    }
    if (i % 2 === 0) {
      ctx.fillStyle = sunsetColors[i / 2]
      ctx.rect(0, y, w, Math.round(height))
      ctx.fill()
      ctx.beginPath()
      y += Math.round(height)
    } else {
      ctx.fillStyle = sunsetColors[Math.round(i / 2)]
      ctx.rect(0, y, w, Math.round(h * 0.005))
      ctx.fill()
      ctx.beginPath()
      y += Math.round(h * 0.005)

      ctx.fillStyle = sunsetColors[Math.round(i / 2) - 1]
      ctx.rect(0, y, w, Math.round(h * 0.015))
      ctx.fill()
      ctx.beginPath()
      y += Math.round(h * 0.015)

      ctx.fillStyle = sunsetColors[Math.round(i / 2)]
      ctx.rect(0, y, w, Math.round(h * 0.005))
      ctx.fill()
      ctx.beginPath()
      y += Math.round(h * 0.005)

      ctx.fillStyle = sunsetColors[Math.round(i / 2) - 1]
      ctx.rect(0, y, w, Math.round(h * 0.005))
      ctx.fill()
      ctx.beginPath()
      y += Math.round(h * 0.005)

      ctx.fillStyle = sunsetColors[Math.round(i / 2)]
      ctx.rect(0, y, w, Math.round(h * 0.015))
      ctx.fill()
      ctx.beginPath()
      y += Math.round(h * 0.015)

      ctx.fillStyle = sunsetColors[Math.round(i / 2) - 1]
      ctx.rect(0, y, w, Math.round(h * 0.005))
      ctx.fill()
      ctx.beginPath()
      y += Math.round(h * 0.005)
    }
  }
}

function star1(x, y) {
  ctx.strokeStyle = buildingRowC[2][4]
  ctx.moveTo(x, y)
  ctx.lineTo(x + rowHeight / 2, y)
  ctx.stroke()
  ctx.beginPath()
}

function star2(x, y) {
  ctx.strokeStyle = buildingRowC[1][4]
  ctx.moveTo(x, y)
  ctx.lineTo(x + rowHeight / 2, y)
  ctx.stroke()
  ctx.beginPath()
}

function star3(x, y) {
  ctx.strokeStyle = buildingRowC[1][4]
  ctx.moveTo(x - (rowHeight / 2) * 2, y)
  ctx.lineTo(x + (rowHeight / 2) * 2, y)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(x, y - (rowHeight / 2) * 2)
  ctx.lineTo(x, y + (rowHeight / 2) * 2)
  ctx.stroke()
  ctx.beginPath()

  ctx.moveTo(x - rowHeight / 2, y - rowHeight / 2)
  ctx.lineTo(x + rowHeight / 2, y - rowHeight / 2)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(x - rowHeight / 2, y + rowHeight / 2)
  ctx.lineTo(x + rowHeight / 2, y + rowHeight / 2)
  ctx.stroke()
  ctx.beginPath()

  ctx.strokeStyle = buildingRowC[2][4]
  ctx.moveTo(x - rowHeight / 2, y)
  ctx.lineTo(x + rowHeight / 2, y)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(x, y - rowHeight / 2)
  ctx.lineTo(x, y + rowHeight / 2)
  ctx.stroke()
  ctx.beginPath()
}

function star4(x, y) {
  ctx.strokeStyle = buildingRowC[1][4]
  ctx.moveTo(x - (rowHeight * 9) / 2, y)
  ctx.lineTo(x + (rowHeight * 9) / 2, y)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(x, y - (rowHeight * 9) / 2)
  ctx.lineTo(x, y + (rowHeight * 9) / 2)
  ctx.stroke()
  ctx.beginPath()

  ctx.moveTo(x - (rowHeight * 5) / 2, y - rowHeight / 2)
  ctx.lineTo(x + (rowHeight * 5) / 2, y - rowHeight / 2)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(x - (rowHeight * 5) / 2, y + rowHeight / 2)
  ctx.lineTo(x + (rowHeight * 5) / 2, y + rowHeight / 2)
  ctx.stroke()
  ctx.beginPath()

  ctx.moveTo(x - (rowHeight * 2) / 2, y - (rowHeight * 2) / 2)
  ctx.lineTo(x + (rowHeight * 2) / 2, y - (rowHeight * 2) / 2)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(x - (rowHeight * 2) / 2, y + (rowHeight * 2) / 2)
  ctx.lineTo(x + (rowHeight * 2) / 2, y + (rowHeight * 2) / 2)
  ctx.stroke()
  ctx.beginPath()

  ctx.strokeStyle = buildingRowC[2][4]
  ctx.moveTo(x - (rowHeight * 5) / 2, y)
  ctx.lineTo(x + (rowHeight * 5) / 2, y)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(x, y - (rowHeight * 5) / 2)
  ctx.lineTo(x, y + (rowHeight * 5) / 2)
  ctx.stroke()
  ctx.beginPath()

  ctx.moveTo(x - rowHeight / 2, y - rowHeight / 2)
  ctx.lineTo(x + rowHeight / 2, y - rowHeight / 2)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(x - rowHeight / 2, y + rowHeight / 2)
  ctx.lineTo(x + rowHeight / 2, y + rowHeight / 2)
  ctx.stroke()
  ctx.beginPath()
}

const drawStars = {
  1: star1,
  2: star2,
  3: star3,
  4: star4,
}

function stars() {
  ctx.lineWidth = 5
  const amount = Math.round((w * h) / 40000)

  for (let i = 0; i < amount; i++) {
    const x = rndmRng(w - 30, 30)
    const y = Math.round(rndmRng(h / 2 - 30, 30))
    const star = randomProperty(drawStars)
    star(x, y)
  }
  ctx.lineWidth = rowHeight
}

function oceanLayer(x, y, colors, d) {
  while (x <= w + rowHeight) {
    if (Math.random() < d) {
      ctx.strokeStyle = colors[0]
    } else {
      ctx.strokeStyle = colors[1]
    }

    ctx.lineTo(x, y)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(x, y)
    x += rowHeight
  }
  ctx.beginPath()
}

function ocean() {
  let x = Math.floor(w * 0.7)
  let y = h - 20 * rowHeight
  ctx.moveTo(x, y)
  let diff = 1
  let count = 50
  let color = 4

  while (y < h) {
    if (count % 10 === 0) {
      color = count / 10 - 1
      diff = 1
    }

    oceanLayer(x, y, [oceanColors[color], oceanColors[color - 1]], diff)

    x = Math.floor(w * 0.7)
    y += rowHeight / 2
    diff -= 0.125
    count--
  }
}

let startingX = Math.floor(w * 0.75)
function buildingRow() {
  while (buildingRows >= 0) {
    while (startingX > 0) {
      addBuilding(startingX, buildingRows)
      startingX -= Math.floor(Math.random() * (100 - 10) + 10)
    }
    startingX = Math.floor(w * 0.75)
    buildingRows--
  }
}

export function loadCity() {
  startHue = Math.round(rndmRng(360, 0))
  buildingRowC = [
    [
      `hsla(${baseHue(-40)}, 66%, 28%, 1)`,
      `hsla(${baseHue(-23)}, 61%, 40%, 1)`,
      `hsla(${baseHue(-12)}, 58%, 53%, 1)`,
      `hsla(${baseHue(0)}, 76%, 65%, 1)`,
      `hsla(${baseHue(-345)}, 85%, 70%, 1)`,
    ],
    [
      `hsla(${baseHue(-12)}, 58%, 53%, 1)`,
      `hsla(${baseHue(0)}, 76%, 65%, 1)`,
      `hsla(${baseHue(-345)}, 85%, 70%, 1)`,
      `hsla(${baseHue(-345)}, 85%, 70%, 1)`,
      `hsla(${baseHue(-332)}, 100%, 74%, 1)`,
    ],
    [
      `hsla(${baseHue(-332)}, 100%, 74%, 1)`,
      `hsla(${baseHue(-332)}, 100%, 74%, 1)`,
      `hsla(${baseHue(-332)}, 100%, 74%, 1)`,
      `hsla(${baseHue(-307)}, 95%, 77%, 1)`,
      `hsla(${baseHue(-307)}, 95%, 77%, 1)`,
    ],
  ]
  sunsetColors = [
    buildingRowC[0][2],
    buildingRowC[0][3],
    buildingRowC[0][4],
    buildingRowC[1][4],
    `hsla(${baseHue(-325)}, 90%, 77%, 1)`,
    buildingRowC[2][4],
  ]
  oceanColors = [
    buildingRowC[0][1],
    buildingRowC[0][2],
    buildingRowC[0][3],
    buildingRowC[0][4],
    buildingRowC[1][4],
    sunsetColors[4],
  ]
  ;(layers = []), (buildings = [])
  buildingRows = 2

  const gradient = ctx.createLinearGradient(w / 2, 0, w / 2, h)
  gradient.addColorStop(0.05, buildingRowC[0][2])
  gradient.addColorStop(0.1, `hsla(${baseHue(-358)}, 78%, 66%, 1)`)
  gradient.addColorStop(0.4, `hsla(${baseHue(-358)}, 78%, 66%, 1)`)
  gradient.addColorStop(0.45, buildingRowC[0][4])
  gradient.addColorStop(0.55, buildingRowC[0][4])
  gradient.addColorStop(0.6, buildingRowC[1][4])
  gradient.addColorStop(0.7, buildingRowC[1][4])
  gradient.addColorStop(0.75, sunsetColors[4])
  gradient.addColorStop(0.75, sunsetColors[4])
  gradient.addColorStop(0.85, sunsetColors[4])
  gradient.addColorStop(0.9, buildingRowC[2][4])

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, w, h)

  sunset()
  stars()
  ocean()

  buildingRow(buildingRows)

  buildings.forEach((building) => {
    building.layers.forEach((layer) => {
      layer.style === addTower ? layer.style(layer) : draw(layer)
    })
  })
}
