import { ctx, h, w } from '../utils/canvas'
import { rndmRng, shuffle } from '../utils/helpers'

let dabR = w * 0.02
let x = 0
let y = 0
let count = 0
let hues = []
let sats = []
let lits = []
let dabArr = []

function dabDraw(dx, dy) {
  const inY = Math.round(dy + rndmRng(0, dabR * -1))
  const dabH = rndmRng(h * 0.35, h * 0.2)
  const hue = Math.round(rndmRng(hues[1], hues[0]))
  const sat = Math.round(rndmRng(sats[1], sats[0]))
  const lit = Math.round(rndmRng(lits[1], lits[0]))
  const satS = sat - 60 < 0 ? 0 : sat - 60
  const litS = lit - 60 < 0 ? 0 : lit - 60
  const dabRS = Math.round(dabR * rndmRng(1.07, 1.03))

  ctx.beginPath()
  let gradient = ctx.createLinearGradient(dx, inY, dx, inY + dabH)
  gradient.addColorStop(0, 'hsla(60, 60%, 2%, .5)')
  gradient.addColorStop(0.2, `hsla(${hue}, ${satS}%, ${litS}%, 0)`)

  ctx.arc(Math.round(dx), Math.round(inY), dabRS, 0, Math.PI, true)
  ctx.lineTo(Math.round(dx - dabR * 0.95), Math.round(inY + dabH * 0.9))
  ctx.lineTo(Math.round(dx + dabR * 0.95), Math.round(inY + dabH * 0.9))
  ctx.lineTo(Math.round(dx + dabRS), inY)
  ctx.fillStyle = gradient
  ctx.fill()

  const source = {
    x: rndmRng(dabR * 0.65, dabR * -0.65),
    y: rndmRng(dabR * 0.35, dabR * -0.35),
    b: rndmRng(0.4, 0.1),
  }

  ctx.beginPath()
  gradient = ctx.createLinearGradient(dx, inY, dx, inY + dabH)
  gradient.addColorStop(0, `hsla(60, 60%, 2%, ${0.41 - source.b})`)
  gradient.addColorStop(0.3, `hsla(${hue}, ${satS}%, ${litS}%, 0)`)

  ctx.arc(
    Math.round(dx + source.x / 5),
    Math.round(inY + source.y / 3),
    dabRS,
    0,
    Math.PI,
    true,
  )
  ctx.lineTo(Math.round(dx - dabR * 0.95), Math.round(inY + dabH * 0.9))
  ctx.lineTo(Math.round(dx + dabR * 0.95), Math.round(inY + dabH * 0.9))
  ctx.lineTo(Math.round(dx + source.x / 5 + dabRS), inY)
  ctx.fillStyle = gradient
  ctx.fill()

  ctx.beginPath()
  gradient = ctx.createLinearGradient(dx, inY, dx, inY + dabH)
  gradient.addColorStop(0.4, `hsla(${hue}, ${sat}%, ${lit}%, 1)`)
  gradient.addColorStop(1, `hsla(${hue}, ${sat}%, ${lit}%, 0)`)

  ctx.arc(dx, inY, dabR, 0, Math.PI, true)
  ctx.lineTo(dx - dabR, inY + dabH)
  ctx.lineTo(dx + dabR, inY + dabH)
  ctx.lineTo(dx + dabR, inY)
  ctx.fillStyle = gradient
  ctx.fill()

  ctx.beginPath()
  gradient = ctx.createRadialGradient(
    dx + source.x,
    inY + source.y,
    dabR / rndmRng(21, 9),
    dx,
    inY,
    dabR * 0.9,
  )
  gradient.addColorStop(
    0,
    `hsla(60, 60%, ${98 - (100 - lit) * 0.2}%, ${source.b})`,
  )
  gradient.addColorStop(0.5, `hsla(60, 60%, 98%, ${rndmRng(0.1, 0.01)})`)
  gradient.addColorStop(0.9, 'hsla(60, 60%, 98%, 0)')

  ctx.shadowColor = 'hsla(60, 40%, 15%, 0.4)'
  ctx.shadowBlur = 9
  ctx.shadowOffsetX = source.x / 3
  ctx.shadowOffsety = source.y / 2

  ctx.fillStyle = gradient
  ctx.fillRect(
    dx - dabR,
    inY - dabR,
    Math.round(dabR * 2),
    Math.round(dabR * 2),
  )

  ctx.shadowBlur = 0
  ctx.shadowOffsetX = 0
  ctx.shadowOffsety = 0
}

export default function loadDabs() {
  const spread = rndmRng(0.4, 0.1)
  dabArr = []
  x = Math.round(rndmRng(-1, dabR * -2))
  y = Math.round(rndmRng(dabR, dabR * -3))
  hues = [Math.round(rndmRng(360, 0)), Math.round(rndmRng(360, 0))].sort()
  sats = [Math.round(rndmRng(100, 10)), Math.round(rndmRng(100, 10))].sort()
  lits = [Math.round(rndmRng(90, 10)), Math.round(rndmRng(90, 10))].sort()
  count = 0

  ctx.fillStyle = `hsla(${Math.round((hues[0] + hues[1]) / 2)}, ${
    100 - (100 - Math.round((sats[0] + sats[1]) / 2))
  }%, ${100 - (100 - Math.round((lits[0] + lits[1]) / 2))}%, 1)`
  ctx.fillRect(0, 0, w, h)

  while (y < h + dabR) {
    const tempDabArr = []
    while (x < w + dabR) {
      dabR = Math.round(rndmRng(w * 0.023, w * 0.017))
      tempDabArr.push({ x, y })
      x += Math.round(rndmRng(dabR * (2 + spread), dabR * (2 - spread)))
    }
    // eslint-disable-next-line prefer-spread
    dabArr.push.apply(dabArr, shuffle(tempDabArr))
    count++
    x = count % 2 === 0 ? 0 : 0 - dabR
    y += Math.round(dabR * 2.1)
  }

  dabArr.forEach((d) => {
    dabDraw(Math.round(d.x), d.y)
  })
}
