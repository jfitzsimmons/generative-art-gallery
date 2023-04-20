import { ctx, h, w } from '../utils/canvas'
import { rndmRng, shuffle, flatten } from '../utils/helpers'

const fallColors = [354, 29, 53, 65, 35]
let btmW = 0
let topW = 0
let offset = 0
let stumpH = 0
let branchH = 0
let treeCenter = {}
let branchLayer = []
let treePoints = []
let stumps = []

function buildBranch(start, layer) {
  const temp = layer === 0 ? 1 : layer
  for (let i = 2; i--; ) {
    const newBranchH = rndmRng(branchH * 1.2, branchH * 0.8)
    const newX = Math.round(
      Math.cos((rndmRng(80, 35) * Math.PI) / 180) * newBranchH,
    )
    const newY = Math.round(Math.sin((newBranchH * Math.PI) / 180) * newBranchH)
    const flip = i === 1 ? -1 : 1
    const adjust = Math.abs((start.x + (newX * flip) / 3 - treeCenter.x) / temp)
    const bc = {
      x:
        i === 1
          ? Math.round(start.x - topW / 4)
          : Math.round(start.x + topW / 4),
      y: start.y,
    }
    const tc = {
      x:
        i === 1
          ? Math.round(start.x - topW / 4 - newX)
          : Math.round(start.x + topW / 4 + newX),
      y: start.y - newY + adjust,
    }
    const angle = (Math.atan2(bc.y - tc.y, bc.x - tc.x) * 180) / Math.PI

    treePoints.push({
      layer,
      tl: {
        x: Math.round(
          tc.x - (topW / 4) * Math.cos(((-90 + angle) * Math.PI) / 180),
        ),
        y: Math.round(
          tc.y - (topW / 4) * Math.sin(((-90 + angle) * Math.PI) / 180),
        ),
      },
      tr: {
        x: Math.round(
          tc.x - (topW / 4) * Math.cos(((90 + angle) * Math.PI) / 180),
        ),
        y: Math.round(
          tc.y - (topW / 4) * Math.sin(((90 + angle) * Math.PI) / 180),
        ),
      },
      tc,
      bl: {
        x: Math.round(
          bc.x - (btmW / 4) * Math.cos(((-90 + angle) * Math.PI) / 180),
        ),
        y: Math.round(
          bc.y - (btmW / 4) * Math.sin(((-90 + angle) * Math.PI) / 180),
        ),
      },
      br: {
        x: Math.round(
          bc.x - (btmW / 4) * Math.cos(((90 + angle) * Math.PI) / 180),
        ),
        y: Math.round(
          bc.y - (btmW / 4) * Math.sin(((90 + angle) * Math.PI) / 180),
        ),
      },
      bc,
      topW,
    })
  }
}

function drawLeaves(x, y, c, l, s, a, r) {
  const repeat = rndmRng(0.9, 0.4)
  const amount = a
  ctx.fillStyle = `hsla(${Math.round(
    rndmRng(s.fallColor + 5, s.fallColor - 5),
  )},${rndmRng(60, 30)}%, ${rndmRng(c + 5, c - 5)}%, .9)`
  for (let i = amount; i--; ) {
    const size = Math.round(
      rndmRng(14 - (s.layer + l / 2.2), 8 - (s.layer + l / 2.2)),
    )
    ctx.beginPath()
    ctx.arc(rndmRng(x + r, x - r), rndmRng(y + r, y - r), size, 0, Math.PI * 2)
    if (Math.random() > repeat) {
      ctx.fillStyle = `hsla(${
        Math.random() > s.colorChange
          ? Math.round(rndmRng(s.fallColor + 5, s.fallColor - 5))
          : 125
      }, 
                ${rndmRng(60, 30)}%, ${rndmRng(c + 5, c - 5)}%, .9)`
    } else {
      ctx.fill()
    }
  }
}

function drawBranch(b, i, s) {
  const found = treePoints.find((e) => Math.abs(e.tc.x - b.bc.x) === b.topW / 4)
  let baseColor = found ? found.baseColor : 20 + s.layer * 2
  baseColor *= 0.6 + Math.sqrt(b.layer) * 0.4 + Math.sqrt(s.layer) * 0.04
  const order = 2 ** (b.layer + 1)
  let min = i - order * 1.4
  min = min < 0 ? Math.sqrt(Math.abs(min)) * -1 : Math.sqrt(min)
  baseColor -= Math.round(min) * 2
  if (baseColor < 5) baseColor = 5
  if (baseColor > 95) baseColor = 95

  ctx.fillStyle = `hsla(348, 7%, ${baseColor}%, 1)`
  ctx.beginPath()
  ctx.moveTo(b.bl.x, b.bl.y)
  ctx.lineTo(b.br.x, b.br.y)
  ctx.lineTo(b.tr.x, b.tr.y)
  ctx.lineTo(b.tl.x, b.tl.y)
  ctx.lineTo(b.bl.x, b.bl.y)
  ctx.fill()

  const xBox = Math.round((b.bc.x + b.tc.x) / 2)
  const yBox = Math.round((b.bc.y + b.tc.y) / 2)

  const amount = Math.round(rndmRng(s.sparse[1], s.sparse[0]))
  drawLeaves(xBox, yBox, baseColor, b.layer, s, amount, 25)

  return baseColor
}

function drawBackground() {
  let gradient = ctx.createLinearGradient(w / 2, h, w / 2, 0)
  gradient.addColorStop(0, 'rgba(54,19,5,1)')
  gradient.addColorStop(1, 'rgba(169,102,30,1)')

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, w, h)

  gradient = ctx.createLinearGradient(w, 0, 0, h)
  gradient.addColorStop(0, 'rgba(255,250,190,.6)')
  gradient.addColorStop(0.6, 'rgba(210,180,115,.1)')
  gradient.addColorStop(1, 'rgba(160,100,35,0.3)')

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, w, h)
}

export default function loadTrees() {
  let y = h + h * 0.1
  stumps = []
  let sLayer = 0

  drawBackground()

  while (y > h * 0.25) {
    let x = Math.round(rndmRng(60, -300) * (1 - sLayer * 0.05))

    while (x < w) {
      y -= Math.round(rndmRng(h * 0.077, h * -0.053) * (1 - sLayer * 0.035))
      stumps.push({
        x,
        y,
        layer: sLayer,
        sparse: [rndmRng(9, 0), rndmRng(9, 0)].sort(),
        fallColor: fallColors[Math.round(rndmRng(fallColors.length - 1, 0))],
        colorChange: Math.random(),
      })
      x += rndmRng(550, 250) * (1 - sLayer * 0.12)
    }

    y -= Math.round(rndmRng(h * 0.25, h * 0.18) * (1 - sLayer * 0.1))
    sLayer++
  }

  stumps.sort((a, b) => parseInt(a.y, 10) - parseInt(b.y, 10))

  // Shadows
  ctx.beginPath()
  ctx.moveTo(0, stumps[0].y - 50)
  sLayer = stumps[0].layer
  ctx.fillStyle = 'rgba(10,10,0,.1)'

  stumps.forEach((s, i) => {
    if (i % 2 === 0) {
      if (s.layer !== sLayer) {
        sLayer--
        ctx.lineTo(w + 200, s.y - 50)
        ctx.lineTo(w + 200, h + 200)
        ctx.lineTo(-200, h + 200)
        ctx.lineTo(0, 0)
        ctx.fill()
        ctx.beginPath()
        ctx.moveTo(0, s.y)
      }
      ctx.lineTo(s.x, s.y - 50)
    }
  })

  branchLayer = []
  treePoints = []

  stumps.forEach((s) => {
    btmW = rndmRng(62, 52) * (1 - s.layer * 0.1)
    topW = btmW * (5 / 6)
    offset = Math.round((btmW - topW) / 2)
    stumpH = Math.round(rndmRng(160, 140) * (1 - s.layer * 0.07))
    branchH = Math.round(stumpH / 2)
    const amount = 80 - Math.round(rndmRng(s.sparse[1], s.sparse[0])) * 5

    ctx.shadowColor = `hsla(56, 95%, ${Math.round(
      90 * ((s.layer / 2 + 1) * 0.28),
    )}%, .3)`
    ctx.shadowBlur = 15 - s.layer * 2
    ctx.shadowOffsetY = 0 - s.layer
    ctx.shadowOffsetX = s.layer
    ctx.save()

    ctx.shadowBlur = 0
    ctx.shadowOffsetY = 0
    ctx.shadowOffsetX = 0

    const tempColor = s.colorChange
    // eslint-disable-next-line no-param-reassign
    s.colorChange = 0.1
    drawLeaves(
      s.x,
      Math.round(s.y - rndmRng(h * 0.009, 0)),
      Math.round(18 + s.layer * 4),
      0,
      s,
      amount,
      Math.round(h * 0.18),
    )

    ctx.restore()

    const grd = ctx.createLinearGradient(s.x, s.y, s.x, s.y - stumpH)
    grd.addColorStop(0, `hsla(348, 7%, ${15 + s.layer * 2}%, 0)`)
    grd.addColorStop(0.3, `hsla(348, 7%, ${15 + s.layer * 2}%, .9)`)

    ctx.fillStyle = grd
    ctx.beginPath()
    ctx.moveTo(s.x, s.y)
    ctx.lineTo(Math.round(s.x + btmW), s.y)
    ctx.lineTo(Math.round(s.x + offset + topW), s.y - stumpH)
    ctx.lineTo(s.x + offset, s.y - stumpH)
    ctx.lineTo(s.x, s.y)
    ctx.fill()
    ctx.save()
    ctx.shadowBlur = 0
    ctx.shadowOffsetY = 0
    ctx.shadowOffsetX = 0

    drawLeaves(
      Math.round(s.x + h * 0.05),
      Math.round(s.y + stumpH * 1.6, 16 + s.layer * 4),
      0,
      s,
      amount,
      Math.round(stumpH * 1.8),
    )
    // eslint-disable-next-line no-param-reassign
    s.colorChange = tempColor

    ctx.restore()

    treeCenter = {
      x: Math.round(s.x + topW / 2 + offset),
      y: s.y - stumpH,
    }

    buildBranch(treeCenter, 0)
    branchLayer.push(treePoints)

    const halt = Math.floor(Math.sqrt(topW)) - 1
    const copy = branchLayer

    for (let j = 0; j < halt; j++) {
      btmW /= 2
      topW /= 2
      offset = (btmW - topW) / 2
      treePoints = []

      copy[j].forEach((l) => {
        buildBranch(l.tc, j + 1)
      })

      branchLayer.push(shuffle(treePoints))
    }

    treePoints = flatten(branchLayer)
    branchLayer = []

    treePoints.forEach(
      // eslint-disable-next-line no-return-assign, no-param-reassign
      (branch, k) => (branch.baseColor = drawBranch(branch, k, s)),
    )

    treePoints = []
  })
}
