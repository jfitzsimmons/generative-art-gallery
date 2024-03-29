import { ctx, h, w } from '../utils/canvas'
import { rndmRng, distanceToC, drawEllipseByCenter } from '../utils/helpers'

let maxCircles = Math.round((h * w) / rndmRng(8000, 5000))
let circleCount = 0
const cx = w * rndmRng(0.9, 0.1)
const cy = h * rndmRng(0.9, 0.1)
let spheres = []

function drawSphere(x, y, r, hue) {
  const ax = Math.round(x + rndmRng(r / 5, -r / 5))
  const ay = Math.round(y + rndmRng(r / 5, -r / 5))
  const alpha = distanceToC(ax, ay, cx, cy) / (h / 2 + w / 2) + 0.3

  //shadow
  ctx.shadowColor = `hsla(0, 0%, 1%, ${alpha.toFixed(1)})`
  ctx.shadowOffsetX = (x - cx) / (h * 0.17)
  ctx.shadowOffsetY = (y - cy) / (w * 0.01)
  ctx.shadowBlur = 3
  const rMod = (Math.abs(ctx.shadowOffsetX) + Math.abs(ctx.shadowOffsetY)) / 2

  //dark circle
  let grd = ctx.createRadialGradient(
    ax + ctx.shadowOffsetX,
    ay + ctx.shadowOffsetY,
    r / 10,
    ax,
    ay,
    r * 2,
  )
  grd.addColorStop(0, `hsla(0, 0%, 1%, 1`)
  grd.addColorStop(0.5, `hsla(0, 0%, 1%, .6)`)
  grd.addColorStop(0.9, `hsla(0, 0%, 1%, 0)`)
  ctx.fillStyle = grd

  ctx.beginPath(),
    ctx.arc(
      ax + ctx.shadowOffsetX,
      ay + ctx.shadowOffsetY,
      r + rMod * 1.8,
      0,
      2 * Math.PI,
    )
  ctx.fill()

  //glow
  ctx.shadowOffsetX = 0
  ctx.shadowOffsetY = 0
  ctx.shadowColor = `hsla(${hue - rMod / 3}, 87%, ${47 - rMod * 2.5}%, 1)`
  ctx.shadowBlur = 50

  //main circle
  grd = ctx.createRadialGradient(
    ax + ctx.shadowOffsetX,
    ay + ctx.shadowOffsetY,
    r / 10,
    ax,
    ay,
    r * 2.2,
  )
  grd.addColorStop(
    rndmRng(0.2, 0),
    `hsla(${hue - rMod}, 100%, ${58 - rMod * 2}%, 1)`,
  )
  grd.addColorStop(
    rndmRng(0.8, 0.5),
    `hsla(${hue - rMod / 2}, 87%, ${49 - rMod * 3}%, 1)`,
  )
  grd.addColorStop(1, `hsla(${hue - rMod / 4}, 74%, ${40 - rMod * 4}%, 0)`)
  ctx.fillStyle = grd

  ctx.beginPath(), ctx.arc(ax, ay, r, 0, 2 * Math.PI)
  ctx.fill()
}

function points(x, y, r) {
  let edge = r * 1.05
  let lines = 8
  let distance = (distanceToC(x, y, cx, cy) / (h / 2 + w / 2)) * 3
  let alpha = (
    Math.round((distanceToC(x, y, cx, cy) / (h / 2 + w / 2)) * 10) / 10
  ).toFixed(1)
  let btm = Math.random() > 0.66

  for (let i = 0; i < lines; i++) {
    let x1 = x
    let y1 = y
    let x2 = x + edge * distance * Math.cos((2 * Math.PI * i) / lines)
    let y2 = y + edge * distance * Math.sin((2 * Math.PI * i) / lines)

    let xs = [x1, x2].sort((a, b) => a - b)
    let ys = [y1, y2].sort((a, b) => a - b)

    let gradient = ctx.createLinearGradient(xs[0], ys[0], xs[1], ys[1])
    ctx.lineWidth = Math.round(r / 17)

    if (i === 3 || (i == 2 && btm))
      gradient = ctx.createLinearGradient(xs[0], ys[1], xs[1], ys[0])

    if (i === 1) gradient = ctx.createLinearGradient(xs[1], ys[1], xs[0], ys[0])

    if (i === 7 || i == 0)
      gradient = ctx.createLinearGradient(xs[1], ys[0], xs[0], ys[1])

    if (i === 6) {
      ctx.lineWidth *= 2
      gradient.addColorStop('.5', `hsla(53, 92%, 90%, 0)`)
      gradient.addColorStop('.8', `hsla(53, 92%, 90%, .1)`)
    }

    if (i === 0 || i === 4) {
      ctx.lineWidth *= 2 + 1
      gradient.addColorStop('.7', `hsla(53, 92%, 90%, 0)`)
      gradient.addColorStop('.9', `hsla(53, 92%, 90%, .1)`)
    }

    if (i === 2 && btm) {
      gradient.addColorStop(`${rndmRng(0.6, 0.3)}`, `hsla(53, 92%, 90%, 0)`)
      gradient.addColorStop(`${rndmRng(0.9, 0.8)}`, `hsla(53, 92%, 90%, .1)`)
      gradient.addColorStop('1', `hsla(53, 92%, 90%, ${alpha - 0.3})`)
      x2 += rndmRng(25, -25)
      y2 += rndmRng(25, -25)
    }

    if (i == 5 || i == 3 || i == 1 || i == 7)
      gradient.addColorStop('0', `hsla(53, 92%, 90%, 0)`)

    if (i !== 2)
      gradient.addColorStop('1', `hsla(53, 92%, 90%, ${alpha - 0.1})`)

    ctx.strokeStyle = gradient
    ctx.beginPath()
    ctx.moveTo(Math.round(x1), Math.round(y1))
    ctx.lineTo(Math.round(x2), Math.round(y2))
    ctx.stroke()
  }
}

function drawLight(x, y, r) {
  ctx.shadowOffsetX = 0
  ctx.shadowOffsetY = 0
  ctx.shadowBlur = 11
  ctx.shadowColor = `hsla(47, 95%, 85%, 1)`
  let ex = Math.round(x + rndmRng(r / 15, -r / 15))
  let ey = Math.round(y + rndmRng(r / 15, -r / 15))
  let distance = distanceToC(ex, ey, cx, cy) / (h / 2 + w / 2) + 0.1
  let dimension = (distance + 0.5) / 2.5
  let alpha =
    1 - Math.round(distance * 2 * 10) / 10 < 0
      ? 0
      : (1 - Math.round(distance * 2 * 10) / 10).toFixed(1)
  let alpha2 =
    Math.round(distance * 10) / 10 > 1
      ? 0.9
      : (Math.round(distance * 10) / 10 - 0.1).toFixed(1)

  points(x, y, r)

  let grd1 = ctx.createRadialGradient(
    ex,
    ey,
    r / 15,
    ex,
    ey,
    r * dimension * 0.75,
  )
  grd1.addColorStop(rndmRng(0.1, 0), `hsla(52, 75%, 88%, ${alpha2})`)
  grd1.addColorStop(rndmRng(0.7, 0.5), `hsla(45, 85%, 78%, ${alpha})`)
  grd1.addColorStop(0.8, `hsla(47, 95%, 68%, 0)`)
  ctx.fillStyle = grd1

  drawEllipseByCenter(
    ctx,
    ex,
    ey,
    Math.round(r * dimension * 0.7),
    Math.round(r * (dimension * 0.4)),
  )
}

function createRow(hue, center, amount) {
  let tempSpheres = []

  let x = Math.round(center.x - (amount - 1) * (center.r * 1.49))
  for (let j = amount; j--; ) {
    tempSpheres.push({ x, y: center.y, r: center.r, hue })
    x += Math.round(center.r * 1.49 * 2)
  }
  circleCount += tempSpheres.length
  spheres.push(tempSpheres)
}

function circleGroup() {
  while (circleCount < maxCircles) {
    const startX = Math.round(rndmRng(w * 0.5, w * -0.5))
    const startY = Math.round(rndmRng(h * 0.5, -h * 0.2))
    const hue = Math.round(rndmRng(361, 40))
    const circleRange = [
      Math.round(rndmRng(8, 1)),
      Math.round(rndmRng(8, 1)),
    ].sort()
    const minCircleX = circleRange[0]
    const maxCircleX = circleRange[1]
    const rows = (maxCircleX - (minCircleX - 1)) * 2 + 1
    const height = Math.round(h / rows)
    let tracker = minCircleX
    let mod = 1

    for (let i = rows; i--; ) {
      let center = {
        x: Math.round(startX + w * 0.5),
        y: Math.round(startY + (h - i * height - height / 2) * 0.71),
        r: height / 2,
      }
      createRow(hue, center, tracker)
      if (tracker === maxCircleX) {
        mod *= -1
        center.y = Math.round(
          startY + (h - (i - 1) * height - height / 2) * 0.71,
        )
        createRow(hue, center, tracker - 1)
        center.y = Math.round(
          startY + (h - (i - 2) * height - height / 2) * 0.71,
        )
        createRow(hue, center, tracker)
        i -= 2
      }
      tracker += mod
    }
  }
}

export function loadSyntheosis() {
  spheres = []
  circleCount = 0

  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, w, h)

  circleGroup()

  spheres.reverse().forEach((row) => {
    row.forEach((s) => {
      if (Math.random() > 0.5) drawSphere(s.x, s.y, s.r, s.hue)
      if (Math.random() > 0.5) drawLight(s.x, s.y + s.r * 3, s.r)
    })
  })
}
